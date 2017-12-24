import achievements from './achievements.json';
import Trait from './Trait';

class Achievements {
  static check(state, changes) {
    for (let typeId = this.TYPE_VITALITY; typeId < this.TYPE_MAP; typeId++) {
      let checkFn;
      const currLevel = state.achievements[typeId];
      const achievement = achievements[typeId][currLevel+1];

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
        changes.achievements[achievement.typeId] = achievement.level;
      }
    }
  }

  static allAchievements() {
    return achievements.reduce((acc, curr) => {
      return acc.concat(curr)
    }, [])
  }
}

Achievements.TYPE_VITALITY = 0;
Achievements.TYPE_STRENGTH = 1;
Achievements.TYPE_AGILITY = 2;
Achievements.TYPE_BITE = 3;
Achievements.TYPE_STING = 4;
Achievements.TYPE_MUTATION = 5;
Achievements.TYPE_SCORE = 6;
Achievements.TYPE_GENERATION = 7;
Achievements.TYPE_CRITTERS = 8;
Achievements.TYPE_DIRT = 9;
Achievements.TYPE_GRASS = 10;
Achievements.TYPE_SOD = 11;
Achievements.TYPE_BATTLES = 12;
Achievements.TYPE_MINES = 13;
Achievements.TYPE_FARMS = 14;
Achievements.TYPE_EQUIPMENT = 15;
Achievements.TYPE_FACTORIES = 16;
Achievements.TYPE_ENEMY_GENES = 17;
Achievements.TYPE_HIGH_GROUND = 18;
Achievements.TYPE_BOOST_UPGRADES = 19;
Achievements.TYPE_FORTS = 20;
Achievements.TYPE_MAP = 21;

export default Achievements;
