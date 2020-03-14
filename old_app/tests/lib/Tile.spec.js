import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Tile from '../../src/lib/Tile';

chai.use(sinonChai);

const expect = chai.expect;

describe('A tile', () => {
  const x = 3;
  const y = 2;
  it('should be created with params', () => {
    const tile = new Tile(x, y);

    expect(tile.x).to.equal(x);
    expect(tile.y).to.equal(y);
    expect(tile.bonus).to.be.null;
  });

  it('should be blocked if it has a bonus', () => {
    const tileA = new Tile(x, y);
    tileA.bonus = 'bonus';
    const tileB = new Tile(x, y);

    expect(tileA.isBlocked()).to.be.true;
    expect(tileB.isBlocked()).to.be.false;
  })
});