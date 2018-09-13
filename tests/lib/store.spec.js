import getStore from '../../src/store/store';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import localforage from 'localforage';
import state from '../../src/store/state';

chai.use(sinonChai);
const expect = chai.expect;


describe('The vuex store', () => {
  describe('loading the state', () => {
    it('should try localstorage first', (done) => {
      const savedState = JSON.parse(JSON.stringify(state));

      sinon.stub(localforage, "config");
      sinon.stub(localforage, "getItem").callsFake(() => Promise.resolve(savedState));

      getStore((store) => {
        expect(localforage.getItem).to.have.been.calledWith('crittermound');
        expect(store.state).to.equal(savedState);
        done();
      })
    });

    it('should read set initial state if no state saved in localstorage', (done) => {
      sinon.stub(localforage, "config");
      sinon.stub(localforage, "getItem").callsFake(() => Promise.reject());

      getStore((store) => {
        expect(store.state).to.deep.equal(state);
        done();
      })
    });

    afterEach(() => {
      localforage.config.restore();
      localforage.getItem.restore();
    })
  });
});