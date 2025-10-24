import {shallowMount, mount} from "@vue/test-utils";
import {createStore} from "vuex";
import WorkerMound from '../../src/components/WorkerMound.vue';
import { expect, vi } from "vitest";

describe('The Worker Mound view', () => {
  const location = 'worker';
  const type = 'farm';
  const critter = {id: 1};
  const critters = [critter];
  const propsData = {location, type};
  const mound = {size: 2, upgradeCost: 10};
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
      }
    });
  });

  it('should display the basic information', () => {
    const workerMoundWrapper = shallowMount(WorkerMound, {
      props: propsData,
      global: {
        plugins: [store]
      }
    });
    const title = workerMoundWrapper.find('h3');

    expect(title.text()).toBe(`${type} ${critters.length} / ${mound.size}`)
  });

  it('should show critter details', () => {
    const workerMoundWrapper = shallowMount(WorkerMound, {
      props: propsData,
      global: {
        plugins: [store]
      }
    });
    const headerWrapper = workerMoundWrapper.find(`#critter-header-${location}-${type}`);
    const critterWrapper = workerMoundWrapper.find(`#critter-${critter.id}`);

    expect(headerWrapper.attributes('bgcolor')).toBe('#56ab60');
    expect(critterWrapper.attributes('critterid')).toBe(critter.id.toString());
    expect(critterWrapper.attributes('showprogressbar')).toBe('true');
  });

  it('should show a different bgcolor for mine', () => {
    const otherType = 'mine';
    const props = JSON.parse(JSON.stringify(propsData));
    props.type = otherType;
    const workerMoundWrapper = shallowMount(WorkerMound, {
      props: props,
      global: {
        plugins: [store]
      }
    });
    const headerWrapper = workerMoundWrapper.find(`#critter-header-${location}-${otherType}`);
    expect(headerWrapper.attributes('bgcolor')).toBe('#ffd143');
  });

  it('should show a different bgcolor for carry', () => {
    const otherType = 'carry';
    const props = JSON.parse(JSON.stringify(propsData));
    props.type = otherType;
    const workerMoundWrapper = shallowMount(WorkerMound, {
      props: props,
      global: {
        plugins: [store]
      }
    });
    const headerWrapper = workerMoundWrapper.find(`#critter-header-${location}-${otherType}`);
    expect(headerWrapper.attributes('bgcolor')).toBe('#b87900');
  });

  it('should show a different bgcolor for factory', () => {
    const otherType = 'factory';
    const props = JSON.parse(JSON.stringify(propsData));
    props.type = otherType;
    const workerMoundWrapper = shallowMount(WorkerMound, {
      props: props,
      global: {
        plugins: [store]
      }
    });
    const headerWrapper = workerMoundWrapper.find(`#critter-header-${location}-${otherType}`);
    expect(headerWrapper.attributes('bgcolor')).toBe('#65749f');
  });

  it('should show buttons to use critters', () => {
    const workerMoundWrapper = shallowMount(WorkerMound, {
      props: propsData,
      global: {
        plugins: [store]
      }
    });
    const button = workerMoundWrapper.find(`#upgrade-${location}-${type}`);

    expect(button.attributes('type')).toBe('button');
    expect(button.text()).toBe(`Upgrade ${mound.upgradeCost} Sod`);
  });

  it('should upgrade mound', () => {
    const stubs = {
      'critter-header': true,
      'critter': true,
    };
    vi.spyOn(store, 'dispatch');
    const workerMoundWrapper = mount(WorkerMound, {
      props: propsData,
      global: {
        plugins: [store],
        stubs
      }
    });
    const button = workerMoundWrapper.find(`#upgrade-${location}-${type}`);

    button.trigger('click');
    expect(store.dispatch).toHaveBeenCalledWith('upgradeMound', {location, type});
  })
});