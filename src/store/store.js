import Vue from 'vue';
import Vuex from 'vuex';
import { Critter, CritterFactory } from '../lib/Critter'

Vue.use(Vuex);

const queen = CritterFactory.default(1, 0, Critter.GENDER_FEMALE);
queen.rank = Critter.RANK_ROYAL;
const king = CritterFactory.default(2, 0, Critter.GENDER_MALE);
king.rank = Critter.RANK_ROYAL;

export const store = new Vuex.Store({
  state: {
    totalCritters: 2,
    royalHatchery: {
      mother: queen,
      father: king,
      female: [],
      male: []
    }
  },
  getters: {
    critters: state =>
      (location, owner) => {
        return state[location][owner];
      },
    findCritter: state =>
      critterId => {
        const allCritters = [state.royalHatchery.mother].concat([state.royalHatchery.father]).concat(state.royalHatchery.female).concat(state.royalHatchery.male);
        return allCritters.find(critter => critterId === critter.id)
      },
  },
  mutations: {
    addNewCritter(state, {location, critter}) {
      state.totalCritters++;
      state[location][critter.gender].push(critter);
    },
    setCritterHealth(state, {critter, value}) {
      critter.currentHealth = value;
    },

  },
  actions: {
    healCritter: (context, critterId) => {
      const critter = context.getters.findCritter(critterId);
      const value = critter.currentHealth + critter.maxHealth / critter.actionTime;
      context.commit('setCritterHealth', {critter, value});

    },
    breedCritter: (context, location) => {
      const mother = context.state[location].mother;
      const father = context.state[location].father;

      const id = context.state.totalCritters +1;
      const generation = Math.max(mother.generation, father.generation) + 1;
      const critter = CritterFactory.default(id, generation, Critter.GENDER_FEMALE);
      context.commit('addNewCritter', {location, critter});
      context.commit('setCritterHealth', {critter: mother, value: 0});
      context.commit('setCritterHealth', {critter: father, value: 0});
    }
  }
});
