import Vue from 'vue';
import Vuex from 'vuex';
import { Critter, CritterFactory } from '../lib/Critter';
import { CoinFlip } from '../lib/Helpers';

Vue.use(Vuex);

const queen = CritterFactory.default(1, 0, Critter.GENDER_FEMALE);
queen.rank = Critter.RANK_ROYAL;
const king = CritterFactory.default(2, 0, Critter.GENDER_MALE);
king.rank = Critter.RANK_ROYAL;

export const store = new Vuex.Store({
  state: {
    totalCritters: 2,
    totalGenerations: 0,
    royalHatchery: {
      mother: {
        critters: queen
      },
      father: {
        critters: king
      },
      female: {
        size: 1,
        critters: []
      },
      male: {
        size: 1,
        critters: []
      }
    }
  },
  getters: {
    critters: state =>
      (location, owner) => {
        return state[location][owner].critters;
      },
    findCritter: state =>
      critterId => {
        const allCritters = [state.royalHatchery.mother.critters]
          .concat([state.royalHatchery.father.critters])
          .concat(state.royalHatchery.female.critters)
          .concat(state.royalHatchery.male.critters);
        return allCritters.find(critter => critterId === critter.id)
      },
  },
  mutations: {
    addNewCritter(state, {location, critter}) {
      state.totalCritters++;
      state.totalGenerations = Math.max(state.totalGenerations, critter.generation);

      const slot = state[location][critter.gender];
      slot.critters.push(critter);
      slot.critters.sort((a, b) => b.score - a.score);
      if (slot.critters.length > slot.size) {
        slot.critters.pop()
      }
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
      const mother = context.state[location].mother.critters;
      const father = context.state[location].father.critters;
      context.commit('setCritterHealth', {critter: mother, value: 0});
      context.commit('setCritterHealth', {critter: father, value: 0});

      const id = context.state.totalCritters +1;
      const generation = Math.max(mother.generation, father.generation) + 1;
      const gender = CoinFlip() ? Critter.GENDER_FEMALE : Critter.GENDER_MALE;

      const critter = CritterFactory.default(id, generation, gender);
      context.commit('addNewCritter', {location, critter});

    }
  }
});
