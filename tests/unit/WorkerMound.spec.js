import {createLocalVue, shallowMount, mount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import WorkerMound from '../../src/components/WorkerMound';
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
chai.use(sinonChai);

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe('The Worker Mound view', () => {
  const location = 'worker';
  const type = 'farm';
  const critter = {id: 1};
  const critters = [critter];
  const propsData = {location, type};
  const mound = {size: 2, upgradeCost: 10};
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
      }
    });
  });

  it('should display the basic information', () => {
    const workerMoundWrapper = shallowMount(WorkerMound, {propsData, store, localVue});
    const title = workerMoundWrapper.find('h3');

    expect(title.text()).to.equal(`${type} ${critters.length} / ${mound.size}`)
  });

  it('should show critter details', () => {
    const workerMoundWrapper = shallowMount(WorkerMound, {propsData, store, localVue});
    const headerWrapper = workerMoundWrapper.find(`#critter-header-${location}-${type}`);
    const critterWrapper = workerMoundWrapper.find(`#critter-${critter.id}`);

    expect(headerWrapper.attributes('bgcolor')).to.equal('#56ab60');
    expect(critterWrapper.attributes('critterid')).to.equal(critter.id.toString());
    expect(critterWrapper.attributes('showprogressbar')).to.equal('true');
  });

  it('should show a different bgcolor for mine', () => {
    const otherType = 'mine';
    const props = JSON.parse(JSON.stringify(propsData));
    props.type = otherType;
    const workerMoundWrapper = shallowMount(WorkerMound, {propsData: props, store, localVue});
    const headerWrapper = workerMoundWrapper.find(`#critter-header-${location}-${otherType}`);
    expect(headerWrapper.attributes('bgcolor')).to.equal('#ffd143');
  });

  it('should show a different bgcolor for carry', () => {
    const otherType = 'carry';
    const props = JSON.parse(JSON.stringify(propsData));
    props.type = otherType;
    const workerMoundWrapper = shallowMount(WorkerMound, {propsData: props, store, localVue});
    const headerWrapper = workerMoundWrapper.find(`#critter-header-${location}-${otherType}`);
    expect(headerWrapper.attributes('bgcolor')).to.equal('#b87900');
  });

  it('should show a different bgcolor for factory', () => {
    const otherType = 'factory';
    const props = JSON.parse(JSON.stringify(propsData));
    props.type = otherType;
    const workerMoundWrapper = shallowMount(WorkerMound, {propsData: props, store, localVue});
    const headerWrapper = workerMoundWrapper.find(`#critter-header-${location}-${otherType}`);
    expect(headerWrapper.attributes('bgcolor')).to.equal('#65749f');
  });

  it('should show buttons to use critters', () => {
    const workerMoundWrapper = shallowMount(WorkerMound, {propsData, store, localVue});
    const button = workerMoundWrapper.find(`#upgrade-${location}-${type}`);

    expect(button.attributes('type')).to.equal('button');
    expect(button.text()).to.equal(`Upgrade ${mound.upgradeCost} Sod`);
  });

  it('should upgrade mound', () => {
    const stubs = {
      'critter-header': true,
      'critter': true,
    };
    sinon.stub(store, 'dispatch');
    const workerMoundWrapper = mount(WorkerMound, {propsData, store, localVue, stubs});
    const button = workerMoundWrapper.find(`#upgrade-${location}-${type}`);

    button.trigger('click');
    expect(store.dispatch).to.have.been.calledWith('upgradeMound', {location, type});
  })
});