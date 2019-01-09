import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import War from '../../src/lib/War';
import Treasure from '../../src/lib/Treasure';

chai.use(sinonChai);

const expect = chai.expect;

describe('A war', () => {
  const nation = {id: 12};
  const map = {tiles: [], generateBases: () => {}, generateTreasures: () => {}, generateArtifacts: () => {}};

  it('should have an enemy nation and a map', () => {    
    sinon.stub(War.prototype, 'generateMap').returns(map);
    const war = new War({id: 12});

    expect(war.generateMap).to.have.been.called;
    expect(war.nation).to.deep.equal(nation);
    expect(war.map).to.equal(map);

    War.prototype.generateMap.restore();
  });

  it('should generate a map with set height and width of 20', () => {
    const war = new War({id: 12});
    expect(war.map.tiles.length).to.equal(20);
    expect(war.map.tiles[0].length).to.equal(20);
  });

  it('should generate special tiles', () => {
    const war = new War({id: 12});
    sinon.spy(war.map, 'generateBases')
    sinon.spy(war.map, 'generateTreasures')
    sinon.spy(war.map, 'generateArtifacts')
    war.generateSpecialTiles();

    expect(war.map.generateBases).to.have.been.called;
    expect(war.map.generateTreasures).to.have.been.called;
    expect(war.map.generateArtifacts).to.have.been.called;
  });
});