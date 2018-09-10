import { ticksPerSecond } from './Helpers';
import Achievement from './Achievement';
import CritterFactory from '../lib/CritterFactory';

class Controller {
  constructor() {
    this.timeBetweenTicks = 1000 / ticksPerSecond;
    this.lastTick = null;
    this.timeBetweenSaves = 5 * 60 * 1000;
    this.lastSave = null;
    this.timeBetweenAchievementChecks = 1000;
    this.lastAchievementCheck = null;
  }

  breed(state, location) {
    const currentBoosts = state[location].boosts;
    const totalBoosts = state[location].maxBoosts;
    if (currentBoosts < totalBoosts) {
      state[location].boosts = Math.round((currentBoosts+.1)*10)/10;
    }

    const id = state.totalCritters + 1;
    const mother = state[location].mother.critters[0];
    const father = state[location].father.critters[0];
    mother.currentHealth = 0;
    father.currentHealth = 0;
    return CritterFactory.breed(id, mother, father, state);
  }

  produceSod(state, changes) {
    const sodProduction = state.worker;
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

    changes.sodProduction.dirtPerSecond = dirtPerSecondRaw - removedDirt*ticksPerSecond;
    changes.sodProduction.grassPerSecond = grassPerSecondRaw - removedGrass*ticksPerSecond;
    changes.sodProduction.dirtStored = dirtStored;
    changes.sodProduction.grassStored = grassStored;
    changes.sodProduction.dirtCarriedPerSecond = removedDirt * ticksPerSecond - removedResources * ticksPerSecond;
    changes.sodProduction.grassCarriedPerSecond = removedGrass * ticksPerSecond - removedResources * ticksPerSecond;
    changes.sodProduction.factoryDirtStored = factoryDirt;
    changes.sodProduction.factoryGrassStored = factoryGrass;
    changes.sodProduction.sodPerSecond = removedResources * ticksPerSecond;
    changes.addSod = removedResources
  }

  tick(state, changes) {
    const location = 'royalHatchery';
    const queen = state[location].mother.critters[0];
    const king = state[location].father.critters[0];

    const crittersToHeal = state.royalHatchery.mother.critters
      .concat(state.royalHatchery.father.critters)
      .concat(state.soldiers.army.critters);

    crittersToHeal.forEach(critter => {
      critter.currentHealth = critter.currentHealth + critter.maxHealth / critter.actionTime;
      changes.critters.push(critter)
    });

    const allWorkers = state.worker.mine.critters
      .concat(state.worker.farm.critters)
      .concat(state.worker.carry.critters)
      .concat(state.worker.factory.critters);

    allWorkers.forEach(critter => {
      critter.currentHealth = critter.currentHealth + critter.maxHealth / critter.actionTime;
      if (critter.progress >= 100) {
        critter.currentHealth = 0;
        changes.critters.push(critter)
      }
    });

    if (queen.progress >= 100 && king.progress >= 100) {
      const child = this.breed(state, location);

      const mound = state[location][child.gender];
      mound.critters.push(child);
      mound.critters.sort((a, b) => b[mound.sortBy] - a[mound.sortBy]);
      if (mound.critters.length > mound.size) {
        mound.critters.pop()
      }
    }

    changes.critters = changes.critters
      .concat(state.royalHatchery.female.critters)
      .concat(state.royalHatchery.male.critters);

    this.produceSod(state, changes);
  }

  save() {

  }

  populate(state) {
    const mounds = [{
      location: 'royalHatchery',
      type: 'mother'
    }, {
      location: 'royalHatchery',
      type: 'father'
    }, {
      location: 'royalHatchery',
      type: 'female'
    }, {
      location: 'royalHatchery',
      type: 'male'
    }, {
      location: 'worker',
      type: 'mine'
    }, {
      location: 'worker',
      type: 'farm'
    }, {
      location: 'worker',
      type: 'carry'
    }, {
      location: 'worker',
      type: 'factory'
    }, {
      location: 'soldiers',
      type: 'army'
    }];

    mounds.forEach(address => {
      const critters = state[address.location][address.type].critters;
      state[address.location][address.type].critters = critters.map(critter => CritterFactory.fromState(critter))
    });

    return state;
  }

  checkTick(timestamp, state) {
    state = this.populate(state);
    const changes = {
      critters: [],
      sodProduction: {},
      addSod: 0,
      achievements: state.achievements
    };

    if (!this.lastTick) this.lastTick = timestamp;
    const timeSinceLastTick = timestamp - this.lastTick;
    if (timeSinceLastTick >= this.timeBetweenTicks) {
      this.lastTick = timestamp;
      this.tick(state, changes);
    }
    // if (!this.lastSave) this.lastSave = timestamp;
    // const timeSinceLastSave = timestamp - this.lastSave;
    // if (timeSinceLastSave >= this.timeBetweenSaves) {
    //   this.lastSave = timestamp;
    //   this.save();
    // }
    if (!this.lastAchievementCheck) this.lastAchievementCheck = timestamp;
    const timeSinceLastAchievementCheck = timestamp - this.lastAchievementCheck;
    if(timeSinceLastAchievementCheck >= this.timeBetweenAchievementChecks) {
      this.lastAchievementCheck = timestamp;
      Achievement.check(state, changes)
    }

    return changes;
  }
}

export default Controller;
