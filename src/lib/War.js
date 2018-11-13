import Map from './Map';

class War {
  constructor(nation) {
    this.nation = nation;
    this.map = this.generateMap();
  }

  generateMap() {
    return new Map();
  }
}

export default War;