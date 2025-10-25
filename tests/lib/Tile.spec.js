import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
use(sinonChai);

import Tile from '../../src/lib/Tile.js';

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