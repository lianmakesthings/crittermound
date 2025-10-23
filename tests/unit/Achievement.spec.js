import { shallowMount } from '@vue/test-utils';
import {createStore} from 'vuex';
import Achievement from '../../src/components/Achievement.vue';
import AchievementHandler from '../../src/lib/Achievement.js';
import { expect } from "chai";

describe('The Achievement view', () => {
  it('should show all achievements', () => {
    const allAchievements = AchievementHandler.allAchievements();
    const firstAchievement = allAchievements[0];

    const store = createStore({
      state: {},
      getters: {
        unlockedAchievements: () => []
      },
      actions: {}
    });
    const achievementWrapper = shallowMount(Achievement, {
      global: {
        plugins: [store]
      }
    });

    expect(achievementWrapper.vm.$children[0].$el.innerHTML).to.include(firstAchievement.name);
    expect(achievementWrapper.vm.$children[0].$el.innerHTML).to.include(firstAchievement.description);
    expect(achievementWrapper.vm.$children.length).to.equal(allAchievements.length);
  });

  it('should mark unlocked achievements', () => {
    const store = createStore({
      state: {},
      getters: {
        unlockedAchievements: () => [1, 0]
      },
      actions: {}
    });
    const achievementWrapper = shallowMount(Achievement, {
      global: {
        plugins: [store]
      }
    });

    expect(achievementWrapper.vm.$children[0].$el.getAttribute('variant')).to.equal('info');
    expect(achievementWrapper.vm.$children[1].$el.getAttribute('variant')).to.equal('light');
  })
});
