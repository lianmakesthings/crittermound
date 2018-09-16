import getStore from '../../src/store/store';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import localforage from 'localforage';
import state from '../../src/store/state';
import CritterFactory from "../../src/lib/CritterFactory";
import Critter from "../../src/lib/Critter";
import Nation from "../../src/lib/Nation";
import War from "../../src/lib/War";

chai.use(sinonChai);
const expect = chai.expect;


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

      sinon.stub(CritterFactory, 'fromState').callsFake(() => { return {}});
      localforage.getItem.callsFake(() => Promise.resolve(savedState));

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

      sinon.stub(CritterFactory, 'default').callsFake(() => { return {}});
      localforage.getItem.callsFake(() => Promise.reject('no localstorage'));

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
    let expectedState;
    beforeEach(() => {
      expectedState = JSON.parse(JSON.stringify(state));
    });

    it('should return the entire state', (done) => {
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.entireState).to.equal(expectedState);
        done();
      }, true)
    });

    it('should return all critters', (done) => {
      const queen = {};
      const worker = {};
      expectedState.royalHatchery.mother.critters.push(queen);
      expectedState.worker.mine.critters.push(worker);

      getStore((store) => {
        store.replaceState(expectedState);
        const allCritters = store.getters.allCritters;

        expect(allCritters.length).to.equal(2);
        expect(allCritters).to.include(queen);
        expect(allCritters).to.include(worker);
        done();
      }, true);
    });

    it('should return all workers', (done) => {
      const queen = {};
      const worker = {};
      expectedState.royalHatchery.mother.critters.push(queen);
      expectedState.worker.mine.critters.push(worker);

      getStore((store) => {
        store.replaceState(expectedState);
        const allCritters = store.getters.allWorkers;

        expect(allCritters.length).to.equal(1);
        expect(allCritters).to.include(worker);
        expect(allCritters).not.to.include(queen);
        done();
      }, true);
    });

    it('should return critters by location and type', (done) => {
      const location = 'royalHatchery';
      const type = 'mother';
      const queen = {};
      const worker = {};
      expectedState[location][type].critters.push(queen);
      expectedState.worker.mine.critters.push(worker);
      getStore((store) => {
        store.replaceState(expectedState);
        const critters = store.getters.critters(location, type);

        expect(critters).to.include(queen);
        expect(critters).not.to.include(worker);
        done();
      }, true)
    });

    it('should return number of total critters', (done) => {
      const totalCritters = 42;
      expectedState.totalCritters = totalCritters;
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.totalCritters).to.equal(totalCritters);
        done();
      }, true)
    });

    it('should return sod production part of state', (done) => {
      const sodProduction = {some : "value"};
      expectedState.worker = sodProduction;

      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.sodProduction).to.equal(sodProduction);
        done();
      }, true);
    });

    it('should return the total amount of sod', (done) => {
      const totalSod = 1337;
      expectedState.totalSod = totalSod;

      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.totalSod).to.equal(totalSod);
        done();
      })
    });

    it('should return mound by location and type', (done) => {
      const location = 'royalHatchery';
      const type = 'mother';
      const expectedMound = {some: "mound"};
      expectedState[location][type] = expectedMound;

      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.mound(location, type)).to.equal(expectedMound);
        done();
      })
    });

    it('should return a specific critter by id', (done) => {
      const critterId = 5;
      const expectedCritter = {id: critterId};
      const otherCritter = {id: 2};

      expectedState.worker.mine.critters.push(expectedCritter);
      expectedState.royalHatchery.female.critters.push(otherCritter);

      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.findCritter(critterId)).to.equal(expectedCritter);
        done();
      })
    });

    it('should return number of boosts', (done) => {
      const expectedBoosts = 5;
      expectedState.royalHatchery.boosts = expectedBoosts;
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.boosts).to.equal(expectedBoosts);
        done();
      })
    });

    it('should return max number of boosts', (done) => {
      const expectedMaxBoosts = 9;
      expectedState.royalHatchery.maxBoosts = expectedMaxBoosts;
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.maxBoosts).to.equal(expectedMaxBoosts);
        done();
      })
    });

    it('should return whether state was saved', (done) => {
      const stateSaved = true;
      expectedState.stateSaved = stateSaved;
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.showStateSaved).to.equal(stateSaved);
        done();
      })
    });

    it('should return new gene chance', (done) => {
      const newGeneChance = 9;
      expectedState.newGeneChance = newGeneChance;
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.newGeneChance).to.equal(newGeneChance);
        done();
      })
    });

    it('should return array of unlocked gene ids', (done) => {
      const unlockedGeneId = 2;
      expectedState.unlockedGenes.push(unlockedGeneId);
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.unlockedGenes).to.include(unlockedGeneId);
        done();
      })
    });

    it('should return allocation of the royal hatchery', (done) => {
      const sizeEach = 5;
      expectedState.royalHatchery.female.size = sizeEach;
      expectedState.royalHatchery.male.size = sizeEach;
      expectedState.royalHatchery.female.critters.push({});
      expectedState.royalHatchery.female.critters.push({});
      expectedState.royalHatchery.male.critters.push({});
      const expectedAlloc = {current: 3, max: sizeEach*2};
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.royalHatcheryAlloc).to.deep.equal(expectedAlloc);
        done();
      })
    });

    it('should return allocation of the worker mound', (done) => {
      const sizeEach = 5;
      expectedState.worker.mine.size = sizeEach;
      expectedState.worker.farm.size = sizeEach;
      expectedState.worker.carry.size = sizeEach;
      expectedState.worker.factory.size = sizeEach;
      expectedState.worker.mine.critters.push({});
      expectedState.worker.carry.critters.push({});
      expectedState.worker.carry.critters.push({});
      const expectedAlloc = {current: 3, max: sizeEach*4};
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.workerAlloc).to.deep.equal(expectedAlloc);
        done();
      })
    });

    it('should return the unlock level for all achievemnts', (done) => {
      const unlockedAchievements = [].concat(expectedState.achievements);
      unlockedAchievements[4] = 2;
      expectedState.achievements = unlockedAchievements;
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.unlockedAchievements).to.equal(unlockedAchievements);
        done();
      })
    });

    it('should return the allocation of the army mound', (done) => {
      const size = 5;
      expectedState.soldiers.army.size = size;
      expectedState.soldiers.army.critters.push({});
      expectedState.soldiers.army.critters.push({});
      const expectedAlloc = {current: 2, max: size};
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.armyAlloc).to.deep.equal(expectedAlloc);
        done();
      })
    });

    it('should return the achievement quota', (done) => {
      const unlockedAchievements = [].concat(expectedState.achievements);
      unlockedAchievements[4] = 2;
      expectedState.achievements = unlockedAchievements;
      const expectedQuota = {current: 2, max: 212};
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.achievementQuota).to.deep.equal(expectedQuota);
        done();
      })
    });

    it('should return the current war state', (done) => {
      expectedState.soldiers.currentWar = War.generateMap(Nation.CRICKETS);
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.atWar).to.be.true;
        done();
      })
    });

    it('should return the current war map', (done) => {
      const map = War.generateMap(Nation.CRICKETS);
      expectedState.soldiers.currentWar = map;
      getStore((store) => {
        store.replaceState(expectedState);

        expect(store.getters.currentMap).to.equal(map.tiles);
        done();
      })
    });
  })
});