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

export default War;
