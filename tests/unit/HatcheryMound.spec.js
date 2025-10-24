import {shallowMount, mount} from "@vue/test-utils";
import {createStore} from "vuex";
import HatcheryMound from '../../src/components/HatcheryMound.vue';
import { expect, vi } from "vitest";

describe('The Hatchery Mound View', () => {
  const location = 'royalHatchery';
  const type = 'female';
  const critter = {id: 1};
  const critters = [critter];
  const mound = {size: 2};
  const propsData = {location, type};
  const sorts = ['score', 'base'];
  let store;

  beforeEach(() => {
    store = createStore({
      getters: {
        critters: () => {
          return () => [critter];
        },
        mound: () => {
          return () => mound
        },
        sorts: () => sorts
      }
    });
  });

  it('should display the basic information', () => {
    const hatcheryMoundWrapper = shallowMount(HatcheryMound, {
      props: propsData,
      global: {
        plugins: [store]
      }
    });
    const title = hatcheryMoundWrapper.find('h4');

    expect(title.text()).toBe(`Hatchery ${critters.length} / ${mound.size}`)
  });

  it('should show critter details', () => {
    const hatcheryMoundWrapper = shallowMount(HatcheryMound, {
      props: propsData,
      global: {
        plugins: [store]
      }
    });
    const headerWrapper = hatcheryMoundWrapper.find(`#critter-header-${location}-${type}`);
    const critterWrapper = hatcheryMoundWrapper.find(`#critter-${critter.id}`);

    expect(headerWrapper.attributes('bgcolor')).toBe('#f2dede');
    expect(critterWrapper.attributes('critterid')).toBe(critter.id.toString());
    expect(critterWrapper.attributes('showprogressbar')).toBeUndefined();
  });

  it('should show a different bgcolor for other type', () => {
    const otherType = 'male';
    const props = JSON.parse(JSON.stringify(propsData));
    props.type = otherType;
    const hatcheryMoundWrapper = shallowMount(HatcheryMound, {
      props: props,
      global: {
        plugins: [store]
      }
    });
    const headerWrapper = hatcheryMoundWrapper.find(`#critter-header-${location}-${otherType}`);
    expect(headerWrapper.attributes('bgcolor')).toBe('#d9edf7');
  });

  it('should show buttons to use critters', () => {
    const hatcheryMoundWrapper = shallowMount(HatcheryMound, {
      props: propsData,
      global: {
        plugins: [store]
      }
    });
    const replaceParentButton = hatcheryMoundWrapper.find(`#replace-parent-${location}-${type}`);
    const addWorkerButton = hatcheryMoundWrapper.find(`#add-worker-${location}-${type}`);
    const addSoldierButton = hatcheryMoundWrapper.find(`#add-soldier-${location}-${type}`);

    expect(replaceParentButton.attributes('type')).toBe('button');
    expect(replaceParentButton.text()).toBe('Queen');
    expect(addWorkerButton.attributes('type')).toBe('button');
    expect(addWorkerButton.text()).toBe('Worker');
    expect(addSoldierButton.attributes('type')).toBe('button');
    expect(addSoldierButton.text()).toBe('Army');
  });

  it('should replace parent', () => {
    const stubs = {
      'critter-header': true,
      'critter': true,
      'b-dropdown': true
    };
    vi.spyOn(store, 'dispatch');
    const hatcheryMoundWrapper = mount(HatcheryMound, {
      props: propsData,
      global: {
        plugins: [store],
        stubs
      }
    });
    const replaceParentButton = hatcheryMoundWrapper.find(`#replace-parent-${location}-${type}`);

    replaceParentButton.trigger('click');
    expect(store.dispatch).toHaveBeenCalledWith('replaceParent', {location, type});
  });

  it('should add worker', () => {
    const stubs = {
      'critter-header': true,
      'critter': true,
      'b-dropdown': true
    };
    vi.spyOn(store, 'dispatch');
    const hatcheryMoundWrapper = mount(HatcheryMound, {
      props: propsData,
      global: {
        plugins: [store],
        stubs
      }
    });
    const addWorkerButton = hatcheryMoundWrapper.find(`#add-worker-${location}-${type}`);

    addWorkerButton.trigger('click');
    expect(store.dispatch).toHaveBeenCalledWith('addWorker', {location, type});
  });

  it('should add soldier', () => {
    const stubs = {
      'critter-header': true,
      'critter': true,
      'b-dropdown': true
    };
    vi.spyOn(store, 'dispatch');
    const hatcheryMoundWrapper = mount(HatcheryMound, {
      props: propsData,
      global: {
        plugins: [store],
        stubs
      }
    });
    const addSoldierButton = hatcheryMoundWrapper.find(`#add-soldier-${location}-${type}`);

    addSoldierButton.trigger('click');
    expect(store.dispatch).toHaveBeenCalledWith('addSoldier', {location, type});
  });

  it('should show dropdown menu for sorting', () => {
    const stubs = {
      'critter-header': true,
      'critter': true,
    };

    const hatcheryMoundWrapper = mount(HatcheryMound, {
      props: propsData,
      global: {
        plugins: [store],
        stubs
      }
    });
    const sortDropdown = hatcheryMoundWrapper.find(`#sort-dropdown-${location}-${type}`);
    const expectedText = `${sorts[0]}${sorts[1]}`;
    expect(sortDropdown.text()).toBe(expectedText);
  });
});