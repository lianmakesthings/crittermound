class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.bonus = null;
  }

  isBlocked() {
    return !!this.bonus;
  }
}

Tile.SPECIAL_BASE = 'base';
Tile.SPECIAL_ENEMY = 'enemy';
Tile.SPECIAL_MINE = 'mine';
Tile.SPECIAL_FARM = 'farm';
Tile.SPECIAL_CARRY = 'carry';
Tile.SPECIAL_FACTORY = 'factory';
Tile.SPECIAL_GENE = 'gene';
Tile.SPECIAL_BOOST = 'boost';
Tile.SPECIAL_FORT = 'fort';
Tile.SPECIAL_EXPLORE = 'explore';
Tile.SPECIAL_ARTIFACT = 'artifact';

export default Tile;