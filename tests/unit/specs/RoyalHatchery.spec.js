import {createLocalVue, shallowMount, mount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import RoyalHatchery from '../../../src/components/RoyalHatchery';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe('The Royal Hatchery View', () => {
  it('should show breeding and hatchery mounds for males and females', () => {
    const location = 'royalHatchery';
    const breedingStubName = 'BREEDING-MOUND-STUB';
    const hatcheryStubName = 'HATCHERY-MOUND-STUB';
    const royalHatcheryWrapper = shallowMount(RoyalHatchery, {localVue});
    const femaleBreedingWrapper = royalHatcheryWrapper.find(`#queen-breeding-mound`);
    const maleBreedingWrapper = royalHatcheryWrapper.find(`#king-breeding-mound`);
    const femaleHatcheryWrapper = royalHatcheryWrapper.find(`#female-hatchery-mound`);
    const maleHatcheryWrapper = royalHatcheryWrapper.find(`#male-hatchery-mound`);

    expect(femaleBreedingWrapper.element.tagName).to.equal(breedingStubName);
    expect(femaleBreedingWrapper.attributes('location')).to.equal(location);
    expect(femaleBreedingWrapper.attributes('type')).to.equal('mother');
    expect(maleBreedingWrapper.element.tagName).to.equal(breedingStubName);
    expect(maleBreedingWrapper.attributes('location')).to.equal(location);
    expect(maleBreedingWrapper.attributes('type')).to.equal('father');
    expect(femaleHatcheryWrapper.element.tagName).to.equal(hatcheryStubName);
    expect(femaleHatcheryWrapper.attributes('location')).to.equal(location);
    expect(femaleHatcheryWrapper.attributes('type')).to.equal('female');
    expect(maleHatcheryWrapper.element.tagName).to.equal(hatcheryStubName);
    expect(maleHatcheryWrapper.attributes('location')).to.equal(location);
    expect(maleHatcheryWrapper.attributes('type')).to.equal('male');
  })
});