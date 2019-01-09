import Map from './Map';
import {RandomInRange, CoinFlip} from "./Helpers";
import Treasure from "./Treasure";

class War {
  static MAP_WIDTH = 20;
  static MAP_HEIGHT = 20;
  
  constructor(nation) {
    this.nation = nation;
    this.randomInRange = RandomInRange;
    this.coinFlip = CoinFlip;
    this.blockedLocations = [];

    this.map = this.generateMap();
    this.generateSpecialTiles();
  }

  generateMap() {
    return new Map(War.MAP_WIDTH, War.MAP_HEIGHT);
  }

  generateSpecialTiles() {
    this.map.generateBases();
    this.map.generateTreasures();
    this.map.generateArtifacts();
  }
}

War.TREASURE_MINE = {
  name: 'mine',
  x: {min: 2, max: War.MAP_WIDTH - 3},
  y: {min: 2, max: War.TREASURE_MINE - 3},
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

War.allTreasures = [War.TREASURE_MINE, War.TREASURE_FARM, War.TREASURE_CARRY, War.TREASURE_FACTORY, War.TREASURE_GENE, War.TREASURE_BOOST, War.TREASURE_FORT, War.TREASURE_EXPLORE];

export default War;