import {createLocalVue, shallowMount, mount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import HatcheryMound from '../../../src/components/HatcheryMound';
import sinon from "sinon";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe.only('The Hatchery Mound View', () => {
  const location = 'royalHatchery';
  const type = 'female';
  const critter = {id: 1};
  const critters = [critter];
  const mound = {size: 2};
  const propsData = {location, type};
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        critters: () => {
          return () => [critter];
        },
        mound: () => {
          return () => mound
        }
      }
    });
  });

  it('should display the basic information', () => {
    const hatcheryMoundWrapper = shallowMount(HatcheryMound, {propsData, store, localVue});
    const title = hatcheryMoundWrapper.find('h4');

    expect(title.text()).to.equal(`Hatchery ${critters.length} / ${mound.size}`)
  });

  it('should show critter details', () => {
    const hatcheryMoundWrapper = shallowMount(HatcheryMound, {propsData, store, localVue});
    const headerWrapper = hatcheryMoundWrapper.find(`#critter-header-${location}-${type}`);
    const critterWrapper = hatcheryMoundWrapper.find(`#critter-${critter.id}`);

    expect(headerWrapper.attributes('bgcolor')).to.equal('#f2dede');
    expect(critterWrapper.attributes('critterid')).to.equal(critter.id.toString());
    expect(critterWrapper.attributes('showprogressbar')).not.to.be.defined;
  });

});