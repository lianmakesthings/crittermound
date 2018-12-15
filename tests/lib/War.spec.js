import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import War from '../../src/lib/War';
import Treasure from '../../src/lib/Treasure';

chai.use(sinonChai);

const expect = chai.expect;

describe('A war', () => {
  it('should have an enemy nation and a map', () => {
    const nation = {id: 12};
    const map = {tiles: []};

    sinon.stub(War.prototype, 'generateMap').returns(map);
    sinon.stub(War.prototype, 'generateBases');
    sinon.stub(War.prototype, 'generateTreasures');
    sinon.stub(War.prototype, 'generateArtifacts');
    const war = new War(nation);


    expect(war.generateMap).to.have.been.called;
    expect(war.generateBases).to.have.been.called;
    expect(war.generateTreasures).to.have.been.called;
    expect(war.generateArtifacts).to.have.been.called;
    expect(war.nation).to.equal(nation);
    expect(war.map).to.equal(map);

    War.prototype.generateMap.restore();
    War.prototype.generateBases.restore();
    War.prototype.generateTreasures.restore();
    War.prototype.generateArtifacts.restore();
  });

  it('should generate a map with set height and width of 20', () => {
    const war = new War({id: 12});

    expect(war.map.tiles.length).to.equal(20);
    expect(war.map.tiles[0].length).to.equal(20);
  });

});