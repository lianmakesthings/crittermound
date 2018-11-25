import Vue from 'vue';
import Vuex from 'vuex';
import CritterFactory from '../lib/CritterFactory';
import Critter from '../lib/Critter';
import Sorter from '../lib/Sorter';
import SodProduction from '../lib/SodProduction';
import Achievement from '../lib/Achievement';
import Nation from '../lib/Nation';
import War from '../lib/War';
import localforage from 'localforage';
import state from './state.json';

Vue.use(Vuex);
let store;

const initializeStore = async () => {
  let initialState;
  try {
    localforage.config({
      driver: localforage.INDEXEDDB,
      name: 'crittermound',
      storeName: 'crittermound'
    });
    initialState = await localforage.getItem('crittermound');
    const mounds = [
      {
        location: 'royalHatchery',
        type: 'mother'
      },
      {
        location: 'royalHatchery',
        type: 'father'
      },
      {
        location: 'royalHatchery',
        type: 'female'
      },
      {
        location: 'royalHatchery',
        type: 'male'
      },
      {
        location: 'worker',
        type: 'mine'
      },
      {
        location: 'worker',
        type: 'farm'
      },
      {
        location: 'worker',
        type: 'carry'
      },
      {
        location: 'worker',
        type: 'factory'
      },
      {
        location: 'soldiers',
        type: 'army'
      }
    ];

    mounds.forEach(address => {
      const critters = initialState[address.location][address.type].critters;
      initialState[address.location][address.type].critters = critters.map(critter => CritterFactory.fromState(critter))
    });
  } catch (err) {
    initialState = JSON.parse(JSON.stringify(state));

    const queen = CritterFactory.default(1, 0, Critter.GENDER_FEMALE);
    queen.rank = Critter.RANK_ROYAL;
    const king = CritterFactory.default(2, 0, Critter.GENDER_MALE);
    king.rank = Critter.RANK_ROYAL;

    initialState.royalHatchery.mother.critters.push(queen);
    initialState.royalHatchery.father.critters.push(king);
    initialState.soldiers.unlockedNations.push(Nation.CRICKETS);
  }

  store = new Vuex.Store({
    state: initialState,
    getters: {
      entireState: state => state,
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
            .concat(state.worker.factory.critters)
            .concat(state.soldiers.army.critters);
          return allCritters.find(critter => critterId === critter.id)
        },
      boosts: state => state.royalHatchery.boosts,
      maxBoosts: state => state.royalHatchery.maxBoosts,
      showStateSaved: state => state.stateSaved,
      newGeneChance: state => state.newGeneChance,
      unlockedGenes: state => state.unlockedGenes,
      sorts: state => Sorter.getAllNames(),
      royalHatcheryAlloc: state => {
        const current = state.royalHatchery.female.critters.length + state.royalHatchery.male.critters.length;
        const max = state.royalHatchery.female.size + state.royalHatchery.male.size;
        return {current, max}
      },
      workerAlloc: state => {
        const current = state.worker.mine.critters.length + state.worker.farm.critters.length + state.worker.carry.critters.length + state.worker.factory.critters.length;
        const max = state.worker.mine.size + state.worker.farm.size + state.worker.carry.size + state.worker.factory.size;
        return {current, max}
      },
      unlockedAchievements: state => {
        return state.achievements
      },
      armyAlloc: state => {
        const current = state.soldiers.army.critters.length;
        const max = state.soldiers.army.size;
        return {current, max}
      },
      achievementQuota: state => {
        const current = state.achievements.reduce((acc, curr) => {
          return acc + curr;
        }, 0);
        const max = Achievement.allAchievements().length;
        return {current, max}
      },
      atWar: state => state.soldiers.currentWar != null,
      currentMap: state => state.soldiers.currentWar.map,
      isNationUnlocked: state =>
        nationId => {
          return !!state.soldiers.unlockedNations.find(nation => nation.id === nationId)
        }
    },
    mutations: {
      addChildToHatchery(state, {location, critter}) {
        state.totalCritters++;
        state.totalGenerations = Math.max(critter.generation, state.totalGenerations);
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
      setCritterHealth(state, {critterId, value}) {
        const allCritters = state.royalHatchery.mother.critters
          .concat(state.royalHatchery.father.critters)
          .concat(state.royalHatchery.female.critters)
          .concat(state.royalHatchery.male.critters)
          .concat(state.worker.mine.critters)
          .concat(state.worker.farm.critters)
          .concat(state.worker.carry.critters)
          .concat(state.worker.factory.critters)
          .concat(state.soldiers.army.critters);
        const critter = allCritters.find(critter => critterId === critter.id);
        critter.currentHealth = value;
      },
      moveCritter(state, {from, to}) {
        const originMound = state[from.location][from.type];
        if (originMound.critters.length > 0) {
          const critter = originMound.critters.shift();
          const targetMound = state[to.location][to.type];
          if (targetMound.critters.length >= targetMound.size) {
            targetMound.critters.pop();
          }
          critter.currentHealth = 0;
          targetMound.critters.push(critter);
          targetMound.critters.sort((a, b) => b[targetMound.sortBy] - a[targetMound.sortBy])
        }
      },
      updateProductionRaw(state) {
        for (let type in state.worker) {
          if (state.worker.hasOwnProperty(type) && isNaN(state.worker[type])) {
            let value = state.worker[type].critters.reduce((acc, critter) => {
              return acc + critter[state.worker[type].productionProp];
            }, 0);
            value = value * (1 + state.worker[type].bonusPercent / 100);
            state.worker[type].productionPerSecondRaw = value;
          }
        }
      },
      updateProductionMounds(state, payload) {
        for (let type in payload) {
          if (payload.hasOwnProperty(type)) {
            state.worker[type] = payload[type]
          }
        }
      },
      setBoost(state, value) {
        state.royalHatchery.boosts = value;
      },
      setSodAmount(state, value) {
        state.totalSod = value;
      },
      upgradeMound(state, {location, type}) {
        const mound = state[location][type];
        mound.size += 1;
        mound.upgradeCost = mound.upgradeCost * 10;
      },
      setNewGeneChance(state, val) {
        state.newGeneChance = val;
      },
      addDiscoveredGene(state, id) {
        state.unlockedGenes.push(id)
      },
      sortMound(state, {location, type, sortBy}) {
        const mound = state[location][type];
        mound.sortBy = sortBy;
        mound.critters.sort(Sorter.callback(sortBy));
      },
      setAchievements(state, achievements) {
        state.achievements = achievements;
      },
      saveToStorage(state) {
        localforage.setItem('crittermound', state);
      },
      setWar(state, map) {
        state.soldiers.currentWar = map;
      }
    },
    actions: {
      healAllCritters: (context) => {
        context.getters.allCritters.forEach(critter => {
          const value = critter.currentHealth + critter.maxHealth / critter.actionTime;
          context.commit('setCritterHealth', {critterId: critter.id, value});
        })
      },
      resetCritterHealth: (context, critterId) => {
        context.commit('setCritterHealth', {critterId, value: 0})
      },
      breedCritter: (context, location) => {
        const id = context.getters.totalCritters + 1;
        const mother = context.getters.critters(location, 'mother')[0];
        const father = context.getters.critters(location, 'father')[0];
        const generation = Math.max(mother.generation, father.generation) + 1;
        context.commit('setTotalGenerations', generation);
        context.commit('setCritterHealth', {critterId: mother.id, value: 0});
        context.commit('setCritterHealth', {critterId: father.id, value: 0});
        const child = CritterFactory.breed(id, mother, father, store);
        context.commit('addChildToHatchery', {location, critter: child})
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
          const sodProduction = SodProduction.instance(context.state);
          const destination = sodProduction.allocateWorker(critter);
          if (destination) {
            context.commit('moveCritter', {
              from: {location, type},
              to: destination
            });
            context.commit('updateProductionRaw')
          }
        }
      },
      addSoldier: (context, {location, type}) => {
        const mound = context.state[location][type];
        const critter = mound.critters[0];
        if (critter) {
          context.commit('moveCritter', {
            from: {location, type},
            to: {location: 'soldiers', type: 'army'}
          });

        }
      },
      useBoost: (context, location) => {
        const currentBoosts = context.getters.boosts;
        if (currentBoosts > 0) {
          context.commit('setBoost', currentBoosts - 1);
          context.dispatch('breedCritter', location);
        }
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
      setNewGeneChance: (context, value) => {
        context.commit('setNewGeneChance', value)
      },
      addDiscoveredGene: (context, geneId) => {
        context.commit('addDiscoveredGene', geneId);
      },
      sortMound: (context, payload) => {
        context.commit('sortMound', payload)
      },
      updateData: (context, changes) => {
        changes.critters.forEach(critter => {
          if (!context.getters.findCritter(critter.id)) {
            context.commit('addChildToHatchery', {location: 'royalHatchery', critter})
          }
          context.commit('setCritterHealth', {critterId: critter.id, value: critter.currentHealth});
        });
        const sodProduction = {};
        for (let prop in changes.sodProduction) {
          if (changes.sodProduction.hasOwnProperty(prop)) {
            sodProduction[prop] = changes.sodProduction[prop]
          }
        }
        context.commit('updateProductionMounds', sodProduction);
        context.commit('setSodAmount', context.getters.totalSod + changes.addSod);
        context.commit('setAchievements', changes.achievements);

      },
      saveToStorage: (context) => {
        context.commit('saveToStorage');
      },
      startWar: (context, nationId) => {
        const war = new War(Nation.get(nationId));
        context.commit('setWar', war)
      }
    }
  });

  return store;
};

export default (cb, reinitialize = false) => {
  if (store && !reinitialize) {
    cb(store);
  } else {
    initializeStore().then(cb)
  }
}
