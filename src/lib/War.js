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
  }

  generateMap() {
    return new Map();
  }
}

export default War;