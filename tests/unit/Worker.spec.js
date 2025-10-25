import {shallowMount} from "@vue/test-utils";
import {createStore} from "vuex";
import Worker from '../../src/components/Worker.vue';
import { expect, describe, it } from "vitest";

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
    store = createStore({
      getters: {
        sodProduction: () => sodProduction,
        totalSod: () => totalSod
      }
    });
  });

  it('should show the production overview', () => {
    const workerTabWrapper = shallowMount(Worker, {
      global: {
        plugins: [store]
      }
    });
    const mineDirtWrapper = workerTabWrapper.find('#mine-dirt');
    const factoryDirtWrapper = workerTabWrapper.find('#factory-dirt');
    const produceSodWrapper = workerTabWrapper.find('#produce-sod');
    const factoryGrassWrapper = workerTabWrapper.find('#factory-grass');
    const farmGrassWrapper = workerTabWrapper.find('#farm-grass');

    expect(mineDirtWrapper.text()).toBe(`Mined Dirt${sodProduction.dirtStored} +${sodProduction.dirtPerSecond}/s`);
    expect(factoryDirtWrapper.text()).toBe(`Factory Dirt${sodProduction.factoryDirtStored} +${sodProduction.dirtCarriedPerSecond}/s`);
    expect(produceSodWrapper.text()).toBe(`Produce Sod${totalSod} +${sodProduction.sodPerSecond}/s`);
    expect(factoryGrassWrapper.text()).toBe(`Factory Grass${sodProduction.factoryGrassStored} +${sodProduction.grassCarriedPerSecond}/s`);
    expect(farmGrassWrapper.text()).toBe(`Farmed Grass${sodProduction.grassStored} +${sodProduction.grassPerSecond}/s`);
  });

  it('should show the worker mounds', () => {
    const location = 'worker';
    const workerMoundStub = 'WORKER-MOUND-STUB';
    const workerTabWrapper = shallowMount(Worker, {
      global: {
        plugins: [store]
      }
    });
    const mineWorkerWrapper = workerTabWrapper.find('#mine-worker-mound');
    const farmWorkerWrapper = workerTabWrapper.find('#farm-worker-mound');
    const carryWorkerWrapper = workerTabWrapper.find('#carry-worker-mound');
    const factoryWorkerWrapper = workerTabWrapper.find('#factory-worker-mound');

    expect(mineWorkerWrapper.attributes('location')).toBe(location);
    expect(mineWorkerWrapper.attributes('type')).toBe('mine');
    expect(mineWorkerWrapper.element.tagName).toBe(workerMoundStub);

    expect(farmWorkerWrapper.attributes('location')).toBe(location);
    expect(farmWorkerWrapper.attributes('type')).toBe('farm');
    expect(farmWorkerWrapper.element.tagName).toBe(workerMoundStub);

    expect(carryWorkerWrapper.attributes('location')).toBe(location);
    expect(carryWorkerWrapper.attributes('type')).toBe('carry');
    expect(carryWorkerWrapper.element.tagName).toBe(workerMoundStub);

    expect(factoryWorkerWrapper.attributes('location')).toBe(location);
    expect(factoryWorkerWrapper.attributes('type')).toBe('factory');
    expect(factoryWorkerWrapper.element.tagName).toBe(workerMoundStub);
  });
});