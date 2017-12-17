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
      queen: queen,
      king: king,
      female: [],
      male: []
    }
  },
  getters: {
    critters: (state) => {
      return (context, owner) => {
        return state[context][owner];
      }

    }
  }
});
