import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
use(sinonChai);

import Map from '../../src/lib/Map.js';
import Tile from '../../src/lib/Tile.js';
import War from '../../src/lib/War.js';
import Treasure from '../../src/lib/Treasure.js';

describe('A map', () => {
  const width = 5;
  const height = 5;
  const x = 0;
  const y = 1;

  it('should get tile by coordinates', () => {
    const tile = new Tile(x, y);
    const map = new Map(width, height);
    map.tiles[y][x] = tile;

    expect(map.getTile(x, y)).to.equal(tile)
  });

  it('should set special tile type', () => {
    const tile = new Tile(x, y);
    const map = new Map(width, height);
    const bonusName = 'someBonus';
    map.tiles[y][x] = tile;

    expect(tile.bonus).to.be.null;
    map.setSpecialTile(bonusName, {x, y});

    expect(tile.bonus).to.equal(bonusName)
  });

  describe('on creation', () => {
    it('should create a map with given height and width', () => {
      const map = new Map(width, height);
      expect(map.tiles.length).to.equal(height);
      expect(map.tiles[0].length).to.equal(width);
      expect(map.tiles[1].length).to.equal(width);

      expect(map.tiles[0][0].x).to.equal(0);
      expect(map.tiles[0][0].y).to.equal(0);
      expect(map.tiles[1][0].x).to.equal(0);
      expect(map.tiles[1][0].y).to.equal(1);
    });
  });

  describe('generating bases', () => {
    let map;
    const x = 2;
    beforeEach(() => {
      map = new Map(War.MAP_WIDTH, War.MAP_HEIGHT);
      sinon.stub(map, 'randomInRange').returns(x);
      sinon.stub(map, 'coinFlip').returns(true);
      sinon.stub(map, 'setSpecialTile');
    });

    it('should set one for the critters and enemy', () => {
      map.generateBases();

      expect(map.setSpecialTile).to.have.been.calledWith('mound', {x, y:3});
      expect(map.setSpecialTile).to.have.been.calledWith('enemy', {x, y:17});
    });

    it('should switch base positions on coin flip', () => {
      map.coinFlip.returns(false);

      map.generateBases();

      expect(map.setSpecialTile).to.have.been.calledWith('mound', {x, y:17});
      expect(map.setSpecialTile).to.have.been.calledWith('enemy', {x, y:3});
    });

    afterEach(() => {
      map.randomInRange.restore();
      map.coinFlip.restore();
      map.setSpecialTile.restore();
    });
  });

  describe('generating treasures', () => {
    const x = 1;
    const y = 4;

    let treasure;
    let map;

    beforeEach(() => {
      treasure = {
        name: 'treasure',
        x: {min: 1, max: 2},
        y: {min: 3, max: 4},
      };
      map = new Map(width, height);
      sinon.stub(Treasure, 'getAll').returns([treasure]);
      sinon.stub(map, 'randomInRange');
      map.randomInRange.withArgs(treasure.x.min, treasure.x.max).returns(x);
      map.randomInRange.withArgs(treasure.y.min, treasure.y.max).returns(y);
      sinon.stub(map, 'setSpecialTile');
      sinon.stub(map, 'getTile').returns({isBlocked: () => false});
    });

    it('should set a tile for each treasure', () => {
      const anotherTreasure = {
        name: 'treasure2',
        x: {min: 1, max: 2},
        y: {min: 3, max: 4},
      };

      Treasure.getAll.returns([treasure, anotherTreasure]);
      map.generateTreasures();

      expect(map.setSpecialTile).to.have.been.calledWith(treasure.name, {x, y});
      expect(map.setSpecialTile).to.have.been.calledWith(anotherTreasure.name, {x, y});
      expect(map.setSpecialTile).to.have.been.calledTwice;
    });

    it('should find a tile that is not blocked to set treasure on', () => {
      const blockedTile = {isBlocked: () => true};
      const freeTile = {isBlocked: () => false};
      const x2 = 2;
      const y2 = 3;

      map.randomInRange.withArgs(treasure.x.min, treasure.x.max).onFirstCall().returns(x);
      map.randomInRange.withArgs(treasure.y.min, treasure.y.max).onFirstCall().returns(y);
      map.randomInRange.withArgs(treasure.x.min, treasure.x.max).onSecondCall().returns(x2);
      map.randomInRange.withArgs(treasure.y.min, treasure.y.max).onSecondCall().returns(y2);
      map.getTile.withArgs(x, y).returns(blockedTile);
      map.getTile.withArgs(x2, y2).returns(freeTile);

      map.generateTreasures();

      expect(map.setSpecialTile).not.to.have.been.calledWith(treasure.name, {x, y});
      expect(map.setSpecialTile).to.have.been.calledWith(treasure.name, {x: x2, y: y2});
    });

    afterEach(() => {
      Treasure.getAll.restore();
      map.randomInRange.restore();
      map.setSpecialTile.restore();
      map.getTile.restore();
    })
  });

  describe('generating artifacts', () => {
    const x = 2;
    const y = 4;
    let map;

    beforeEach(() => {
      map = new Map(width, height);
      sinon.stub(map, 'randomInRange').returns(0);
      sinon.stub(map, 'setSpecialTile');
    });

    it('should generate four artifacts', () => {
      map.randomInRange
        .onFirstCall().returns(x)
        .onSecondCall().returns(y);
      map.generateArtifacts();

      expect(map.randomInRange).to.have.been.called;
      expect(map.randomInRange.callCount).to.equal(8);
      expect(map.setSpecialTile).to.have.been.calledWith(sinon.match('artifact'), {x, y});
      expect(map.setSpecialTile.callCount).to.equal(4);
    });

    it('should put artifact in specific range', () => {
      map.generateArtifacts();
      expect(map.randomInRange).to.always.have.been.calledWithExactly(0, width -1);
    });

    it('should not put artifact if tile is blocked', () => {
      const x1 = 1;
      const y1 = 3;

      const blockedTile = {isBlocked: () => true};
      const freeTile = {isBlocked: () => false};

      map.randomInRange
        .onCall(0).returns(x)
        .onCall(1).returns(y)
        .onCall(2).returns(x1)
        .onCall(3).returns(y1);

      sinon.stub(map, 'getTile')
        .returns(freeTile)
        .withArgs(x, y).returns(blockedTile);

      map.generateArtifacts();
      expect(map.setSpecialTile).not.to.have.been.calledWith('artifact0', {x, y});
      expect(map.setSpecialTile).to.have.been.calledWith('artifact0', {x: x1, y: y1});

      map.getTile.restore();
    });

    afterEach(() => {
      map.randomInRange.restore();
      map.setSpecialTile.restore();
    });
  });
});