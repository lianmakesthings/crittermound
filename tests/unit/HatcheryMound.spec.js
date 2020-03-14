import {createLocalVue, shallowMount, mount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import HatcheryMound from '../../src/components/HatcheryMound';
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
chai.use(sinonChai);

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

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
    store = new Vuex.Store({
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
    expect(critterWrapper.attributes('showprogressbar')).to.be.undefined;
  });

  it('should show a different bgcolor for other type', () => {
    const otherType = 'male';
    const props = JSON.parse(JSON.stringify(propsData));
    props.type = otherType;
    const hatcheryMoundWrapper = shallowMount(HatcheryMound, {propsData: props, store, localVue});
    const headerWrapper = hatcheryMoundWrapper.find(`#critter-header-${location}-${otherType}`);
    expect(headerWrapper.attributes('bgcolor')).to.equal('#d9edf7');
  });

  it('should show buttons to use critters', () => {
    const hatcheryMoundWrapper = shallowMount(HatcheryMound, {propsData, store, localVue});
    const replaceParentButton = hatcheryMoundWrapper.find(`#replace-parent-${location}-${type}`);
    const addWorkerButton = hatcheryMoundWrapper.find(`#add-worker-${location}-${type}`);
    const addSoldierButton = hatcheryMoundWrapper.find(`#add-soldier-${location}-${type}`);

    expect(replaceParentButton.attributes('type')).to.equal('button');
    expect(replaceParentButton.text()).to.equal('Queen');
    expect(addWorkerButton.attributes('type')).to.equal('button');
    expect(addWorkerButton.text()).to.equal('Worker');
    expect(addSoldierButton.attributes('type')).to.equal('button');
    expect(addSoldierButton.text()).to.equal('Army');
  });

  it('should replace parent', () => {
    const stubs = {
      'critter-header': true,
      'critter': true,
      'b-dropdown': true
    };
    sinon.stub(store, 'dispatch');
    const hatcheryMoundWrapper = mount(HatcheryMound, {propsData, store, localVue, stubs});
    const replaceParentButton = hatcheryMoundWrapper.find(`#replace-parent-${location}-${type}`);

    replaceParentButton.trigger('click');
    expect(store.dispatch).to.have.been.calledWith('replaceParent', {location, type});
  });

  it('should add worker', () => {
    const stubs = {
      'critter-header': true,
      'critter': true,
      'b-dropdown': true
    };
    sinon.stub(store, 'dispatch');
    const hatcheryMoundWrapper = mount(HatcheryMound, {propsData, store, localVue, stubs});
    const addWorkerButton = hatcheryMoundWrapper.find(`#add-worker-${location}-${type}`);

    addWorkerButton.trigger('click');
    expect(store.dispatch).to.have.been.calledWith('addWorker', {location, type});
  });

  it('should add soldier', () => {
    const stubs = {
      'critter-header': true,
      'critter': true,
      'b-dropdown': true
    };
    sinon.stub(store, 'dispatch');
    const hatcheryMoundWrapper = mount(HatcheryMound, {propsData, store, localVue, stubs});
    const addSoldierButton = hatcheryMoundWrapper.find(`#add-soldier-${location}-${type}`);

    addSoldierButton.trigger('click');
    expect(store.dispatch).to.have.been.calledWith('addSoldier', {location, type});
  });

  it('should show dropdown menu for sorting', () => {
    const stubs = {
      'critter-header': true,
      'critter': true,
    };

    const hatcheryMoundWrapper = mount(HatcheryMound, {propsData, store, localVue, stubs});
    const sortDropdown = hatcheryMoundWrapper.find(`#sort-dropdown-${location}-${type}`);
    const expectedText = `${sorts[0]}${sorts[1]}`;
    expect(sortDropdown.text()).to.equal(expectedText);
  });
});