import Map from '../../src/lib/Map';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Tile from "../../src/lib/Tile";

chai.use(sinonChai);

const expect = chai.expect;

describe('A map', () => {
  const width = 1;
  const height = 2;
  const x = 0;
  const y = 1;
  let tile;
  let map;
  beforeEach(() => {
    tile = new Tile(x, y);
    map = new Map(width, height);
  });

  it('should create a map with given tiles', () => {
    expect(map.tiles.length).to.equal(height);
    expect(map.tiles[0].length).to.equal(width);
    expect(map.tiles[1].length).to.equal(width);

    expect(map.tiles[0][0].x).to.equal(0);
    expect(map.tiles[0][0].y).to.equal(0);
    expect(map.tiles[1][0].x).to.equal(0);
    expect(map.tiles[1][0].y).to.equal(1);
  });

  it('should get tile by coordinates', () => {
    map.tiles[y][x] = tile;

    expect(map.getTile(x, y)).to.equal(tile)
  });

  it('should set special tile type', () => {
    const bonusName = 'someBonus';
    map.tiles[y][x] = tile;

    expect(tile.bonus).to.be.null;
    map.setSpecialTile(bonusName, {x, y});

    expect(tile.bonus).to.equal(bonusName)
  });
});