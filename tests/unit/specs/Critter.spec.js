import {createLocalVue, shallowMount, mount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import Critter from "../../../src/components/Critter";
import CritterFactory from "../../../src/lib/CritterFactory";
import Trait from "../../../src/lib/Trait";

import sinon from 'sinon';
const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe("The critter view", () => {
  it('should show critter properties', () => {
    const critter = CritterFactory.default(12, 1, 'female');
    const score = '1';
    const vitality = '2';
    const strength = '3';
    const agility = '4';
    const bite = '5';
    const sting = '6';
    sinon.stub(critter, 'score').get(() => score);
    sinon.stub(critter.traits[Trait.ID_VITALITY], 'value').get(() => vitality);
    sinon.stub(critter.traits[Trait.ID_STRENGTH], 'value').get(() => strength);
    sinon.stub(critter.traits[Trait.ID_AGILITY], 'value').get(() => agility);
    sinon.stub(critter.traits[Trait.ID_BITE], 'value').get(() => bite);
    sinon.stub(critter.traits[Trait.ID_STING], 'value').get(() => sting);
    const store = new Vuex.Store({
      state: {},
      getters: {
        findCritter: () => {
          return () => critter
        }
      },
      actions: {}
    });
    const propsData = {
      critterId: critter.id,
      showProgressBar: false
    };
    const critterWrapper = shallowMount(Critter, {propsData, store, localVue});

    const detailsId = `totalDetails-${critter.id}`;
    const totalDetails = critterWrapper.find('#totalDetails').element.children;
    console.log(totalDetails);
    expect(totalDetails[0].id).to.equal(detailsId);
    expect(totalDetails[0].innerHTML).to.equal(score);
    expect(totalDetails[1].getAttribute('target')).to.equal(detailsId);

    const vitalityId = `vitalityDetails-${critter.id}`;
    const vitalityDetails = critterWrapper.find('#vitalityDetails').element.children;
    console.log(vitalityDetails);
    expect(vitalityDetails[0].id).to.equal(vitalityId);
    expect(vitalityDetails[0].innerHTML).to.equal(vitality);
    expect(vitalityDetails[1].getAttribute('target')).to.equal(vitalityId);

    const strengthId = `strengthDetails-${critter.id}`;
    const strengthDetails = critterWrapper.find('#strengthDetails').element.children;
    console.log(strengthDetails);
    expect(strengthDetails[0].id).to.equal(strengthId);
    expect(strengthDetails[0].innerHTML).to.equal(strength);
    expect(strengthDetails[1].getAttribute('target')).to.equal(strengthId);

    const agilityId = `agilityDetails-${critter.id}`;
    const agilityDetails = critterWrapper.find('#agilityDetails').element.children;
    console.log(agilityDetails);
    expect(agilityDetails[0].id).to.equal(agilityId);
    expect(agilityDetails[0].innerHTML).to.equal(agility);
    expect(agilityDetails[1].getAttribute('target')).to.equal(agilityId);

    const biteId = `biteDetails-${critter.id}`;
    const biteDetails = critterWrapper.find('#biteDetails').element.children;
    console.log(biteDetails);
    expect(biteDetails[0].id).to.equal(biteId);
    expect(biteDetails[0].innerHTML).to.equal(bite);
    expect(biteDetails[1].getAttribute('target')).to.equal(biteId);

    const stingId = `stingDetails-${critter.id}`;
    const stingDetails = critterWrapper.find('#stingDetails').element.children;
    console.log(stingDetails);
    expect(stingDetails[0].id).to.equal(stingId);
    expect(stingDetails[0].innerHTML).to.equal(sting);
    expect(stingDetails[1].getAttribute('target')).to.equal(stingId);
  });
});

