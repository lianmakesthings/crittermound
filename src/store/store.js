import Vue from 'vue';
import Vuex from 'vuex';
import { SmartRound } from '../lib/Helpers';
import { Critter, CritterFactory } from '../lib/Critter';

Vue.use(Vuex);

const queen = CritterFactory.default(1, 0, Critter.GENDER_FEMALE);
queen.rank = Critter.RANK_ROYAL;
const king = CritterFactory.default(2, 0, Critter.GENDER_MALE);
king.rank = Critter.RANK_ROYAL;

export const store = new Vuex.Store({
  state: {
    totalCritters: 2,
    totalGenerations: 0,
    totalSod: 0,
    royalHatchery: {
      boosts: 10,
      maxBoosts: 10,
      mother: {
        size: 1,
        sortBy: 'score',
        critters: [queen]
      },
      father: {
        size: 1,
        sortBy: 'score',
        critters: [king]
      },
      female: {
        size: 1,
        sortBy: 'score',
        critters: []
      },
      male: {
        size: 1,
        sortBy: 'score',
        critters: []
      }
    },
    worker: {
      dirtStored: 0,
      grassStored: 0,
      factoryDirtStored: 0,
      factoryGrassStored: 0,
      dirtPerSecond: 0,
      grassPerSecond: 0,
      dirtCarriedPerSecond: 0,
      grassCarriedPerSecond: 0,
      sodPerSecond: 0,
      mine: {
        sortBy: 'dirtPerSecond',
        productionPerSecondRaw: 0,
        bonusPercent: 0,
        size: 1,
        critters: []
      },
      farm: {
        sortBy: 'grassPerSecond',
        productionPerSecondRaw: 0,
        bonusPercent: 0,
        size: 1,
        critters: []
      },
      carry: {
        sortBy: 'carryPerSecond',
        productionPerSecondRaw: 0,
        bonusPercent: 0,
        size: 1,
        critters: []
      },
      factory: {
        sortBy: 'sodPerSecond',
        productionPerSecondRaw: 0,
        size: 1,
        bonusPercent: 0,
        critters: []
      }
    }
  },
  getters: {
    critters: state =>
      (location, type) => {
        return state[location][type].critters;
      },
    sodProduction: state => state.worker,
    totalSod: state => state.totalSod,
    mound: state =>
      (location, type) => {
        return state[location][type]
      },
    findCritter: state =>
      critterId => {
        const allCritters = state.royalHatchery.mother.critters
          .concat(state.royalHatchery.father.critters)
          .concat(state.royalHatchery.female.critters)
          .concat(state.royalHatchery.male.critters);
        return allCritters.find(critter => critterId === critter.id)
      },
    lowestWorker: state => {
      return type => {
        const mound = state.worker[type];
        let result = 0;
        if (mound.critters.length > 0) {
          result = mound.critters[mound.critters.length - 1][mound.sortBy]
        }
        return result;
      }
    },
    boosts: state =>
      location => {
        return state[location].boosts;
      },
    maxBoosts: state =>
      location => {
        return state[location].maxBoosts;
      },
  },
  mutations: {
    breed(state, {mother, father, location}) {
      state.totalCritters++;
      const id = state.totalCritters;
      const generation = Math.max(mother.generation, father.generation) + 1;
      state.totalGenerations = Math.max(state.totalGenerations, generation);
      const child = CritterFactory.breed(id, mother, father);
      const mound = state[location][child.gender];
      mound.critters.push(child);
      mound.critters.sort((a, b) => b[mound.sortBy] - a[mound.sortBy]);
      if (mound.critters.length > mound.size) {
        mound.critters.pop()
      }
    },
    setCritterHealth(state, {critter, value}) {
      critter.currentHealth = value;
    },
    moveCritter(state, {from, to}) {
      const originMound = state[from.location][from.type];
      if (originMound.critters.length > 0) {
        const critter = originMound.critters.shift();
        if (to) {
          const targetMound = state[to.location][to.type];
          if (targetMound.critters.length >= targetMound.size) {
            targetMound.critters.pop();
          }
          targetMound.critters.push(critter);
          targetMound.critters.sort((a,b) => b[targetMound.sortBy] - a[targetMound.sortBy])
        }
      }
    },
    setStored(state, {type, value}) {
      state.worker[type].productionPerSecondRaw = value
    },
    updateProductionRaw(state) {
      for (let type in state.worker) {
        if (state.worker.hasOwnProperty(type) && isNaN(state.worker[type])) {
          let value = state.worker[type].critters.reduce((acc, critter) => {
            return acc + critter[state.worker[type].sortBy];
          }, 0);
          value = value * (1 + state.worker[type].bonusPercent/100);
          state.worker[type].productionPerSecondRaw = value;
        }
      }
    },
    updateProductionMounds(state, payload) {
      for (let type in payload) {
        if(payload.hasOwnProperty(type)) {
          state.worker[type] = payload[type]
        }
      }
    },
    setBoost(state, {location, value}) {
      state[location].boosts = value;
    },
    setSodAmount(state, value) {
      state.totalSod = value;
    }
  },
  actions: {
    healCritter: (context, critterId) => {
      const critter = context.getters.findCritter(critterId);
      const value = critter.currentHealth + critter.maxHealth / critter.actionTime;
      context.commit('setCritterHealth', {critter, value});

    },
    breedCritter: (context, location) => {
      const mother = context.getters.critters(location, 'mother')[0];
      const father = context.getters.critters(location, 'father')[0];
      context.commit('setCritterHealth', {critter: mother, value: 0});
      context.commit('setCritterHealth', {critter: father, value: 0});
      context.commit('breed', {mother, father, location});

    },
    replaceParent: (context, {location, type}) => {
      const parent = (type === Critter.GENDER_FEMALE) ? 'mother' : 'father';
      context.commit('moveCritter', {
        from: {location, type},
        to: {location, type: parent}
      });
    },
    addWorker: (context, {location, type}) => {
      const mound = context.state[location][type];
      const critter = mound.critters[0];
      if (critter) {
        const productions = [
          {
            type: 'mine',
            canAdd: critter.dirtPerSecond>context.getters.lowestWorker('mine') || context.state.worker.mine.critters.length<context.state.worker.mine.size,
            production: context.state.worker.mine.productionPerSecondRaw
          },{
            type: 'farm',
            canAdd: critter.grassPerSecond>context.getters.lowestWorker('farm') || context.state.worker.farm.critters.length<context.state.worker.farm.size,
            production: context.state.worker.farm.productionPerSecondRaw
          }, {
            type: 'carry',
            canAdd: critter.carryPerSecond>context.getters.lowestWorker('carry') || context.state.worker.carry.critters.length<context.state.worker.carry.size,
            production: context.state.worker.carry.productionPerSecondRaw
          }, {
            type: 'factory',
            canAdd: critter.sodPerSecond>context.getters.lowestWorker('factory') || context.state.worker.factory.critters.length<context.state.worker.factory.size,
            production: context.state.worker.factory.productionPerSecondRaw
          }
        ];
        productions.sort((a,b) => a.productionPerSecondRaw - b.productionPerSecondRaw);

        const production = productions.find(prod => prod.canAdd);
        if (production) {
          context.commit('moveCritter', {
            from: {location, type},
            to: {location: 'worker', type: production.type}
          });

          context.commit('updateProductionRaw')
        } else {
          context.commit('moveCritter', {
            from: {location, type},
            to: null
          });
        }
      }
    },
    useBoost: (context, location) => {
      const mother = context.getters.critters(location, 'mother')[0];
      const father = context.getters.critters(location, 'father')[0];
      context.commit('setCritterHealth', {critter: mother, value: 0});
      context.commit('setCritterHealth', {critter: father, value: 0});
      const value = context.getters.boosts(location) - 1;
      context.commit('setBoost', {location, value});
      context.commit('breed', {mother, father, location});
    },
    setBoost: (context, payload) => {
      context.commit('setBoost', payload)
    },
    produce: (context, {payload, addSod}) => {
      context.commit('updateProductionMounds', payload);
      const value = context.getters.totalSod + addSod;
      context.commit('setSodAmount', value);
    }
  }
});
