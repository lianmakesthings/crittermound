import {createLocalVue, shallowMount, mount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import BreedingMound from '../../../src/components/BreedingMound';
import sinon from "sinon";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe("The breeding mound view", () => {
  const location = 'royalHatchery';
  const type = 'mother';
  const upgradeCost = 20;
  const boosts = 2;
  const maxBoosts = 10;
  const critter = {id: 23};
  const mound = {critters: [critter], upgradeCost};
  const propsData = {location, type};
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        mound: () => {
          return () => mound
        },
        boosts: () => boosts,
        maxBoosts: () => maxBoosts
      }
    });
  });

  it('should render correct name', () => {
    const name = 'Queen';
    const breedingMoundWrapper = shallowMount(BreedingMound, {propsData, store, localVue});
    const title = breedingMoundWrapper.find('h3');
    expect(title.text()).to.equal(name)
  });

  it('should have buttons to boost and upgrade', () => {
    const breedingMoundWrapper = shallowMount(BreedingMound, {propsData, store, localVue});
    const boostButton = breedingMoundWrapper.find(`#button-boost-${location}-${type}`);
    const upgradeButton = breedingMoundWrapper.find(`#button-upgrade-${location}-${type}`);

    expect(boostButton.text()).to.equal(`Boost: ${boosts}/${maxBoosts}`);
    expect(upgradeButton.text()).to.equal(`Upgrade ${upgradeCost} Sod`);
  });

  it('should trigger boost', () => {
    const stubs = {
      'critter-header': true,
      'critter': true
    };
    sinon.stub(store, 'dispatch');
    const breedingMoundWrapper = mount(BreedingMound, {propsData, store, localVue, stubs});
    const boostButton = breedingMoundWrapper.find(`#button-boost-${location}-${type}`);

    boostButton.trigger('click');
    expect(store.dispatch).to.have.been.calledWith('useBoost', location);
  });

  it('should trigger upgrade', () => {
    const stubs = {
      'critter-header': true,
      'critter': true
    };
    sinon.stub(store, 'dispatch');
    const breedingMoundWrapper = mount(BreedingMound, {propsData, store, localVue, stubs});
    const upgradeButton = breedingMoundWrapper.find(`#button-upgrade-${location}-${type}`);

    upgradeButton.trigger('click');
    expect(store.dispatch).to.have.been.calledWith('upgradeMound', {location, type});
  });

  it('should render critter details', () => {
    const bgColor = '#f2dede';
    const breedingMoundWrapper = shallowMount(BreedingMound, {propsData, store, localVue});
    const headerWrapper = breedingMoundWrapper.find(`#critter-header-${critter.id}`);
    const critterWrapper = breedingMoundWrapper.find(`#critter-${critter.id}`);
    expect(headerWrapper.attributes('bgcolor')).to.equal(bgColor);
    expect(critterWrapper.attributes('critterid')).to.equal(critter.id.toString());
    expect(critterWrapper.attributes('showprogressbar')).to.equal('true');
  });
});