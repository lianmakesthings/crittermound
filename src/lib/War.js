import Map from './Map';
import {RandomInRange, CoinFlip} from "./Helpers";
import Treasure from "./Treasure";

class War {
  static MAP_WIDTH = 20;
  static MAP_HEIGHT = 20;
  constructor(nation) {
    this.nation = nation;

    this.map = this.generateMap();
    this.generateArtifacts();
  }

  generateMap() {
    return new Map(War.MAP_WIDTH, War.MAP_HEIGHT);
  }
}

export default War;