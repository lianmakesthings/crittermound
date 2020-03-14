import Tile from './Tile';
import {CoinFlip, RandomInRange} from "./Helpers";
import Treasure from "./Treasure";

class Map {
  constructor(width, height) {
    this.randomInRange = RandomInRange;
    this.coinFlip = CoinFlip;
    this.width = width;
    this.height = height;
    this.tiles = [];

    for (let y = 0; y < height; y++) {
      const column = [];
      for (let x = 0; x < width; x++) {
        const tile = new Tile(x, y);
        column.push(tile);
      }
      this.tiles.push(column)
    }
  }

  getTile(x, y) {
    return this.tiles[y][x];
  }

  setSpecialTile(name, loc) {
    const tile = this.getTile(loc.x, loc.y);
    tile.bonus = name;
  }

  generateBases() {
    const h = {x: this.randomInRange(4, this.width - 4), y: 3};
    const c = {x: this.randomInRange(4, this.width - 4), y: this.height - 3};

    let base;
    let enemy;
    if (this.coinFlip()) {
      base = h;
      enemy = c;
    } else {
      base = c;
      enemy = h;
    }

    this.setSpecialTile('mound', base);
    this.setSpecialTile('enemy', enemy);
  }

  generateTreasures() {
    Treasure.getAll().forEach(treasure => {
      let tileFound = false;
      while (!tileFound) {
        const x = this.randomInRange(treasure.x.min, treasure.x.max);
        const y = this.randomInRange(treasure.y.min, treasure.y.max);

        if (!this.getTile(x, y).isBlocked()) {
          this.setSpecialTile(treasure.name, {x, y});
          tileFound = true;
        }
      }
    });
  }

  generateArtifacts() {
    for (let i = 0; i < 4; i++) {
      let tileFound = false;
      while (!tileFound) {
        const x = this.randomInRange(0, this.width - 1);
        const y = this.randomInRange(0, this.height - 1);
        if (!this.getTile(x, y).isBlocked()) {
          this.setSpecialTile('artifact'+i, {x, y});
          tileFound = true;
        }
      }
    }
  }
}

export default Map;