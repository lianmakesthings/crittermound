import {createLocalVue, shallowMount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import Critter from "../../src/components/Critter";
import CritterFactory from "../../src/lib/CritterFactory";
import Trait from "../../src/lib/Trait";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
chai.use(sinonChai);

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe("The critter view", () => {
  let critter;
  const score = '1';
  const vitality = '2';
  const strength = '3';
  const agility = '4';
  const bite = '5';
  const sting = '6';
  let store;
  let propsData;
  beforeEach(() => {
    critter = CritterFactory.default(12, 1, 'female');
    sinon.stub(critter, 'score').get(() => score);
    sinon.stub(critter.traits[Trait.ID_VITALITY], 'value').get(() => vitality);
    sinon.stub(critter.traits[Trait.ID_STRENGTH], 'value').get(() => strength);
    sinon.stub(critter.traits[Trait.ID_AGILITY], 'value').get(() => agility);
    sinon.stub(critter.traits[Trait.ID_BITE], 'value').get(() => bite);
    sinon.stub(critter.traits[Trait.ID_STING], 'value').get(() => sting);
    propsData = {
      critterId: critter.id,
      showProgressBar: false
    };
    store = new Vuex.Store({
      state: {},
      getters: {
        findCritter: () => {
          return () => critter
        }
      },
      actions: {}
    });
  });
  it('should show critter properties', () => {
    const critterWrapper = shallowMount(Critter, {propsData, store, localVue});

    const detailsId = `totalDetails-${critter.id}`;
    const totalDetails = critterWrapper.find('#totalDetails').element.children;
    expect(totalDetails[0].id).to.equal(detailsId);
    expect(totalDetails[0].innerHTML).to.equal(score);

    const vitalityId = `vitalityDetails-${critter.id}`;
    const vitalityDetails = critterWrapper.find('#vitalityDetails').element.children;
    expect(vitalityDetails[0].id).to.equal(vitalityId);
    expect(vitalityDetails[0].innerHTML).to.equal(vitality);
    expect(vitalityDetails[1].getAttribute('target')).to.equal(vitalityId);

    const strengthId = `strengthDetails-${critter.id}`;
    const strengthDetails = critterWrapper.find('#strengthDetails').element.children;
    expect(strengthDetails[0].id).to.equal(strengthId);
    expect(strengthDetails[0].innerHTML).to.equal(strength);
    expect(strengthDetails[1].getAttribute('target')).to.equal(strengthId);

    const agilityId = `agilityDetails-${critter.id}`;
    const agilityDetails = critterWrapper.find('#agilityDetails').element.children;
    expect(agilityDetails[0].id).to.equal(agilityId);
    expect(agilityDetails[0].innerHTML).to.equal(agility);
    expect(agilityDetails[1].getAttribute('target')).to.equal(agilityId);

    const biteId = `biteDetails-${critter.id}`;
    const biteDetails = critterWrapper.find('#biteDetails').element.children;
    expect(biteDetails[0].id).to.equal(biteId);
    expect(biteDetails[0].innerHTML).to.equal(bite);
    expect(biteDetails[1].getAttribute('target')).to.equal(biteId);

    const stingId = `stingDetails-${critter.id}`;
    const stingDetails = critterWrapper.find('#stingDetails').element.children;
    expect(stingDetails[0].id).to.equal(stingId);
    expect(stingDetails[0].innerHTML).to.equal(sting);
    expect(stingDetails[1].getAttribute('target')).to.equal(stingId);
  });

  it('should show the popovers on hover', () => {
    const triggers = 'hover focus';
    const tagName = 'B-POPOVER-STUB';
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

    sinon.stub(critter, 'baseScore').get(() => baseScore);
    sinon.stub(critter, 'bonusScore').get(() => bonusScore);
    sinon.stub(critter, 'mutations').get(() => mutations);
    sinon.stub(critter, 'maxHealth').get(() => maxHealth);
    sinon.stub(critter, 'sodPerSecond').get(() => sodPerSecond);
    sinon.stub(critter, 'carryPerSecond').get(() => carryPerSecond);
    sinon.stub(critter, 'actionTimeSeconds').get(() => actionTimeSeconds);
    sinon.stub(critter, 'strengthBonus').get(() => strengthBonus);
    sinon.stub(critter, 'grassPerSecond').get(() => grassPerSecond);
    sinon.stub(critter, 'agilityBonus').get(() => agilityBonus);
    sinon.stub(critter, 'dirtPerSecond').get(() => dirtPerSecond);
    sinon.stub(critter.traits[Trait.ID_VITALITY], 'bonus').get(() => bonusScore);
    sinon.stub(critter.traits[Trait.ID_VITALITY], 'getTrueValue').returns(trueValue);
    sinon.stub(critter.traits[Trait.ID_STRENGTH], 'bonus').get(() => bonusScore);
    sinon.stub(critter.traits[Trait.ID_STRENGTH], 'getTrueValue').returns(trueValue);
    sinon.stub(critter.traits[Trait.ID_AGILITY], 'bonus').get(() => bonusScore);
    sinon.stub(critter.traits[Trait.ID_AGILITY], 'getTrueValue').returns(trueValue);
    sinon.stub(critter.traits[Trait.ID_BITE], 'bonus').get(() => bonusScore);
    sinon.stub(critter.traits[Trait.ID_BITE], 'getTrueValue').returns(trueValue);
    sinon.stub(critter.traits[Trait.ID_STING], 'bonus').get(() => bonusScore);
    sinon.stub(critter.traits[Trait.ID_STING], 'getTrueValue').returns(trueValue);

    const critterWrapper = shallowMount(Critter, {propsData, store, localVue});

    const detailsId = `totalDetails-${critter.id}`;
    const totalDetails = critterWrapper.find('#totalDetails').element.children;
    expect(totalDetails[1].tagName).to.equal(tagName);
    expect(totalDetails[1].getAttribute('target')).to.equal(detailsId);
    expect(totalDetails[1].getAttribute('triggers')).to.equal(triggers);
    expect(totalDetails[1].children[0].innerHTML).to.equal(`Generation: ${critter.generation}`);
    expect(totalDetails[1].children[1].innerHTML).to.equal(`Birth Order: ${critter.id}`);
    expect(totalDetails[1].children[2].innerHTML).to.equal(`Total Score: ${score}`);
    expect(totalDetails[1].children[3].innerHTML).to.equal(`Total Base: ${baseScore}`);
    expect(totalDetails[1].children[4].innerHTML).to.equal(`Total Bonus: ${bonusScore}`);
    expect(totalDetails[1].children[5].innerHTML).to.equal(`Mutations: ${mutations}`);

    const vitalityId = `vitalityDetails-${critter.id}`;
    const vitalityDetails = critterWrapper.find('#vitalityDetails').element.children;
    expect(vitalityDetails[1].tagName).to.equal(tagName);
    expect(vitalityDetails[1].getAttribute('target')).to.equal(vitalityId);
    expect(vitalityDetails[1].getAttribute('triggers')).to.equal(triggers);
    expect(vitalityDetails[1].children[0].innerHTML).to.equal(`Base: ${vitality}`);
    expect(vitalityDetails[1].children[1].innerHTML).to.equal(`Bonus: ${bonusScore}`);
    expect(vitalityDetails[1].children[2].innerHTML).to.equal(`Value: ${trueValue}`);
    expect(vitalityDetails[1].children[3].innerHTML).to.equal(`Health: ${maxHealth}`);
    expect(vitalityDetails[1].children[4].innerHTML).to.equal(`Sod Production: ${sodPerSecond} per sec.`);

    const strengthId = `strengthDetails-${critter.id}`;
    const strengthDetails = critterWrapper.find('#strengthDetails').element.children;
    expect(strengthDetails[1].tagName).to.equal(tagName);
    expect(strengthDetails[1].getAttribute('target')).to.equal(strengthId);
    expect(strengthDetails[1].getAttribute('triggers')).to.equal(triggers);
    expect(strengthDetails[1].children[0].innerHTML).to.equal(`Base: ${strength}`);
    expect(strengthDetails[1].children[1].innerHTML).to.equal(`Bonus: ${bonusScore}`);
    expect(strengthDetails[1].children[2].innerHTML).to.equal(`Value: ${trueValue}`);
    expect(strengthDetails[1].children[3].innerHTML).to.equal(`Carrying Capacity: ${carryPerSecond} per sec.`);

    const agilityId = `agilityDetails-${critter.id}`;
    const agilityDetails = critterWrapper.find('#agilityDetails').element.children;
    expect(agilityDetails[1].tagName).to.equal(tagName);
    expect(agilityDetails[1].getAttribute('target')).to.equal(agilityId);
    expect(agilityDetails[1].getAttribute('triggers')).to.equal(triggers);
    expect(agilityDetails[1].children[0].innerHTML).to.equal(`Base: ${agility}`);
    expect(agilityDetails[1].children[1].innerHTML).to.equal(`Bonus: ${bonusScore}`);
    expect(agilityDetails[1].children[2].innerHTML).to.equal(`Value: ${trueValue}`);
    expect(agilityDetails[1].children[3].innerHTML).to.equal(`Speed: ${actionTimeSeconds} seconds`);

    const biteId = `biteDetails-${critter.id}`;
    const biteDetails = critterWrapper.find('#biteDetails').element.children;
    expect(biteDetails[1].tagName).to.equal(tagName);
    expect(biteDetails[1].getAttribute('target')).to.equal(biteId);
    expect(biteDetails[1].getAttribute('triggers')).to.equal(triggers);
    expect(biteDetails[1].children[0].innerHTML).to.equal(`Base: ${bite}`);
    expect(biteDetails[1].children[1].innerHTML).to.equal(`Bonus: ${bonusScore}`);
    expect(biteDetails[1].children[2].innerHTML).to.equal(`Value: ${trueValue}`);
    expect(biteDetails[1].children[3].innerHTML).to.equal(`Strength Bonus: ${strengthBonus}`);
    expect(biteDetails[1].children[4].innerHTML).to.equal(`Farm Production: ${grassPerSecond} per sec.`);

    const stingId = `stingDetails-${critter.id}`;
    const stingDetails = critterWrapper.find('#stingDetails').element.children;
    expect(stingDetails[1].tagName).to.equal(tagName);
    expect(stingDetails[1].getAttribute('target')).to.equal(stingId);
    expect(stingDetails[1].getAttribute('triggers')).to.equal(triggers);
    expect(stingDetails[1].children[0].innerHTML).to.equal(`Base: ${sting}`);
    expect(stingDetails[1].children[1].innerHTML).to.equal(`Bonus: ${bonusScore}`);
    expect(stingDetails[1].children[2].innerHTML).to.equal(`Value: ${trueValue}`);
    expect(stingDetails[1].children[3].innerHTML).to.equal(`Agility Bonus: ${agilityBonus}`);
    expect(stingDetails[1].children[4].innerHTML).to.equal(`Mine Production: ${dirtPerSecond} per sec.`);
  });

  it('should show progress bar', () => {
    propsData.showProgressBar = true;
    critter.currentHealth = 15;
    const maxHealth = 40;
    sinon.stub(critter, 'maxHealth').get(() => maxHealth);
    const critterWrapper = shallowMount(Critter, {propsData, store, localVue});
    const progressBar = critterWrapper.find(`#progressBar-${critter.id}`);
    expect(progressBar.attributes('value')).to.equal(critter.currentHealth.toString());
    expect(progressBar.attributes('max')).to.equal(maxHealth.toString());
  });
});

