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

}

export default War;