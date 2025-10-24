import {shallowMount} from "@vue/test-utils";
import RoyalHatchery from '../../src/components/RoyalHatchery.vue';
import { expect } from "vitest";

describe('The Royal Hatchery View', () => {
  it('should show breeding and hatchery mounds for males and females', () => {
    const location = 'royalHatchery';
    const breedingStubName = 'BREEDING-MOUND-STUB';
    const hatcheryStubName = 'HATCHERY-MOUND-STUB';
    const royalHatcheryWrapper = shallowMount(RoyalHatchery);
    const femaleBreedingWrapper = royalHatcheryWrapper.find(`#queen-breeding-mound`);
    const maleBreedingWrapper = royalHatcheryWrapper.find(`#king-breeding-mound`);
    const femaleHatcheryWrapper = royalHatcheryWrapper.find(`#female-hatchery-mound`);
    const maleHatcheryWrapper = royalHatcheryWrapper.find(`#male-hatchery-mound`);

    expect(femaleBreedingWrapper.element.tagName).toBe(breedingStubName);
    expect(femaleBreedingWrapper.attributes('location')).toBe(location);
    expect(femaleBreedingWrapper.attributes('type')).toBe('mother');
    expect(maleBreedingWrapper.element.tagName).toBe(breedingStubName);
    expect(maleBreedingWrapper.attributes('location')).toBe(location);
    expect(maleBreedingWrapper.attributes('type')).toBe('father');
    expect(femaleHatcheryWrapper.element.tagName).toBe(hatcheryStubName);
    expect(femaleHatcheryWrapper.attributes('location')).toBe(location);
    expect(femaleHatcheryWrapper.attributes('type')).toBe('female');
    expect(maleHatcheryWrapper.element.tagName).toBe(hatcheryStubName);
    expect(maleHatcheryWrapper.attributes('location')).toBe(location);
    expect(maleHatcheryWrapper.attributes('type')).toBe('male');
  })
});