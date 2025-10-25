import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
use(sinonChai);

import Treasure from '../../src/lib/Treasure.js';
import War from '../../src/lib/War.js';

describe('The treasure class', () => {
  it('should get a list of all treasures', () => {
    const allTreasures = Treasure.getAll();
    allTreasures.forEach(treasure => {
      expect(treasure).to.be.an.instanceof(Treasure);
      expect(treasure.x.min).to.be.within(0, War.MAP_WIDTH);
      expect(treasure.x.max).to.be.within(0, War.MAP_WIDTH);
      expect(treasure.x.max).to.be.above(treasure.x.min);
      expect(treasure.y.min).to.be.within(0, War.MAP_HEIGHT);
      expect(treasure.y.max).to.be.within(0, War.MAP_HEIGHT);
      expect(treasure.y.max).to.be.above(treasure.y.min);
    })
  });
});