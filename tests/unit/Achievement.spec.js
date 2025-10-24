import { shallowMount } from '@vue/test-utils';
import {createStore} from 'vuex';
import Achievement from '../../src/components/Achievement.vue';
import AchievementHandler from '../../src/lib/Achievement.js';
import { expect } from "vitest";

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

    const html = achievementWrapper.html();
    expect(html).toContain(firstAchievement.name);
    expect(html).toContain(firstAchievement.description);
    const alerts = achievementWrapper.findAll('[show]');
    expect(alerts.length).toBe(allAchievements.length);
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

    const alerts = achievementWrapper.findAll('[show]');
    expect(alerts[0].attributes('variant')).toBe('info');
    expect(alerts[1].attributes('variant')).toBe('light');
  })
});
