import {createLocalVue, shallowMount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import Worker from '../../../src/components/Worker';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe('The Worker View', () => {
  let store;
  const sodProduction = {
    sodPerSecond: 0.1,
    dirtStored: 10,
    dirtPerSecond: 1,
    factoryDirtStored: 20,
    dirtCarriedPerSecond: 2,
    factoryGrassStored: 30,
    grassCarriedPerSecond: 3,
    grassStored: 40,
    grassPerSecond: 4
  };
  const totalSod = 0;

  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        sodProduction: () => sodProduction,
        totalSod: () => totalSod
      }
    });
  });

  it('should show the production overview', () => {
    const workerTabWrapper = shallowMount(Worker, {store, localVue});
    const mineDirtWrapper = workerTabWrapper.find('#mine-dirt');
    const factoryDirtWrapper = workerTabWrapper.find('#factory-dirt');
    const produceSodWrapper = workerTabWrapper.find('#produce-sod');
    const factoryGrassWrapper = workerTabWrapper.find('#factory-grass');
    const farmGrassWrapper = workerTabWrapper.find('#farm-grass');

    expect(mineDirtWrapper.text()).to.equal(`Mined Dirt ${sodProduction.dirtStored} +${sodProduction.dirtPerSecond}/s`);
    expect(factoryDirtWrapper.text()).to.equal(`Factory Dirt ${sodProduction.factoryDirtStored} +${sodProduction.dirtCarriedPerSecond}/s`);
    expect(produceSodWrapper.text()).to.equal(`Produce Sod ${totalSod} +${sodProduction.sodPerSecond}/s`);
    expect(factoryGrassWrapper.text()).to.equal(`Factory Grass ${sodProduction.factoryGrassStored} +${sodProduction.grassCarriedPerSecond}/s`);
    expect(farmGrassWrapper.text()).to.equal(`Farmed Grass ${sodProduction.grassStored} +${sodProduction.grassPerSecond}/s`);
  });

  it('should show the worker mounds', () => {
    const location = 'worker';
    const workerMoundStub = 'WORKER-MOUND-STUB';
    const workerTabWrapper = shallowMount(Worker, {store, localVue});
    const mineWorkerWrapper = workerTabWrapper.find('#mine-worker-mound');
    const farmWorkerWrapper = workerTabWrapper.find('#farm-worker-mound');
    const carryWorkerWrapper = workerTabWrapper.find('#carry-worker-mound');
    const factoryWorkerWrapper = workerTabWrapper.find('#factory-worker-mound');

    expect(mineWorkerWrapper.attributes('location')).to.equal(location);
    expect(mineWorkerWrapper.attributes('type')).to.equal('mine');
    expect(mineWorkerWrapper.element.tagName).to.equal(workerMoundStub);

    expect(farmWorkerWrapper.attributes('location')).to.equal(location);
    expect(farmWorkerWrapper.attributes('type')).to.equal('farm');
    expect(farmWorkerWrapper.element.tagName).to.equal(workerMoundStub);

    expect(carryWorkerWrapper.attributes('location')).to.equal(location);
    expect(carryWorkerWrapper.attributes('type')).to.equal('carry');
    expect(carryWorkerWrapper.element.tagName).to.equal(workerMoundStub);

    expect(factoryWorkerWrapper.attributes('location')).to.equal(location);
    expect(factoryWorkerWrapper.attributes('type')).to.equal('factory');
    expect(factoryWorkerWrapper.element.tagName).to.equal(workerMoundStub);
  });
});