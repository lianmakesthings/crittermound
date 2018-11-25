import Tile from './Tile';

class Map {
  constructor(width, height) {
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
}

export default Map;