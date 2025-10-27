import {shallowMount} from "@vue/test-utils";
import {createStore} from "vuex";
import Critter from "../../src/components/Critter.vue";
import CritterFactory from "../../src/lib/CritterFactory.js";
import Trait from "../../src/lib/Trait.js";
import { expect, describe, it } from "vitest";

describe("The critter view", () => {
  let critter;
  let parentCritter;
  const score = '1';
  const vitality = '2';
  const strength = '3';
  const agility = '4';
  const bite = '5';
  const sting = '6';
  let store;
  let propsData;
  beforeEach(() => {
    critter = CritterFactory.default(12, 1, 'male');
    parentCritter = CritterFactory.default(1, 1, 'male');

    vi.spyOn(critter, 'score', 'get').mockReturnValue(score);
    vi.spyOn(critter.traits[Trait.ID_VITALITY], 'value', 'get').mockReturnValue(vitality);
    vi.spyOn(critter.traits[Trait.ID_STRENGTH], 'value', 'get').mockReturnValue(strength);
    vi.spyOn(critter.traits[Trait.ID_AGILITY], 'value', 'get').mockReturnValue(agility);
    vi.spyOn(critter.traits[Trait.ID_BITE], 'value', 'get').mockReturnValue(bite);
    vi.spyOn(critter.traits[Trait.ID_STING], 'value', 'get').mockReturnValue(sting);
    propsData = {
      critterId: critter.id,
      showProgressBar: false
    };
    store = createStore({
      state: {},
      getters: {
        findCritter: () => {
          return (id) => {
            if (id === parentCritter.id) return parentCritter;
            if (id === critter.id) return critter;
            return null;
          }
        }
      },
      actions: {}
    });
  });

  it('should show critter properties', () => {
    const critterWrapper = shallowMount(Critter, {
      props: propsData,
      global: {
        plugins: [store]
      }
    });

    const detailsId = `totalDetails-${critter.id}`;
    const totalDetailsDiv = critterWrapper.find(`#${detailsId}`);
    expect(totalDetailsDiv.text()).toBe(score);

    const vitalityId = `vitalityDetails-${critter.id}`;
    const vitalityDiv = critterWrapper.find(`#${vitalityId}`);
    expect(vitalityDiv.text()).toBe(vitality);
    const vitalityPopover = critterWrapper.find('#vitalityDetails').element.children[1];
    expect(vitalityPopover.getAttribute('target')).toBe(vitalityId);

    const strengthId = `strengthDetails-${critter.id}`;
    const strengthDiv = critterWrapper.find(`#${strengthId}`);
    expect(strengthDiv.text()).toBe(strength);
    const strengthPopover = critterWrapper.find('#strengthDetails').element.children[1];
    expect(strengthPopover.getAttribute('target')).toBe(strengthId);

    const agilityId = `agilityDetails-${critter.id}`;
    const agilityDiv = critterWrapper.find(`#${agilityId}`);
    expect(agilityDiv.text()).toBe(agility);
    const agilityPopover = critterWrapper.find('#agilityDetails').element.children[1];
    expect(agilityPopover.getAttribute('target')).toBe(agilityId);

    const biteId = `biteDetails-${critter.id}`;
    const biteDiv = critterWrapper.find(`#${biteId}`);
    expect(biteDiv.text()).toBe(bite);
    const bitePopover = critterWrapper.find('#biteDetails').element.children[1];
    expect(bitePopover.getAttribute('target')).toBe(biteId);

    const stingId = `stingDetails-${critter.id}`;
    const stingDiv = critterWrapper.find(`#${stingId}`);
    expect(stingDiv.text()).toBe(sting);
    const stingPopover = critterWrapper.find('#stingDetails').element.children[1];
    expect(stingPopover.getAttribute('target')).toBe(stingId);
  });

  it('should show the popovers on hover', () => {
    const triggers = 'hover focus';
    const tagName = 'BPOPOVER';
    const baseScore = '7';
    const bonusScore = '8';
    const mutations = '9';
    const trueValue = '10';
    const maxHealth = '11';
    const sodPerSecond = '12';
    const carryPerSecond = '13';
    const actionTimeSeconds = '14';
    const strengthBonus = '15';
    const grassPerSecond = '16';
    const agilityBonus = '17';
    const dirtPerSecond = '18';

    vi.spyOn(critter, 'baseScore', 'get').mockReturnValue(baseScore);
    vi.spyOn(critter, 'bonusScore', 'get').mockReturnValue(bonusScore);
    vi.spyOn(critter, 'mutations', 'get').mockReturnValue(mutations);
    vi.spyOn(critter, 'maxHealth', 'get').mockReturnValue(maxHealth);
    vi.spyOn(critter, 'sodPerSecond', 'get').mockReturnValue(sodPerSecond);
    vi.spyOn(critter, 'carryPerSecond', 'get').mockReturnValue(carryPerSecond);
    vi.spyOn(critter, 'actionTimeSeconds', 'get').mockReturnValue(actionTimeSeconds);
    vi.spyOn(critter, 'strengthBonus', 'get').mockReturnValue(strengthBonus);
    vi.spyOn(critter, 'grassPerSecond', 'get').mockReturnValue(grassPerSecond);
    vi.spyOn(critter, 'agilityBonus', 'get').mockReturnValue(agilityBonus);
    vi.spyOn(critter, 'dirtPerSecond', 'get').mockReturnValue(dirtPerSecond);
    vi.spyOn(critter.traits[Trait.ID_VITALITY], 'bonus', 'get').mockReturnValue(bonusScore);
    vi.spyOn(critter.traits[Trait.ID_VITALITY], 'getTrueValue').mockReturnValue(trueValue);
    vi.spyOn(critter.traits[Trait.ID_STRENGTH], 'bonus', 'get').mockReturnValue(bonusScore);
    vi.spyOn(critter.traits[Trait.ID_STRENGTH], 'getTrueValue').mockReturnValue(trueValue);
    vi.spyOn(critter.traits[Trait.ID_AGILITY], 'bonus', 'get').mockReturnValue(bonusScore);
    vi.spyOn(critter.traits[Trait.ID_AGILITY], 'getTrueValue').mockReturnValue(trueValue);
    vi.spyOn(critter.traits[Trait.ID_BITE], 'bonus', 'get').mockReturnValue(bonusScore);
    vi.spyOn(critter.traits[Trait.ID_BITE], 'getTrueValue').mockReturnValue(trueValue);
    vi.spyOn(critter.traits[Trait.ID_STING], 'bonus', 'get').mockReturnValue(bonusScore);
    vi.spyOn(critter.traits[Trait.ID_STING], 'getTrueValue').mockReturnValue(trueValue);

    const critterWrapper = shallowMount(Critter, {
      props: propsData,
      global: {
        plugins: [store]
      }
    });

    const detailsId = `totalDetails-${critter.id}`;
    const totalDetails = critterWrapper.find('#totalDetails').element.children;
    expect(totalDetails[1].tagName).toBe(tagName);
    expect(totalDetails[1].getAttribute('target')).toBe(detailsId);
    expect(totalDetails[1].getAttribute('triggers')).toBe(triggers);
    expect(totalDetails[1].children[0].innerHTML).toBe(`Generation: ${critter.generation}`);
    expect(totalDetails[1].children[1].innerHTML).toBe(`Birth Order: ${critter.id}`);
    expect(totalDetails[1].children[2].innerHTML).toBe(`Total Score: ${score}`);
    expect(totalDetails[1].children[3].innerHTML).toBe(`Total Base: ${baseScore}`);
    expect(totalDetails[1].children[4].innerHTML).toBe(`Total Bonus: ${bonusScore}`);
    expect(totalDetails[1].children[5].innerHTML).toBe(`Mutations: ${mutations}`);

    const vitalityId = `vitalityDetails-${critter.id}`;
    const vitalityDetails = critterWrapper.find('#vitalityDetails').element.children;
    expect(vitalityDetails[1].tagName).toBe(tagName);
    expect(vitalityDetails[1].getAttribute('target')).toBe(vitalityId);
    expect(vitalityDetails[1].getAttribute('triggers')).toBe(triggers);
    expect(vitalityDetails[1].children[0].innerHTML).toBe(`Base: ${vitality}`);
    expect(vitalityDetails[1].children[1].innerHTML).toBe(`Bonus: ${bonusScore}`);
    expect(vitalityDetails[1].children[2].innerHTML).toBe(`Value: ${trueValue}`);
    expect(vitalityDetails[1].children[3].innerHTML).toBe(`Health: ${maxHealth}`);
    expect(vitalityDetails[1].children[4].innerHTML).toBe(`Sod Production: ${sodPerSecond} per sec.`);

    const strengthId = `strengthDetails-${critter.id}`;
    const strengthDetails = critterWrapper.find('#strengthDetails').element.children;
    expect(strengthDetails[1].tagName).toBe(tagName);
    expect(strengthDetails[1].getAttribute('target')).toBe(strengthId);
    expect(strengthDetails[1].getAttribute('triggers')).toBe(triggers);
    expect(strengthDetails[1].children[0].innerHTML).toBe(`Base: ${strength}`);
    expect(strengthDetails[1].children[1].innerHTML).toBe(`Bonus: ${bonusScore}`);
    expect(strengthDetails[1].children[2].innerHTML).toBe(`Value: ${trueValue}`);
    expect(strengthDetails[1].children[3].innerHTML).toBe(`Carrying Capacity: ${carryPerSecond} per sec.`);

    const agilityId = `agilityDetails-${critter.id}`;
    const agilityDetails = critterWrapper.find('#agilityDetails').element.children;
    expect(agilityDetails[1].tagName).toBe(tagName);
    expect(agilityDetails[1].getAttribute('target')).toBe(agilityId);
    expect(agilityDetails[1].getAttribute('triggers')).toBe(triggers);
    expect(agilityDetails[1].children[0].innerHTML).toBe(`Base: ${agility}`);
    expect(agilityDetails[1].children[1].innerHTML).toBe(`Bonus: ${bonusScore}`);
    expect(agilityDetails[1].children[2].innerHTML).toBe(`Value: ${trueValue}`);
    expect(agilityDetails[1].children[3].innerHTML).toBe(`Speed: ${actionTimeSeconds} seconds`);

    const biteId = `biteDetails-${critter.id}`;
    const biteDetails = critterWrapper.find('#biteDetails').element.children;
    expect(biteDetails[1].tagName).toBe(tagName);
    expect(biteDetails[1].getAttribute('target')).toBe(biteId);
    expect(biteDetails[1].getAttribute('triggers')).toBe(triggers);
    expect(biteDetails[1].children[0].innerHTML).toBe(`Base: ${bite}`);
    expect(biteDetails[1].children[1].innerHTML).toBe(`Bonus: ${bonusScore}`);
    expect(biteDetails[1].children[2].innerHTML).toBe(`Value: ${trueValue}`);
    expect(biteDetails[1].children[3].innerHTML).toBe(`Strength Bonus: ${strengthBonus}`);
    expect(biteDetails[1].children[4].innerHTML).toBe(`Farm Production: ${grassPerSecond} per sec.`);

    const stingId = `stingDetails-${critter.id}`;
    const stingDetails = critterWrapper.find('#stingDetails').element.children;
    expect(stingDetails[1].tagName).toBe(tagName);
    expect(stingDetails[1].getAttribute('target')).toBe(stingId);
    expect(stingDetails[1].getAttribute('triggers')).toBe(triggers);
    expect(stingDetails[1].children[0].innerHTML).toBe(`Base: ${sting}`);
    expect(stingDetails[1].children[1].innerHTML).toBe(`Bonus: ${bonusScore}`);
    expect(stingDetails[1].children[2].innerHTML).toBe(`Value: ${trueValue}`);
    expect(stingDetails[1].children[3].innerHTML).toBe(`Agility Bonus: ${agilityBonus}`);
    expect(stingDetails[1].children[4].innerHTML).toBe(`Mine Production: ${dirtPerSecond} per sec.`);
  });

  it('should show progress bar', () => {
    propsData.showProgressBar = true;
    critter.currentHealth = 15;
    const maxHealth = 40;
    vi.spyOn(critter, 'maxHealth', 'get').mockReturnValue(maxHealth);
    const critterWrapper = shallowMount(Critter, {
      props: propsData,
      global: {
        plugins: [store]
      }
    });
    const progressBar = critterWrapper.find(`#progressBar-${critter.id}`);
    expect(progressBar.attributes('value')).toBe(critter.currentHealth.toString());
    expect(progressBar.attributes('max')).toBe(maxHealth.toString());
  });

  describe('stat color indicators in hatchery', () => {
    const BASE_VALUE = 50;

    const LOW_VALUE = 10;
    const HIGH_VALUE = 150;
    const betterStatClass = 'stat-better'
    const worseStatClass = 'stat-worse'

    beforeEach(() => {
      vi.spyOn(parentCritter, 'score', 'get').mockReturnValue(BASE_VALUE);
      vi.spyOn(parentCritter.traits[Trait.ID_VITALITY], 'value', 'get').mockReturnValue(BASE_VALUE);
      vi.spyOn(parentCritter.traits[Trait.ID_STRENGTH], 'value', 'get').mockReturnValue(BASE_VALUE);
      vi.spyOn(parentCritter.traits[Trait.ID_AGILITY], 'value', 'get').mockReturnValue(BASE_VALUE);
      vi.spyOn(parentCritter.traits[Trait.ID_BITE], 'value', 'get').mockReturnValue(BASE_VALUE);
      vi.spyOn(parentCritter.traits[Trait.ID_STING], 'value', 'get').mockReturnValue(BASE_VALUE);

      // Add parentCritter to props
      propsData.parentCritterId = parentCritter.id;
    });

    it('should show green color for better values', () => {
      // Critter with better score than parent
      vi.spyOn(critter, 'score', 'get').mockReturnValue(HIGH_VALUE);
      vi.spyOn(critter.traits[Trait.ID_VITALITY], 'value', 'get').mockReturnValue(HIGH_VALUE);
      vi.spyOn(critter.traits[Trait.ID_STRENGTH], 'value', 'get').mockReturnValue(HIGH_VALUE);
      vi.spyOn(critter.traits[Trait.ID_BITE], 'value', 'get').mockReturnValue(HIGH_VALUE);
      vi.spyOn(critter.traits[Trait.ID_STING], 'value', 'get').mockReturnValue(HIGH_VALUE);

      const critterWrapper = shallowMount(Critter, {
        props: propsData,
        global: {
          plugins: [store]
        }
      });

      const totalDetails = critterWrapper.find(`#totalDetails-${critter.id}`);
      const vitalityDetails = critterWrapper.find(`#vitalityDetails-${critter.id}`);
      const strengthDetails = critterWrapper.find(`#strengthDetails-${critter.id}`);
      const biteDetails = critterWrapper.find(`#biteDetails-${critter.id}`);
      const stingDetails = critterWrapper.find(`#stingDetails-${critter.id}`);

      expect(totalDetails.classes()).toContain(betterStatClass);
      expect(stingDetails.classes()).toContain(betterStatClass);
      expect(biteDetails.classes()).toContain(betterStatClass);
      expect(strengthDetails.classes()).toContain(betterStatClass);
      expect(vitalityDetails.classes()).toContain(betterStatClass);
    });

    it('should show red color for worse values', () => {
      // Critter with worse score than parent
      vi.spyOn(critter, 'score', 'get').mockReturnValue(LOW_VALUE);
      vi.spyOn(critter.traits[Trait.ID_VITALITY], 'value', 'get').mockReturnValue(LOW_VALUE);
      vi.spyOn(critter.traits[Trait.ID_STRENGTH], 'value', 'get').mockReturnValue(LOW_VALUE);
      vi.spyOn(critter.traits[Trait.ID_BITE], 'value', 'get').mockReturnValue(LOW_VALUE);
      vi.spyOn(critter.traits[Trait.ID_STING], 'value', 'get').mockReturnValue(LOW_VALUE);

      const critterWrapper = shallowMount(Critter, {
        props: propsData,
        global: {
          plugins: [store]
        }
      });

      const totalDetails = critterWrapper.find(`#totalDetails-${critter.id}`);
      const vitalityDetails = critterWrapper.find(`#vitalityDetails-${critter.id}`);
      const strengthDetails = critterWrapper.find(`#strengthDetails-${critter.id}`);
      const biteDetails = critterWrapper.find(`#biteDetails-${critter.id}`);
      const stingDetails = critterWrapper.find(`#stingDetails-${critter.id}`);

      expect(totalDetails.classes()).toContain(worseStatClass);
      expect(stingDetails.classes()).toContain(worseStatClass);
      expect(biteDetails.classes()).toContain(worseStatClass);
      expect(strengthDetails.classes()).toContain(worseStatClass);
      expect(vitalityDetails.classes()).toContain(worseStatClass);
    });

    it('should show no color for equal total score', () => {
      // Critter with same score than parent
      vi.spyOn(critter, 'score', 'get').mockReturnValue(BASE_VALUE);
      vi.spyOn(critter.traits[Trait.ID_VITALITY], 'value', 'get').mockReturnValue(BASE_VALUE);
      vi.spyOn(critter.traits[Trait.ID_STRENGTH], 'value', 'get').mockReturnValue(BASE_VALUE);
      vi.spyOn(critter.traits[Trait.ID_BITE], 'value', 'get').mockReturnValue(BASE_VALUE);
      vi.spyOn(critter.traits[Trait.ID_STING], 'value', 'get').mockReturnValue(BASE_VALUE);

      const critterWrapper = shallowMount(Critter, {
        props: propsData,
        global: {
          plugins: [store]
        }
      });

      const totalDetails = critterWrapper.find(`#totalDetails-${critter.id}`);
      const vitalityDetails = critterWrapper.find(`#vitalityDetails-${critter.id}`);
      const strengthDetails = critterWrapper.find(`#strengthDetails-${critter.id}`);
      const biteDetails = critterWrapper.find(`#biteDetails-${critter.id}`);
      const stingDetails = critterWrapper.find(`#stingDetails-${critter.id}`);

      expect(totalDetails.classes()).not.toContain(worseStatClass);
      expect(totalDetails.classes()).not.toContain(betterStatClass);
      expect(stingDetails.classes()).not.toContain(worseStatClass);
      expect(stingDetails.classes()).not.toContain(betterStatClass);
      expect(biteDetails.classes()).not.toContain(worseStatClass);
      expect(biteDetails.classes()).not.toContain(betterStatClass);
      expect(strengthDetails.classes()).not.toContain(worseStatClass);
      expect(strengthDetails.classes()).not.toContain(betterStatClass);
      expect(vitalityDetails.classes()).not.toContain(worseStatClass);
      expect(vitalityDetails.classes()).not.toContain(betterStatClass);
    });
  });
});

