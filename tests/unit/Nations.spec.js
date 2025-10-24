import {shallowMount, mount} from "@vue/test-utils";
import {createStore} from "vuex";
import { expect, vi } from "vitest";
import Nation from '../../src/lib/Nation.js';
import Nations from '../../src/components/Nations.vue';

describe('The Nations View', () => {
  const cricketNation = Nation.CRICKETS;
  const beeNation = Nation.BEES;
  const unlockedNations = [cricketNation];
  const allNations = [cricketNation, beeNation];
  let store;

  beforeEach(() => {
    vi.spyOn(Nation, 'allNations').mockReturnValue(allNations);
    store = createStore({
      getters: {
        isNationUnlocked: () => {
          return nationId => !!unlockedNations.find(n => n.id === nationId)
        }
      }
    });
    vi.spyOn(store, 'dispatch');
  });

  it('should display information for each nation', () => {
    const nationsViewWrapper = shallowMount(Nations, {
      global: {
        plugins: [store]
      }
    });

    const cricketNationWrapper = nationsViewWrapper.find(`#nation-${cricketNation.id}`);
    expect(cricketNationWrapper.text()).toBe(`${cricketNation.custom}${cricketNation.minBaseVal} - ${cricketNation.maxBaseVal}`);
    expect(cricketNationWrapper.attributes('title')).toBe(cricketNation.name);

    const beeNationWrapper = nationsViewWrapper.find(`#nation-${beeNation.id}`);
    expect(beeNationWrapper.text()).toBe(`${beeNation.custom}${beeNation.minBaseVal} - ${beeNation.maxBaseVal}`);
    expect(beeNationWrapper.attributes('title')).toBe(beeNation.name);
  });

  it('should show different bg and text variants for locked and unlocked nations', () => {
    const nationsViewWrapper = shallowMount(Nations, {
      global: {
        plugins: [store]
      }
    });
    const cricketNationWrapper = nationsViewWrapper.find(`#nation-${cricketNation.id}`);
    const beeNationWrapper = nationsViewWrapper.find(`#nation-${beeNation.id}`);

    expect(cricketNationWrapper.attributes('bg-variant')).toBe('secondary');
    expect(cricketNationWrapper.attributes('text-variant')).toBe('white');
    expect(beeNationWrapper.attributes('bg-variant')).toBe('light');
    expect(beeNationWrapper.attributes('text-variant')).toBe('black');
  });

  it('should start war', () => {
    const nationsViewWrapper = mount(Nations, {
      global: {
        plugins: [store]
      }
    });
    const cricketNationWrapper = nationsViewWrapper.find(`#nation-${cricketNation.id}`);

    cricketNationWrapper.trigger('click');

    expect(store.dispatch).toHaveBeenCalledWith('startWar', cricketNation.id);
  });

  it('should not start war if nation is not unlocked', () => {
    const nationsViewWrapper = mount(Nations, {
      global: {
        plugins: [store]
      }
    });
    const beeNationWrapper = nationsViewWrapper.find(`#nation-${beeNation.id}`);

    beeNationWrapper.trigger('click');

    expect(store.dispatch).not.toHaveBeenCalledWith('startWar', beeNation.id);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  })
});