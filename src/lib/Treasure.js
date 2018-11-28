import War from "./War";

class Treasure {
  static getAll = () => {
    return [Treasure.MINE, Treasure.FARM, Treasure.CARRY, Treasure.FACTORY, Treasure.GENE, Treasure.BOOST, Treasure.FORT, Treasure.EXPLORE]
      .map(treasure => new Treasure(treasure.name));
  };

  constructor(name) {
    this.name = name;
    this.x = {
      min: Treasure[name.toUpperCase()].range.min,
      max: War.MAP_WIDTH - Treasure[name.toUpperCase()].range.max
    };
    this.y = {
      min: Treasure[name.toUpperCase()].range.min,
      max: War.MAP_HEIGHT - Treasure[name.toUpperCase()].range.max
    }
  }
}

Treasure.MINE = {
  name: 'mine',
  range: {min: 2, max: 3},
};

Treasure.FARM = {
  name: 'farm',
  range: {min: 2, max: 3},
};

Treasure.CARRY = {
  name: 'carry',
  range: {min: 2, max: 3},
};

Treasure.FACTORY = {
  name: 'factory',
  range: {min: 2, max: 3},
};

Treasure.GENE = {
  name: 'gene',
  range: {min: 0, max: 1},
};

Treasure.BOOST = {
  name: 'boost',
  range: {min: 1, max: 2},
};

Treasure.FORT = {
  name: 'fort',
  range: {min: 1, max: 2},
};

Treasure.EXPLORE = {
  name: 'explore',
  range: {min: 1, max: 2},
};

export default Treasure;