import Trait from '../lib/Trait';

class Sorter {
  static callback(name) {
    return this.sorts.find(sort => sort.name == name).cb
  }

  static getAllNames() {
    return this.sorts.map(s => s.name)
  }
}
Sorter.sorts = [
  {
    name: "score",
    cb: (a, b) => {
      return b.score - a.score;
    }
  },
  {
    name: "base",
    cb: (a, b) => {
      return b.baseScore - a.baseScore;
    }
  },
  {
    name: "bonus",
    cb: (a, b) => {
      return b.bonusScore - a.bonusScore;
    }
  },
  {
    name: "vitality",
    cb: (a, b) => {
      return b.traits[Trait.ID_VITALITY].value - a.traits[Trait.ID_VITALITY].value;
    }
  },
  {
    name: "strength",
    cb: (a, b) => {
      return b.traits[Trait.ID_STRENGTH].value - a.traits[Trait.ID_STRENGTH].value;
    }
  },
  {
    name: "agility",
    cb: (a, b) => {
      return b.traits[Trait.ID_AGILITY].value - a.traits[Trait.ID_AGILITY].value;
    }
  },
  {
    name: "bite",
    cb: (a, b) => {
      return b.traits[Trait.ID_BITE].value - a.traits[Trait.ID_BITE].value;
    }
  },
  {
    name: "sting",
    cb: (a, b) => {
      return b.traits[Trait.ID_STING].value - a.traits[Trait.ID_STING].value;
    }
  },
  {
    name: "mutations",
    cb: (a, b) => {
      const aMutations = a.traits.reduce((acc, trait) =>  acc + trait.genes.length, 0);
      const bMutations = b.traits.reduce((acc, trait) =>  acc + trait.genes.length, 0);
      return bMutations - aMutations;
    }
  },
  {
    name: "mine",
    cb: (a, b) => {
      return b.dirtPerSecond - a.dirtPerSecond;
    }
  },
  {
    name: "farm",
    cb: (a, b) => {
      return b.grassPerSecond - a.grassPerSecond;
    }
  },
  {
    name: "carry",
    cb: (a, b) => {
      return b.carryPerSecond - a.carryPerSecond;
    }
  },
  {
    name: "factory",
    cb: (a, b) => {
      return b.sodPerSecond - a.sodPerSecond;
    }
  }
]

export default Sorter;
