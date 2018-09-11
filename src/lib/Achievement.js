import achievements from './achievements.json';
import Trait from './Trait';

class Achievement {
  static check(state, changes) {
    for (let typeId = this.TYPE_VITALITY; typeId < state.achievements.length; typeId++) {
      let checkFn;
      const currLevel = state.achievements[typeId];
      const achievement = achievements[typeId][currLevel];

      switch(typeId) {
        case this.TYPE_VITALITY:
          checkFn = (state) => {
            const allCritters = state.royalHatchery.mother.critters
             .concat(state.royalHatchery.father.critters)
             .concat(state.royalHatchery.female.critters)
             .concat(state.royalHatchery.male.critters)
             .concat(state.worker.mine.critters)
             .concat(state.worker.farm.critters)
             .concat(state.worker.carry.critters)
             .concat(state.worker.factory.critters);
            return allCritters.find(critter => critter.traits[Trait.ID_VITALITY].value >= achievement.value)
          };
         break;
        case this.TYPE_STRENGTH:
          checkFn = (state) => {
            const allCritters = state.royalHatchery.mother.critters
              .concat(state.royalHatchery.father.critters)
              .concat(state.royalHatchery.female.critters)
              .concat(state.royalHatchery.male.critters)
              .concat(state.worker.mine.critters)
              .concat(state.worker.farm.critters)
              .concat(state.worker.carry.critters)
              .concat(state.worker.factory.critters);
            return allCritters.find(critter => critter.traits[Trait.ID_STRENGTH].value >= achievement.value)
          };
          break;
        case this.TYPE_AGILITY:
          checkFn = (state) => {
            const allCritters = state.royalHatchery.mother.critters
              .concat(state.royalHatchery.father.critters)
              .concat(state.royalHatchery.female.critters)
              .concat(state.royalHatchery.male.critters)
              .concat(state.worker.mine.critters)
              .concat(state.worker.farm.critters)
              .concat(state.worker.carry.critters)
              .concat(state.worker.factory.critters);
            return allCritters.find(critter => critter.traits[Trait.ID_AGILITY].value >= achievement.value)
          };
          break;
        case this.TYPE_BITE:
          checkFn = (state) => {
            const allCritters = state.royalHatchery.mother.critters
              .concat(state.royalHatchery.father.critters)
              .concat(state.royalHatchery.female.critters)
              .concat(state.royalHatchery.male.critters)
              .concat(state.worker.mine.critters)
              .concat(state.worker.farm.critters)
              .concat(state.worker.carry.critters)
              .concat(state.worker.factory.critters);
            return allCritters.find(critter => critter.traits[Trait.ID_BITE].value >= achievement.value)
          };
          break;
        case this.TYPE_STING:
          checkFn = (state) => {
            const allCritters = state.royalHatchery.mother.critters
              .concat(state.royalHatchery.father.critters)
              .concat(state.royalHatchery.female.critters)
              .concat(state.royalHatchery.male.critters)
              .concat(state.worker.mine.critters)
              .concat(state.worker.farm.critters)
              .concat(state.worker.carry.critters)
              .concat(state.worker.factory.critters);
            return allCritters.find(critter => critter.traits[Trait.ID_STING].value >= achievement.value)
          };
          break;
        case this.TYPE_MUTATION:
          checkFn = (state) => {
            const allCritters = state.royalHatchery.mother.critters
              .concat(state.royalHatchery.father.critters)
              .concat(state.royalHatchery.female.critters)
              .concat(state.royalHatchery.male.critters)
              .concat(state.worker.mine.critters)
              .concat(state.worker.farm.critters)
              .concat(state.worker.carry.critters)
              .concat(state.worker.factory.critters);
            return allCritters.find(critter => critter.mutations >= achievement.value)
          };
          break;
        case this.TYPE_SCORE:
          checkFn = (store) => {
            const allCritters = state.royalHatchery.mother.critters
              .concat(state.royalHatchery.father.critters)
              .concat(state.royalHatchery.female.critters)
              .concat(state.royalHatchery.male.critters)
              .concat(state.worker.mine.critters)
              .concat(state.worker.farm.critters)
              .concat(state.worker.carry.critters)
              .concat(state.worker.factory.critters);
            return allCritters.find(critter => critter.score >= achievement.value)
          };
          break;
        case this.TYPE_GENERATION:
          checkFn = (store) => {
            const allCritters = state.royalHatchery.mother.critters
              .concat(state.royalHatchery.father.critters)
              .concat(state.royalHatchery.female.critters)
              .concat(state.royalHatchery.male.critters)
              .concat(state.worker.mine.critters)
              .concat(state.worker.farm.critters)
              .concat(state.worker.carry.critters)
              .concat(state.worker.factory.critters);
            return allCritters.find(critter => critter.generation >= achievement.value)
          };
          break;
        case this.TYPE_CRITTERS:
          checkFn = (store) => {
            return store.totalCritters >= achievement.value;
          };
          break;
        case this.TYPE_DIRT:
          checkFn = (store) => {
            return store.worker.dirtPerSecond >= achievement.value;
          };
          break;
        case this.TYPE_GRASS:
          checkFn = (store) => {
            return store.worker.grassPerSecond >= achievement.value;
          };
          break;
        case this.TYPE_SOD:
          checkFn = (store) => {
            return store.worker.sodPerSecond >= achievement.value;
          };
          break;
        default:
          checkFn = () => false;
      }

      if (checkFn(state)) {
        changes.achievements[achievement.typeId] = achievement.level+1;
      }
    }
  }

  static allAchievements() {
    return achievements.reduce((acc, curr) => {
      return acc.concat(curr)
    }, [])
  }
}

Achievement.TYPE_VITALITY = 0;
Achievement.TYPE_STRENGTH = 1;
Achievement.TYPE_AGILITY = 2;
Achievement.TYPE_BITE = 3;
Achievement.TYPE_STING = 4;
Achievement.TYPE_MUTATION = 5;
Achievement.TYPE_SCORE = 6;
Achievement.TYPE_GENERATION = 7;
Achievement.TYPE_CRITTERS = 8;
Achievement.TYPE_DIRT = 9;
Achievement.TYPE_GRASS = 10;
Achievement.TYPE_SOD = 11;
Achievement.TYPE_BATTLES = 12;
Achievement.TYPE_MINES = 13;
Achievement.TYPE_FARMS = 14;
Achievement.TYPE_EQUIPMENT = 15;
Achievement.TYPE_FACTORIES = 16;
Achievement.TYPE_ENEMY_GENES = 17;
Achievement.TYPE_HIGH_GROUND = 18;
Achievement.TYPE_BOOST_UPGRADES = 19;
Achievement.TYPE_FORTS = 20;
Achievement.TYPE_MAP = 21;

export default Achievement;
