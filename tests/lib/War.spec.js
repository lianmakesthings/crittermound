import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import War from '../../src/lib/War';
import {RandomInRange, CoinFlip} from '../../src/lib/Helpers'

chai.use(sinonChai);

const expect = chai.expect;

describe('A war', () => {
  it('should have an enemy nation and a map', () => {
    const nation = {id: 12};
    const map = {tiles: []};

    sinon.stub(War.prototype, 'generateMap').returns(map);
    sinon.stub(War.prototype, 'generateBases');
    const war = new War(nation);


    expect(war.generateMap).to.have.been.called;
    expect(war.generateBases).to.have.been.called;
    expect(war.nation).to.equal(nation);
    expect(war.map).to.equal(map);

    War.prototype.generateMap.restore();
    War.prototype.generateBases.restore();
  });

  it('should generate a map with set height and width of 20', () => {
    const war = new War({id: 12});
    const map = war.generateMap();

    expect(map.tiles.length).to.equal(20);
    expect(map.tiles[0].length).to.equal(20);
  });

  describe('generating bases', () => {
    let war;
    const x = 2;
    beforeEach(() => {
      war = new War({id: 12});
      sinon.stub(war, 'randomInRange').returns(x);
      sinon.stub(war, 'coinFlip').returns(true);
    });

    it('should set one for the critters and enemy', () => {
      sinon.stub(war.map, 'setSpecialTile');

      war.generateBases();

      expect(war.map.setSpecialTile).to.have.been.calledWith('mound', {x, y:3});
      expect(war.map.setSpecialTile).to.have.been.calledWith('enemy', {x, y:17});
    });

    it('should switch base positions on coin flip', () => {
      sinon.stub(war.map, 'setSpecialTile');
      war.coinFlip.returns(false);

      war.generateBases();

      expect(war.map.setSpecialTile).to.have.been.calledWith('mound', {x, y:17});
      expect(war.map.setSpecialTile).to.have.been.calledWith('enemy', {x, y:3});
    });

    afterEach(() => {
      war.randomInRange.restore();
      war.coinFlip.restore();
    });
  });

});