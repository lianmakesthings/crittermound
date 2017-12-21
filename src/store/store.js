import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import { SmartRound } from '../lib/Helpers';
import { Critter, CritterFactory } from '../lib/Critter';
import SodProduction from '../lib/SodProduction';

Vue.use(Vuex);

const queen = CritterFactory.default(1, 0, Critter.GENDER_FEMALE);
queen.rank = Critter.RANK_ROYAL;
const king = CritterFactory.default(2, 0, Critter.GENDER_MALE);
king.rank = Critter.RANK_ROYAL;
const initialState = {
  totalCritters: 2,
  totalGenerations: 0,
  totalSod: 0,
  stateSaved: false,
  unlockedGenes: [],
  newGeneChance: 0,
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
      upgradeCost: 10,
      critters: []
    },
    male: {
      size: 1,
      sortBy: 'score',
      upgradeCost: 10,
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
      upgradeCost: 500,
      critters: []
    },
    farm: {
      sortBy: 'grassPerSecond',
      productionPerSecondRaw: 0,
      bonusPercent: 0,
      size: 1,
      upgradeCost: 500,
      critters: []
    },
    carry: {
      sortBy: 'carryPerSecond',
      productionPerSecondRaw: 0,
      bonusPercent: 0,
      size: 1,
      upgradeCost: 500,
      critters: []
    },
    factory: {
      sortBy: 'sodPerSecond',
      productionPerSecondRaw: 0,
      size: 1,
      bonusPercent: 0,
      upgradeCost: 500,
      critters: []
    }
  }
};

export const store = new Vuex.Store({
  state: initialState,
  getters: {
    allCritters: state => {
      return state.royalHatchery.mother.critters
        .concat(state.royalHatchery.father.critters)
        .concat(state.royalHatchery.female.critters)
        .concat(state.royalHatchery.male.critters)
        .concat(state.worker.mine.critters)
        .concat(state.worker.farm.critters)
        .concat(state.worker.carry.critters)
        .concat(state.worker.factory.critters);
    },
    allWorkers: state => {
      return state.worker.mine.critters
        .concat(state.worker.farm.critters)
        .concat(state.worker.carry.critters)
        .concat(state.worker.factory.critters);
    },
    critters: state =>
      (location, type) => {
        return state[location][type].critters;
      },
    totalCritters: state => state.totalCritters,
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
          .concat(state.royalHatchery.male.critters)
          .concat(state.worker.mine.critters)
          .concat(state.worker.farm.critters)
          .concat(state.worker.carry.critters)
          .concat(state.worker.factory.critters);
        return allCritters.find(critter => critterId === critter.id)
      },
    boosts: state =>
      location => {
        return state[location].boosts;
      },
    maxBoosts: state =>
      location => {
        return state[location].maxBoosts;
      },
    showStateSaved: state => state.stateSaved,
    newGeneChance: state => state.newGeneChance,
    unlockedGenes: state => state.unlockedGenes
  },
  mutations: {
    addChildToHatchery(state, {location, critter}) {
      state.totalCritters++;
      const mound = state[location][critter.gender];
      mound.critters.push(critter);
      mound.critters.sort((a, b) => b[mound.sortBy] - a[mound.sortBy]);
      if (mound.critters.length > mound.size) {
        mound.critters.pop()
      }
    },
    setTotalGenerations(state, val) {
      state.totalGenerations = val;
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
          critter.currentHealth = 0;
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
    },
    upgradeMound(state, {location, type}) {
      const mound = state[location][type];
      mound.size += 1;
      mound.upgradeCost = mound.upgradeCost * 10;
    },
    saveState(state) {
    },
    setStateSaved(state, bool) {
      state.stateSaved = bool;
    },
    setNewGeneChance(state, val) {
      state.newGeneChance = val;
    },
    addDiscoveredGene(state, id) {
      state.unlockedGenes.push(id)
    }
  },
  actions: {
    healAllCritters: (context) => {
      context.getters.allCritters.forEach(critter => {
        const value = critter.currentHealth + critter.maxHealth / critter.actionTime;
        context.commit('setCritterHealth', {critter, value});
      })
    },
    resetCritterHealth: (context, critterId) => {
      const critter = context.getters.findCritter(critterId);
      context.commit('setCritterHealth', {critter, value: 0})
    },
    breedCritter: (context, location) => {
      const id = context.getters.totalCritters + 1;
      const mother = context.getters.critters(location, 'mother')[0];
      const father = context.getters.critters(location, 'father')[0];
      const generation = Math.max(mother.generation, father.generation) + 1;
      context.commit('setTotalGenerations', generation);
      context.commit('setCritterHealth', {critter: mother, value: 0});
      context.commit('setCritterHealth', {critter: father, value: 0});
      const child = CritterFactory.breed(id, mother, father, store);
      context.commit('addChildToHatchery', {location, critter : child})
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
        const sodProduction = new SodProduction(context.state);
        const destination = sodProduction.allocateWorker(critter);
        context.commit('moveCritter', {
          from: {location, type},
          to: destination
        });

        if (destination) context.commit('updateProductionRaw')
      }
    },
    useBoost: (context, location) => {
      const value = context.getters.boosts(location) - 1;
      context.commit('setBoost', {location, value});
      context.dispatch('breedCritter', location);
    },
    setBoost: (context, payload) => {
      context.commit('setBoost', payload)
    },
    produce: (context, {payload, addSod}) => {
      context.commit('updateProductionMounds', payload);
      const value = context.getters.totalSod + addSod;
      context.commit('setSodAmount', value);
    },
    upgradeMound: (context, {location, type}) => {
      const sod = context.getters.totalSod;
      const mound = context.getters.mound(location, type);
      const upgradeCost = mound.upgradeCost;
      if (upgradeCost <= sod) {
        context.commit('upgradeMound', {location, type});
        context.commit('setSodAmount', sod - upgradeCost);
      }
    },
    saveState: (context) => {
      context.commit('saveState');
      context.commit('setStateSaved', true);
      setTimeout(() => context.commit('setStateSaved', false), 5000)
    },
    setNewGeneChance: (context, value) => {
      context.commit('setNewGeneChance', value)
    },
    addDiscoveredGene: (context, geneId) => {
      context.commit('addDiscoveredGene', geneId);
    }
  },
  plugins: [createPersistedState({
    key: 'crittermound',
    filter: (mutation) => mutation.type === 'saveState',
    getState: (key, storage) => {
      let state = initialState;
      if (storage[key]) {
        state = JSON.parse(storage[key]);
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
        }];
        mounds.forEach(address => {
          const critters = state[address.location][address.type].critters;
          state[address.location][address.type].critters = critters.map(critter => CritterFactory.fromState(critter))
        });
      }

      return state
    }
  })]
});
