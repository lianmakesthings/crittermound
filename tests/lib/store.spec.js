import getStore from '../../src/store/store';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import localforage from 'localforage';
import state from '../../src/store/state';
import CritterFactory from "../../src/lib/CritterFactory";
import Critter from "../../src/lib/Critter";
import Nation from "../../src/lib/Nation";

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
    })
  })
});