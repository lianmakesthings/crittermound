import Map from './Map';
import {RandomInRange, CoinFlip} from "./Helpers";

class War {
  static MAP_WIDTH = 20;
  static MAP_HEIGHT = 20;
  constructor(nation) {
    this.nation = nation;
    this.randomInRange = RandomInRange;
    this.coinFlip = CoinFlip;

    this.map = this.generateMap();
    this.generateBases();
    this.generateTreasures();
    this.generateArtifacts();
  }

  generateMap() {
    return new Map(War.MAP_WIDTH, War.MAP_HEIGHT);
  }

  generateBases() {
    const h = {x: this.randomInRange(4, War.MAP_WIDTH - 4), y: 3};
    const c = {x: this.randomInRange(4, War.MAP_WIDTH - 4), y: War.MAP_HEIGHT - 3};

    let base;
    let enemy;
    if (this.coinFlip()) {
      base = h;
      enemy = c;
    } else {
      base = c;
      enemy = h;
    }

    this.map.setSpecialTile('mound', base);
    this.map.setSpecialTile('enemy', enemy);
  }

  static getAllTreasures() {
    return [War.TREASURE_MINE, War.TREASURE_FARM, War.TREASURE_CARRY, War.TREASURE_FACTORY, War.TREASURE_GENE, War.TREASURE_BOOST, War.TREASURE_FORT, War.TREASURE_EXPLORE]
      .map(treasure => Object.assign({}, treasure));
  }

  generateTreasures() {
    War.getAllTreasures().forEach(treasure => {
      let tileFound = false;
      while (!tileFound) {
        const x = this.randomInRange(treasure.x.min, treasure.x.max);
        const y = this.randomInRange(treasure.y.min, treasure.y.max);

        if (!this.map.getTile(x, y).isBlocked()) {
          this.map.setSpecialTile(treasure.name, {x, y});
          tileFound = true;
        }
      }
    });
  }

  generateArtifacts() {
    for (let i = 0; i < 4; i++) {
      let tileFound = false;
      while (!tileFound) {
        const x = this.randomInRange(0, War.MAP_WIDTH - 1);
        const y = this.randomInRange(0, War.MAP_HEIGHT - 1);

        if (!this.map.getTile(x, y).isBlocked()) {
          this.map.setSpecialTile('artifact'+i, {x, y});
          tileFound = true;
        }
      }
    }
  }
}

War.TREASURE_MINE = {
  name: 'mine',
  x: {min: 2, max: War.MAP_WIDTH - 3},
  y: {min: 2, max: War.MAP_HEIGHT - 3},
};

War.TREASURE_FARM = {
  name: 'farm',
  x: {min: 2, max: War.MAP_WIDTH - 3},
  y: {min: 2, max: War.MAP_HEIGHT - 3},
};

War.TREASURE_CARRY = {
  name: 'carry',
  x: {min: 2, max: War.MAP_WIDTH - 3},
  y: {min: 2, max: War.MAP_HEIGHT - 3},
};

War.TREASURE_FACTORY = {
  name: 'factory',
  x: {min: 2, max: War.MAP_WIDTH - 3},
  y: {min: 2, max: War.MAP_HEIGHT - 3},
};

War.TREASURE_GENE = {
  name: 'gene',
  x: {min: 0, max: War.MAP_WIDTH - 1},
  y: {min: 0, max: War.MAP_HEIGHT - 1},
};

War.TREASURE_BOOST = {
  name: 'boost',
  x: {min: 1, max: War.MAP_WIDTH - 2},
  y: {min: 1, max: War.MAP_HEIGHT - 2},
};

War.TREASURE_FORT = {
  name: 'fort',
  x: {min: 1, max: War.MAP_WIDTH - 2},
  y: {min: 1, max: War.MAP_HEIGHT - 2},
};

War.TREASURE_EXPLORE = {
  name: 'explore',
  x: {min: 1, max: War.MAP_WIDTH - 2},
  y: {min: 1, max: War.MAP_HEIGHT - 2},
};

export default War;