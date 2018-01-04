import {RandomInRange, CoinFlip} from './Helpers'

class Map {
  constructor(width, height) {
    this.tiles = [];
    for (let y = 0; y < height; y++) {
      const tiles = [];
      for (let x = 0; x < width; x++) {
        const tile = {x: x, y: y};
        tiles.push(tile);
      }
      this.tiles.push(tiles)
    }
  }

  getTile(x, y) {
    let tile;
    this.tiles.find(row => {
      tile = row.find(t => {
        return t.x == x && t.y == y
      });
      return !!tile;
    });
    return tile;
  }

  setSpecialTile(name, loc) {
    const tile = this.getTile(loc.x, loc.y);
    tile.bonus = name;
  }
}

class War {
  static distance(a, b) {
    const i = a.x - b.x;
    const r = a.y - b.y;
    return Math.floor(Math.sqrt(i*i+r*r))
  }
  static isTileBlocked(loc, blockedLocations, boundary) {
    return !!blockedLocations.find(blocked => {
      return (loc.x == blocked.x && loc.y == blocked.y) || (this.distance(loc, blocked) < boundary)
    });
  }
  static generateMap(nation) {
    const width = 20;
    const height = 20;

    const map = new Map(width, height);
    const h = {x: RandomInRange(4, width - 4), y: 3};
    const c = {x: RandomInRange(4, width - 4), y: height - 3};
    let mound;
    let enemy;
    if (CoinFlip()) {
      mound = h;
      enemy = c;
    } else {
      mound = c;
      enemy = h;
    }
    map.setSpecialTile('mound', mound);
    map.setSpecialTile('enemy', enemy);

    const blockedLocations = [];
    blockedLocations.push(mound);
    blockedLocations.push(enemy);

    const treasures = [
      {
      name: 'mine',
      x: {min: 2, max: width - 3},
      y: {min: 2, max: height - 3},
      boundary: 5
    },
      {
      name: 'farm',
      x: {min: 2, max: width - 3},
      y: {min: 2, max: height - 3},
      boundary: 5
    },
      {
      name: 'carry',
      x: {min: 2, max: width - 3},
      y: {min: 2, max: height - 3},
      boundary: 5
    },
      {
      name: 'factory',
        x: {min: 2, max: width - 3},
        y: {min: 2, max: height - 3},
        boundary: 5
    },
      {
        name: 'gene',
        x: {min: 0, max: width - 1},
        y: {min: 0, max: height - 1},
        boundary: 5
      },
      {
        name: 'boost',
        x: {min: 1, max: width - 2},
        y: {min: 1, max: height - 2},
        boundary: 5
      },
      {
        name: 'fort',
        x: {min: 1, max: width - 2},
        y: {min: 1, max: height - 2},
        boundary: 5
      },
      {
        name: 'explore',
        x: {min: 1, max: width - 2},
        y: {min: 1, max: height - 2},
        boundary: 5
      }
      ];

    treasures.forEach(bonus => {
      if (!nation[bonus.name+'Found']) {
        let set = false;
        while(!set) {
          const loc = {
            x: RandomInRange(bonus.x.min, bonus.x.max),
            y: RandomInRange(bonus.y.min, bonus.y.max)
          };
          if (!this.isTileBlocked(loc, blockedLocations, bonus.boundary)) {
            blockedLocations.push(loc);
            map.setSpecialTile(bonus.name, loc);
            set = true;
          }
        }
      }
    });

    for (let x = 0; x < 4; x++) {
      let set = false;
      while(!set) {
        const loc = {
          x: RandomInRange(0, width - 1),
          y: RandomInRange(0, height - 1)
        };
        if (!this.isTileBlocked(loc, blockedLocations, 4)) {
          blockedLocations.push(loc);
          map.setSpecialTile('artifact', loc);
          set = true;
        }
      }
    }

    map.currentTile = map.getTile(mound.x, mound.y);
    map.currentTile.unlocked = true;
    map.currentTile.danger = 0;

    return map;
  }

}

export default War;
