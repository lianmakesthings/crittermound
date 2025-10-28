import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
use(sinonChai);

import getStore from '../../src/store/store.js';
import localforage from 'localforage';
import state from '../../src/store/state.json' with { type: 'json' };
import CritterFactory from '../../src/lib/CritterFactory.js';
import Critter from '../../src/lib/Critter.js';
import Nation from '../../src/lib/Nation.js';
import War from '../../src/lib/War.js';
import SodProduction from '../../src/lib/SodProduction.js';

describe('The vuex store', () => {
  describe('loading the state', () => {
    beforeEach(() => {
      sinon.stub(localforage, "config");
      sinon.stub(localforage, "getItem");
    });

    it('should try localstorage first', (done) => {
      const savedState = JSON.parse(JSON.stringify(state));
      savedState.royalHatchery.mother.critters.push({});
      savedState.royalHatchery.mother.critters.push({});

      sinon.stub(CritterFactory, 'fromState').returns({});
      localforage.getItem.returns(Promise.resolve(savedState));

      getStore((store) => {
        const storeState = JSON.parse(JSON.stringify(store.state));

        expect(localforage.getItem).to.have.been.calledWith('crittermound');
        expect(storeState).to.deep.equal(savedState);

        CritterFactory.fromState.restore();
        done();
      }, true)
    });

    it('should set initial state if no state saved in localstorage', (done) => {
      const expectedState = JSON.parse(JSON.stringify(state));
      expectedState.royalHatchery.mother.critters.push({ rank: Critter.RANK_ROYAL});
      expectedState.royalHatchery.father.critters.push({ rank: Critter.RANK_ROYAL});
      expectedState.soldiers.unlockedNations.push(Nation.CRICKETS);

      sinon.stub(CritterFactory, 'default').returns({});
      localforage.getItem.returns(Promise.reject('no localstorage'));

      getStore((store) => {
        const storeState = JSON.parse(JSON.stringify(store.state));

        expect(storeState).to.deep.equal(expectedState);

        CritterFactory.default.restore();
        done();
      }, true)
    });

    afterEach(() => {
      localforage.config.restore();
      localforage.getItem.restore();
    });
  });

  describe("getters", () => {
    let mockedState;
    beforeEach(() => {
      mockedState = JSON.parse(JSON.stringify(state));
      if (!localforage.config.restore) {
        sinon.stub(localforage, "config");
      }
      if (!localforage.getItem.restore) {
        sinon.stub(localforage, "getItem").returns(Promise.resolve(null));
      }
    });

    afterEach(() => {
      if (localforage.config.restore) {
        localforage.config.restore();
      }
      if (localforage.getItem.restore) {
        localforage.getItem.restore();
      }
    });

    it('should return the entire state', (done) => {
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.entireState).to.deep.equal(mockedState);
        done();
      }, true)
    });

    
    it('should return all critters', (done) => {
      const queen = { id: 'queen' };
      const worker = { id: 'worker' };
      mockedState.royalHatchery.mother.critters.push(queen);
      mockedState.worker.mine.critters.push(worker);

      getStore((store) => {
        store.replaceState(mockedState);
        const allCritters = store.getters.allCritters;

        expect(allCritters.length).to.equal(2);
        expect(allCritters).to.deep.include(queen);
        expect(allCritters).to.deep.include(worker);
        done();
      }, true);
    });

    it('should return all workers', (done) => {
      const queen = { id: 'queen' };
      const worker = { id: 'worker' };
      mockedState.royalHatchery.mother.critters.push(queen);
      mockedState.worker.mine.critters.push(worker);

      getStore((store) => {
        store.replaceState(mockedState);
        const allCritters = store.getters.allWorkers;

        expect(allCritters.length).to.equal(1);
        expect(allCritters).to.deep.include(worker);
        expect(allCritters).not.to.deep.include(queen);
        done();
      }, true);
    });

    it('should return critters by location and type', (done) => {
      const location = 'royalHatchery';
      const type = 'mother';
      const queen = {};
      const worker = {};
      mockedState[location][type].critters.push(queen);
      mockedState.worker.mine.critters.push(worker);
      getStore((store) => {
        store.replaceState(mockedState);
        const critters = store.getters.critters(location, type);

        expect(critters).to.include(queen);
        expect(critters).not.to.include(worker);
        done();
      }, true)
    });

    it('should return number of total critters', (done) => {
      const totalCritters = 42;
      mockedState.totalCritters = totalCritters;
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.totalCritters).to.equal(totalCritters);
        done();
      }, true)
    });

    it('should return sod production part of state', (done) => {
      const sodProduction = {some : "value"};
      mockedState.worker = sodProduction;

      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.sodProduction).to.deep.equal(sodProduction);
        done();
      }, true);
    });

    it('should return the total amount of sod', (done) => {
      const totalSod = 1337;
      mockedState.totalSod = totalSod;

      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.totalSod).to.equal(totalSod);
        done();
      })
    });

    it('should return mound by location and type', (done) => {
      const location = 'royalHatchery';
      const type = 'mother';
      const expectedMound = {some: "mound"};
      mockedState[location][type] = expectedMound;

      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.mound(location, type)).to.deep.equal(expectedMound);
        done();
      })
    });

    it('should return a specific critter by id', (done) => {
      const critterId = 5;
      const expectedCritter = {id: critterId};
      const otherCritter = {id: 2};

      mockedState.worker.mine.critters.push(expectedCritter);
      mockedState.royalHatchery.female.critters.push(otherCritter);

      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.findCritter(critterId)).to.deep.equal(expectedCritter);
        done();
      })
    });

    it('should return number of boosts', (done) => {
      const expectedBoosts = 5;
      mockedState.royalHatchery.boosts = expectedBoosts;
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.boosts).to.equal(expectedBoosts);
        done();
      })
    });

    it('should return max number of boosts', (done) => {
      const expectedMaxBoosts = 9;
      mockedState.royalHatchery.maxBoosts = expectedMaxBoosts;
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.maxBoosts).to.equal(expectedMaxBoosts);
        done();
      })
    });

    it('should return whether state was saved', (done) => {
      const stateSaved = true;
      mockedState.stateSaved = stateSaved;
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.showStateSaved).to.equal(stateSaved);
        done();
      })
    });

    it('should return new gene chance', (done) => {
      const newGeneChance = 9;
      mockedState.newGeneChance = newGeneChance;
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.newGeneChance).to.equal(newGeneChance);
        done();
      })
    });

    it('should return array of unlocked gene ids', (done) => {
      const unlockedGeneId = 2;
      mockedState.unlockedGenes.push(unlockedGeneId);
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.unlockedGenes).to.include(unlockedGeneId);
        done();
      })
    });

    it('should return allocation of the royal hatchery', (done) => {
      const sizeEach = 5;
      mockedState.royalHatchery.female.size = sizeEach;
      mockedState.royalHatchery.male.size = sizeEach;
      mockedState.royalHatchery.female.critters.push({});
      mockedState.royalHatchery.female.critters.push({});
      mockedState.royalHatchery.male.critters.push({});
      const expectedAlloc = {current: 3, max: sizeEach*2};
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.royalHatcheryAlloc).to.deep.equal(expectedAlloc);
        done();
      })
    });

    it('should return allocation of the worker mound', (done) => {
      const sizeEach = 5;
      mockedState.worker.mine.size = sizeEach;
      mockedState.worker.farm.size = sizeEach;
      mockedState.worker.carry.size = sizeEach;
      mockedState.worker.factory.size = sizeEach;
      mockedState.worker.mine.critters.push({});
      mockedState.worker.carry.critters.push({});
      mockedState.worker.carry.critters.push({});
      const expectedAlloc = {current: 3, max: sizeEach*4};
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.workerAlloc).to.deep.equal(expectedAlloc);
        done();
      })
    });

    it('should return the unlock level for all achievemnts', (done) => {
      const unlockedAchievements = [].concat(mockedState.achievements);
      unlockedAchievements[4] = 2;
      mockedState.achievements = unlockedAchievements;
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.unlockedAchievements).to.deep.equal(unlockedAchievements);
        done();
      })
    });

    it('should return the allocation of the army mound', (done) => {
      const size = 5;
      mockedState.soldiers.army.size = size;
      mockedState.soldiers.army.critters.push({});
      mockedState.soldiers.army.critters.push({});
      const expectedAlloc = {current: 2, max: size};
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.armyAlloc).to.deep.equal(expectedAlloc);
        done();
      })
    });

    it('should return the achievement quota', (done) => {
      const unlockedAchievements = [].concat(mockedState.achievements);
      unlockedAchievements[4] = 2;
      mockedState.achievements = unlockedAchievements;
      const expectedQuota = {current: 2, max: 212};
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.achievementQuota).to.deep.equal(expectedQuota);
        done();
      })
    });

    it('should return the current war state', (done) => {
      mockedState.soldiers.currentWar = new War(Nation.CRICKETS);
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.atWar).to.be.true;
        done();
      })
    });

    it('should return the current war map', (done) => {
      const war = new War(Nation.CRICKETS);
      mockedState.soldiers.currentWar = war;
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.currentMap).to.deep.equal(war.map);
        done();
      })
    });

    it('should return whether a nation is unlocked', (done) => {
      const unlockedNation = Nation.ANTS;
      const lockedNation = Nation.BEES;
      mockedState.soldiers.unlockedNations = [unlockedNation];
      getStore((store) => {
        store.replaceState(mockedState);

        expect(store.getters.isNationUnlocked(unlockedNation.id)).to.be.true;
        expect(store.getters.isNationUnlocked(lockedNation.id)).to.be.false;
        done();
      })
    })
  });

  describe("mutations", () => {
    let mockedState;
    beforeEach(() => {
      mockedState = JSON.parse(JSON.stringify(state));
    });

    it('should add child to hatchery', (done) => {
      const totalCritters = mockedState.totalCritters;
      const totalGenerations = mockedState.totalGenerations;
      const location = 'royalHatchery';
      const critter = CritterFactory.default(1, totalGenerations+1, Critter.GENDER_FEMALE);

      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('addChildToHatchery', {location, critter});
        expect(mockedState.totalCritters).to.equal(totalCritters+1);
        expect(mockedState.totalGenerations).to.equal(totalGenerations+1);
        expect(mockedState.royalHatchery.female.critters).to.include(critter);
        done();
      })
    });

    it('should sort and remove excess critters when adding children', (done) => {
      const location = 'royalHatchery';
      const lowCritter = CritterFactory.default(1, 1, Critter.GENDER_FEMALE);
      const highCritter = CritterFactory.default(1, 1, Critter.GENDER_FEMALE);
      sinon.stub(lowCritter, 'score').get(() => 5);
      sinon.stub(highCritter, 'score').get(() => 10);
      mockedState[location][lowCritter.gender].critters.push(lowCritter);

      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('addChildToHatchery', {location, critter: highCritter});
        expect(mockedState.royalHatchery.female.critters).to.include(highCritter);
        expect(mockedState.royalHatchery.female.critters).not.to.include(lowCritter);
        done();
      })
    });

    it('should set total generations', (done) => {
      const totalGenerations = 10;
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('setTotalGenerations', totalGenerations);
        expect(mockedState.totalGenerations).to.equal(totalGenerations);
        done();
      })
    });

    it('should set the health of specific critter', (done) => {
      const critterId = 5;
      const critter = {id: critterId, currentHealth: 0};
      const health = 10;
      mockedState.worker.mine.critters.push(critter);
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('setCritterHealth', {critterId, value: health});
        expect(critter.currentHealth).to.equal(health);
        done();
      })
    });

    it('should move critter from one mound to another', (done) => {
      const from = {location: 'royalHatchery', type: 'female'};
      const to = {location: 'worker', type: 'mine'};
      const firstCritter = {};
      const secondCritter = {};
      mockedState[from.location][from.type].critters.push(firstCritter);
      mockedState[from.location][from.type].critters.push(secondCritter);
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('moveCritter', {from, to});
        expect(mockedState[from.location][from.type].critters).not.to.include(firstCritter);
        expect(mockedState[from.location][from.type].critters).to.include(secondCritter);
        expect(mockedState[to.location][to.type].critters).to.include(firstCritter);
        done();
      })
    });

    describe('removing critters', () => {
      const critterId = 1;
      it('should remove from mound', (done) => {
        const location = 'worker';
        const type = 'factory';
        const critterToRemove = CritterFactory.default(critterId, 1, Critter.GENDER_MALE);
        const critterToKeep = CritterFactory.default(critterId+1, 1, Critter.GENDER_FEMALE);
        mockedState[location][type].critters.push(critterToRemove);
        mockedState[location][type].critters.push(critterToKeep);

        getStore((store) => {
          store.replaceState(mockedState);

          store.commit('removeCritter', {location, type, critterId: critterToRemove.id});
          expect(mockedState[location][type].critters.length).to.equal(1);
          expect(mockedState[location][type].critters).to.include(critterToKeep);
          expect(mockedState[location][type].critters).not.to.include(critterToRemove);
          done();
        })
      });

      it('should not error when removing non-existent critter', (done) => {
        const location = 'worker';
        const type = 'mine';
        let nonExistentCritterId = 999;

        getStore((store) => {
          store.replaceState(mockedState);

          // Try to remove critter that doesn't exist
          store.commit('removeCritter', {location, type, nonExistentCritterId});
          done();
        })
      });

      it('should not remove the king', (done) => {
        const location = 'royalHatchery';
        const type = 'father';
        const kingCritter = CritterFactory.default(critterId, 1, Critter.GENDER_MALE);
        mockedState[location][type].critters.push(kingCritter);

        getStore((store) => {
          store.replaceState(mockedState);

          store.commit('removeCritter', {location, type, critterId});
          console.log('test', mockedState[location][type].critters)
          expect(mockedState[location][type].critters.length).to.equal(1);
          expect(mockedState[location][type].critters).to.include(kingCritter);
          done();
        })
      });

      it('should not remove the queen', (done) => {
        const location = 'royalHatchery';
        const type = 'father';
        const critterId = 1;
        const queenCritter = CritterFactory.default(critterId, 1, Critter.GENDER_FEMALE);
        mockedState[location][type].critters.push(queenCritter);

        getStore((store) => {
          store.replaceState(mockedState);

          store.commit('removeCritter', {location, type, critterId});
          console.log('test', mockedState[location][type].critters)
          expect(mockedState[location][type].critters.length).to.equal(1);
          expect(mockedState[location][type].critters).to.include(queenCritter);
          done();
        })
      });
    });

    it('should update raw production values', (done) => {
      const rawMineValue = mockedState.worker.mine.productionPerSecondRaw;
      const dirtPerSecond = rawMineValue + 5;
      const rawFarmValue = mockedState.worker.farm.productionPerSecondRaw;
      const rawCarryValue = mockedState.worker.carry.productionPerSecondRaw;
      const rawFactoryValue = mockedState.worker.factory.productionPerSecondRaw;
      const critter = {dirtPerSecond};
      mockedState.worker.mine.critters.push(critter);
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('updateProductionRaw');
        expect(mockedState.worker.mine.productionPerSecondRaw).to.equal(dirtPerSecond);
        expect(mockedState.worker.farm.productionPerSecondRaw).to.equal(rawFarmValue);
        expect(mockedState.worker.carry.productionPerSecondRaw).to.equal(rawCarryValue);
        expect(mockedState.worker.factory.productionPerSecondRaw).to.equal(rawFactoryValue);
        done();
      })
    });

    it('should update production mounds', (done) => {
      const payload = {};
      const mine = mockedState.worker.mine;
      const farm = mockedState.worker.farm;
      const carry = mockedState.worker.carry;
      const factory = mockedState.worker.factory;
      payload['farm'] = {};
      payload['carry'] = {};
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('updateProductionMounds', payload);
        expect(mockedState.worker.mine).to.equal(mine);
        expect(mockedState.worker.farm).not.to.equal(farm);
        expect(mockedState.worker.farm).to.equal(payload.farm);
        expect(mockedState.worker.carry).not.to.equal(carry);
        expect(mockedState.worker.carry).to.equal(payload.carry);
        expect(mockedState.worker.factory).to.equal(factory);
        done();
      })
    });

    it('should set boost value', (done) => {
      const boosts = mockedState.royalHatchery.boosts;
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('setBoost', boosts + 5);
        expect(mockedState.royalHatchery.boosts).to.equal(boosts+5);
        done();
      })
    });

    it('should set sod amount', (done) => {
      const totalSod = mockedState.totalSod;
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('setSodAmount', totalSod + 5);
        expect(mockedState.totalSod).to.equal(totalSod+5);
        done();
      })
    });

    it('should upgrade mound', (done) => {
      const location = 'worker';
      const type = 'farm';
      const size = mockedState[location][type].size;
      const cost = mockedState[location][type].upgradeCost;
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('upgradeMound', {location, type});
        const mound = mockedState[location][type];
        expect(mound.size).to.equal(size+1);
        expect(mound.upgradeCost).to.equal(cost*10);
        done();
      })
    });

    it('should set new gene chance value', (done) => {
      const newGeneChance = mockedState.newGeneChance;
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('setNewGeneChance', newGeneChance + 10);
        expect(mockedState.newGeneChance).to.equal(newGeneChance+10);
        done();
      })
    });

    it('should add discovered gene id', (done) => {
      const geneId = 13;
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('addDiscoveredGene', geneId);
        expect(mockedState.unlockedGenes).to.include(geneId);
        done();
      })
    });

    it('should sort mound', (done) => {
      const location = 'worker';
      const type = 'farm';
      const sortBy = 'base';
      const highCritter = CritterFactory.default(1, 1, Critter.GENDER_FEMALE);
      sinon.stub(highCritter, 'baseScore').get(() => 10);
      const lowCritter = CritterFactory.default(1, 2, Critter.GENDER_MALE);
      sinon.stub(lowCritter, 'baseScore').get(() => 5);

      mockedState[location][type].critters.push(lowCritter);
      mockedState[location][type].critters.push(highCritter);
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('sortMound', {location, type, sortBy});
        expect(mockedState[location][type].critters[0]).to.equal(highCritter);
        expect(mockedState[location][type].critters[1]).to.equal(lowCritter);
        done();
      })
    });

    it('should set achievements', (done) => {
      const achievements = [1, 2];
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('setAchievements', achievements);
        expect(mockedState.achievements).to.equal(achievements);
        done();
      })
    });

    it('should save state to storage', (done) => {
      sinon.stub(localforage, 'setItem');

      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('saveToStorage');
        expect(localforage.setItem).to.have.been.calledWith('crittermound', mockedState);

        localforage.setItem.restore();
        done();
      })
    });

    it('should set war', (done) => {
      const war = {some: 'value'};
      getStore((store) => {
        store.replaceState(mockedState);

        store.commit('setWar', war);

        expect(mockedState.soldiers.currentWar).to.equal(war)
        done();
      })
    });

  });

  describe("actions", () => {
    let mockedState;
    beforeEach(() => {
      mockedState = JSON.parse(JSON.stringify(state));
    });

    it('should heal all critters', (done) => {
      const firstCritter = { id: 1, currentHealth: 0, maxHealth: 10, actionTime: 1};
      const secondCritter = { id: 2, currentHealth: 5, maxHealth: 10, actionTime: 10};
      mockedState.royalHatchery.mother.critters.push(firstCritter);
      mockedState.royalHatchery.father.critters.push(secondCritter);
      const expectedFirst = {critterId: firstCritter.id, value: 10};
      const expectedSecond = {critterId: secondCritter.id, value: 6};

      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('healAllCritters');
        expect(context.commit).to.have.been.calledTwice;
        expect(context.commit).to.have.been.calledWith('setCritterHealth', expectedFirst);
        expect(context.commit).to.have.been.calledWith('setCritterHealth', expectedSecond);
        done();
      }, true);
    });

    it('should reset critter health', (done) => {
      const critterId = 4;
      getStore((store) => {
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('resetCritterHealth', critterId);
        expect(context.commit).to.have.been.calledWith('setCritterHealth', {critterId, value: 0});
        done();
      }, true);
    });

    it('should breed a new critter', (done) => {
      const location = 'royalHatchery';
      const generation = 2;
      const mother = {generation, id:1};
      const father = {generation, id:2};
      mockedState[location].mother.critters.push(mother);
      mockedState[location].father.critters.push(father);
      const child = {};
      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');
        sinon.stub(CritterFactory, 'breed').returns(child);

        store.dispatch('breedCritter', location);
        expect(context.commit).to.have.been.calledWith('setTotalGenerations', generation+1);
        expect(context.commit).to.have.been.calledWith('setCritterHealth', {critterId: mother.id, value: 0});
        expect(context.commit).to.have.been.calledWith('setCritterHealth', {critterId: father.id, value: 0});
        expect(context.commit).to.have.been.calledWith('addChildToHatchery', {location, critter: child});

        CritterFactory.breed.restore();
        done();
      }, true);
    });

    it('should replace parent', (done) => {
      const location = 'royalHatchery';
      const type = Critter.GENDER_FEMALE;

      const from = {location, type};
      const to = {location, type: 'mother'};
      getStore((store) => {
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');
        store.dispatch('replaceParent', {location, type});

        expect(context.commit).to.have.been.calledWith('moveCritter', {from, to});
        done();
      }, true)
    });

    it('should add worker', (done) => {
      const location = 'royalHatchery';
      const type = Critter.GENDER_FEMALE;
      const critter = {some: 'value'};
      const destination = {location: 'worker', type: 'farm'};
      const sodProductionStub = {allocateWorker: () => destination};
      const from = {location, type};
      mockedState[location][type].critters.push(critter);

      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;

        sinon.stub(SodProduction, 'instance').returns(sodProductionStub);
        sinon.stub(context, 'commit');

        store.dispatch('addWorker', {location, type});
        expect(context.commit).to.have.been.calledWith('moveCritter', {from, to: destination});
        expect(context.commit).to.have.been.calledWith('updateProductionRaw');

        SodProduction.instance.restore();
        done();
      }, true)
    });

    it('should not add worker if original location has no critters', (done) => {
      const location = 'royalHatchery';
      const type = Critter.GENDER_FEMALE;
      const sodProductionStub = {allocateWorker: () => null};

      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;

        sinon.stub(SodProduction, 'instance').returns(sodProductionStub);
        sinon.stub(context, 'commit');

        store.dispatch('addWorker', {location, type});
        expect(context.commit).not.to.have.been.called;
        expect(context.commit).not.to.have.been.called;

        SodProduction.instance.restore();
        done();
      }, true)
    });

    it('should remove critter if critter cannot be added', (done) => {
      const location = 'royalHatchery';
      const type = Critter.GENDER_FEMALE;
      const critterId = 1;
      const critter = {id: critterId};
      const destination = {location: 'worker', type: 'farm'};
      //cannot add worker
      const sodProductionStub = {allocateWorker: () => null};
      const from = {location, type};
      mockedState[location][type].critters.push(critter);

      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;

        sinon.stub(SodProduction, 'instance').returns(sodProductionStub);
        sinon.stub(context, 'commit');

        store.dispatch('addWorker', {location, type});
        expect(context.commit).to.have.been.calledWith('removeCritter', {location, type, critterId});
        done();
      }, true)
    });

    it('should add soldier', (done) => {
      const from = {location: 'royalHatchery', type: Critter.GENDER_FEMALE};
      const to = {location: 'soldiers', type: 'army'};
      const critter = {};
      mockedState[from.location][from.type].critters.push(critter);
      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;

        sinon.stub(context, 'commit');

        store.dispatch('addSoldier', from);
        expect(context.commit).to.have.been.calledWith('moveCritter', {from, to});
        done();
      }, true)
    });

    it('should not add soldier if original location has no critters', (done) => {
      const location = 'royalHatchery';
      const type = Critter.GENDER_FEMALE;

      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('addSoldier', {location, type});
        expect(context.commit).not.to.have.been.called;
        done();
      }, true)
    });

    it('should use boost', (done) => {
      const boosts = mockedState.royalHatchery.boosts;
      const location = 'royalHatchery';

      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');
        sinon.stub(context, 'dispatch').withArgs('breedCritter');

        store.dispatch('useBoost', location);
        expect(context.commit).to.have.been.calledWith('setBoost', boosts-1);
        expect(context.dispatch).to.have.been.calledWith('breedCritter', location);
        done();
      }, true);
    });

    it('should not use boost if none are left', (done) => {
      mockedState.royalHatchery.boosts = 0;
      const location = 'royalHatchery';

      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');
        sinon.stub(context, 'dispatch').withArgs('breedCritter');

        store.dispatch('useBoost', location);
        expect(context.commit).not.to.have.been.called;
        expect(context.dispatch).not.to.have.been.called;
        done();
      }, true);
    });

    it('should upgrade mound', (done) => {
      const sod = 100;
      const upgradeCost = 10;
      const location = 'royalHatchery';
      const type = Critter.GENDER_FEMALE;
      mockedState.totalSod = sod;
      mockedState[location][type].upgradeCost = upgradeCost;

      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('upgradeMound', {location, type});
        expect(context.commit).to.have.been.calledWith('upgradeMound', {location, type});
        expect(context.commit).to.have.been.calledWith('setSodAmount', sod - upgradeCost);
        done();
      }, true)
    });

    it('should not upgrade mount if sod is not enough', (done) => {
      const sod = 10;
      const upgradeCost = 100;
      const location = 'royalHatchery';
      const type = Critter.GENDER_FEMALE;
      mockedState.totalSod = sod;
      mockedState[location][type].upgradeCost = upgradeCost;

      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('upgradeMound', {location, type});
        expect(context.commit).not.to.have.been.called;
        done();
      }, true)
    });

    it('should set new gene chance', (done) => {
      const newGeneChance = 15;
      getStore((store) => {
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('setNewGeneChance', newGeneChance);
        expect(context.commit).to.have.been.calledWith('setNewGeneChance', newGeneChance);
        done();
      }, true)
    });

    it('should add discovered gene id', (done) => {
      const geneId = 15;
      getStore((store) => {
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('addDiscoveredGene', geneId);
        expect(context.commit).to.have.been.calledWith('addDiscoveredGene', geneId);
        done();
      }, true)
    });

    it('trigger mound sort', (done) => {
      const payload = {};
      getStore((store) => {
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('sortMound', payload);
        expect(context.commit).to.have.been.calledWith('sortMound', payload);
        done();
      }, true)
    });

    it('should update data', (done) => {
      const critter = {id: 9, currentHealth: 10};
      const changes = {
        critters: [critter],
        sodProduction: {
          dirtPerSecond: 1,
          grassPerSecond: 2,
          dirtStored: 3,
          grassStored: 4,
          dirtCarriedPerSecond: 5,
          grassCarriedPerSecond: 6,
          factoryDirtStored: 7,
          factoryGrassStored: 8,
          sodPerSecond: 9
        },
        addSod: 23,
        achievements: [0, 1, 2, 3]
      };
      const totalSod = mockedState.totalSod;

      getStore((store) => {
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('updateData', changes);
        expect(context.commit).to.have.been.calledWith('setCritterHealth', {critterId: critter.id, value: critter.currentHealth});
        expect(context.commit).to.have.been.calledWith('updateProductionMounds', changes.sodProduction);
        expect(context.commit).to.have.been.calledWith('setSodAmount', totalSod + changes.addSod);
        expect(context.commit).to.have.been.calledWith('setAchievements', changes.achievements);
        done();
      }, true)
    });

    it('should add critters that cannot be found', (done) => {
      const location = 'royalHatchery';
      const critter = {id: 23};
      const changes = {
        critters: [critter]
      };

      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('updateData', changes);
        expect(context.commit).to.have.been.calledWith('addChildToHatchery', {location, critter});
        done();
      }, true);
    });

    it('should not add critters that are already present', (done) => {
      const location = 'royalHatchery';
      const critter = {id: 23};
      const changes = {
        critters: [critter]
      };
      mockedState[location].mother.critters.push(critter);
      getStore((store) => {
        store.replaceState(mockedState);
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('updateData', changes);
        expect(context.commit).not.to.have.been.calledWith('addChildToHatchery', {location, critter});
        done();
      }, true);
    });

    it('should trigger save', (done) => {
      getStore((store) => {
        const context = store._modules.root.context;
        sinon.stub(context, 'commit');

        store.dispatch('saveToStorage');
        expect(context.commit).to.have.been.calledWith('saveToStorage');
        done();
      }, true);
    });

    it('should start war', (done) => {
      const nationId = Nation.BEES.id;
      const nation = {id: nationId};
      const war = {nation};
      getStore((store) => {
        const context = store._modules.root.context;
        sinon.stub(Nation, 'get').returns(nation);
        sinon.stub(context, 'commit');

        store.dispatch('startWar', nationId);
        expect(Nation.get).to.have.been.calledWith(nationId);
        expect(context.commit).to.have.been.calledWith('setWar', sinon.match(war));

        Nation.get.restore();
        done();
      }, true);
    })
  });
});