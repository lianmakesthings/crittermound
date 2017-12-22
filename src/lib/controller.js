import { ticksPerSecond, SmartRound } from './Helpers';
import Achievements from './Achievements';

class Controller {
  constructor(store) {
    this.store = store;
    this.timeBetweenTicks = 1000 / ticksPerSecond;
    this.lastTick = null;
    this.timeBetweenSaves = 5 * 60 * 1000;
    this.lastSave = null;
    this.timeBetweenAchievementChecks = 1000;
    this.lastAchievementCheck = null;
  }

  breed(location) {
    const currentBoosts = this.store.getters.boosts(location);
    const totalBoosts = this.store.getters.maxBoosts(location);
    if (currentBoosts < totalBoosts) {
      const newBoost = Math.round((currentBoosts+.1)*10)/10;
      this.store.dispatch('setBoost', {location: location, value: newBoost})
    }

    this.store.dispatch('breedCritter', location);
  }

  produceSod(){
    const sodProduction = this.store.getters.sodProduction;
    const mineMound = sodProduction.mine;
    const farmMound = sodProduction.farm;
    const carryMound = sodProduction.carry;
    const factoryMound = sodProduction.factory;

    const dirtPerSecondRaw = mineMound.productionPerSecondRaw;
    const grassPerSecondRaw = farmMound.productionPerSecondRaw;
    const carryPerSecondRaw = carryMound.productionPerSecondRaw;
    const sodPerSecondRaw = factoryMound.productionPerSecondRaw;

    let dirtStored = sodProduction.dirtStored + dirtPerSecondRaw/ticksPerSecond;
    let grassStored = sodProduction.grassStored + grassPerSecondRaw/ticksPerSecond;
    const carryPerTickRaw = carryPerSecondRaw/ticksPerSecond;
    const removedDirt = Math.min(dirtStored, carryPerTickRaw);
    const removedGrass = Math.min(grassStored, carryPerTickRaw);
    dirtStored = dirtStored - removedDirt;
    grassStored = grassStored - removedGrass;

    let factoryDirt = sodProduction.factoryDirtStored + removedDirt;
    let factoryGrass = sodProduction.factoryGrassStored + removedGrass;

    const sodPerTickRaw = sodPerSecondRaw/ticksPerSecond;
    const lowestResourceStored = Math.min(factoryDirt, factoryGrass);
    const removedResources = Math.min(lowestResourceStored, sodPerTickRaw);
    factoryDirt = factoryDirt - removedResources;
    factoryGrass = factoryGrass - removedResources;

    const payload = {
      dirtPerSecond: dirtPerSecondRaw - removedDirt*ticksPerSecond,
      grassPerSecond: grassPerSecondRaw - removedGrass*ticksPerSecond,
      dirtStored: dirtStored,
      grassStored: grassStored,
      dirtCarriedPerSecond: removedDirt * ticksPerSecond - removedResources * ticksPerSecond,
      grassCarriedPerSecond: removedGrass * ticksPerSecond - removedResources * ticksPerSecond,
      factoryDirtStored: factoryDirt,
      factoryGrassStored: factoryGrass,
      sodPerSecond: removedResources * ticksPerSecond
    };
    this.store.dispatch('produce', {payload, addSod: removedResources});
  }

  tick() {
    const location = 'royalHatchery';
    const queen = this.store.getters.mound(location, 'mother').critters[0];
    const king = this.store.getters.mound(location, 'father').critters[0];

    this.store.dispatch('healAllCritters');
    if (queen.progress >= 100 && king.progress >= 100) {
      this.breed(location)
    }
    this.store.getters.allWorkers.forEach(critter => {
      if (critter.progress >= 100) {
        this.store.dispatch('resetCritterHealth', critter.id)
      }
    });
    this.produceSod();
  }

  save() {
    this.store.dispatch('saveState');
  }

  checkTick(timestamp) {
    if (!this.lastTick) this.lastTick = timestamp;
    const timeSinceLastTick = timestamp - this.lastTick;
    if (timeSinceLastTick >= this.timeBetweenTicks) {
      this.lastTick = timestamp;
      this.tick();
    }
    if (!this.lastSave) this.lastSave = timestamp;
    const timeSinceLastSave = timestamp - this.lastSave;
    if (timeSinceLastSave >= this.timeBetweenSaves) {
      this.lastSave = timestamp;
      this.save();
    }
    if (!this.lastAchievementCheck) this.lastAchievementCheck = timestamp;
    const timeSinceLastAchievementCheck = timestamp - this.lastAchievementCheck;
    if(timeSinceLastAchievementCheck >= this.timeBetweenAchievementChecks) {
      this.lastAchievementCheck = timestamp;
      Achievements.check(this.store)
    }
    window.requestAnimationFrame(this.checkTick.bind(this));
  }

  start() {
    window.requestAnimationFrame(this.checkTick.bind(this));
  }
}

export default Controller;
