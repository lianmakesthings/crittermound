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

  clear() {
    var n,i,t,r;
    if(this.currentBattle!=null&&(n=this.GetTile(this.currentBattle),n.isUnlocked()))
    {
      if(n.isCleared(!0),n.isUnlocked(!1),this.tilesCleared(this.tilesCleared()+1),n.danger()>this.highestDanger&&(this.highestDanger=n.danger()),i=n.coords,t=this.GetTile(new Point(i.x,i.y-1)),t!=undefined&&t.isUnlocked(!0),t=this.GetTile(new Point(i.x,i.y+1)),t!=undefined&&t.isUnlocked(!0),t=this.GetTile(new Point(i.x-1,i.y)),t!=undefined&&t.isUnlocked(!0),t=this.GetTile(new Point(i.x+1,i.y)),t!=undefined&&t.isUnlocked(!0),this.canExplore(!0),n.coords.x==this.mound.x&&n.coords.y==this.mound.y)return n.extraClass("mound"),n.danger(0),null;
      if(this.mine!=undefined&&n.coords.x==this.mine.x&&n.coords.y==this.mine.y)return n.extraClass("mine"),n.danger(0),1;
      if(this.farm!=undefined&&n.coords.x==this.farm.x&&n.coords.y==this.farm.y)return n.extraClass("farm"),n.danger(0),2;
      if(this.carry!=undefined&&n.coords.x==this.carry.x&&n.coords.y==this.carry.y)return n.extraClass("carry"),n.danger(0),3;
      if(this.factory!=undefined&&n.coords.x==this.factory.x&&n.coords.y==this.factory.y)return n.extraClass("factory"),n.danger(0),4;
      if(this.fort!=undefined&&n.coords.x==this.fort.x&&n.coords.y==this.fort.y)return n.extraClass("fort"),n.danger(0),9;
      if(this.explore!=undefined&&n.coords.x==this.explore.x&&n.coords.y==this.explore.y)return n.extraClass("explore"),n.danger(0),8;
      if(this.gene!=undefined&&n.coords.x==this.gene.x&&n.coords.y==this.gene.y)return n.extraClass("gene"),n.danger(0),6;
      if(this.boost!=undefined&&n.coords.x==this.boost.x&&n.coords.y==this.boost.y)return n.extraClass("boost"),n.danger(0),7;
      if(this.enemy!=undefined&&n.coords.x==this.enemy.x&&n.coords.y==this.enemy.y)return n.extraClass("enemy"),n.danger(0),0;
      for(r=0;
          r<this.treasures.length;
          r++)if(this.treasures[r]!=undefined&&n.coords.x==this.treasures[r].x&&n.coords.y==this.treasures[r].y)return n.extraClass("treasure"),n.danger(0),5
    }
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
