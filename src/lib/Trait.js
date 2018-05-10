import {SmartRound} from './Helpers';
import Gene from './Gene';

class Trait {
  constructor(id, baseValue) {
    this.id = parseInt(id);
    this.name = Trait.NAMES[id];
    this.base = baseValue;
    this.genes = [];
  }

  get geneValue() {
    let totalGeneValue = this.genes.reduce((acc, gene) => {
      if (gene.expression === Gene.EXPRESSION_DOMINANT) {
        acc = acc + gene.value
      }
      return acc;
    }, 0);
    return Math.round(totalGeneValue);
  }

  get value() {
    let calculatedValue = this.base + this.base * (this.geneValue/100);

    return SmartRound(calculatedValue);
  }

  getTrueValue(bonus) {
    if (this.id === Trait.ID_BITE || this.id === Trait.ID_STING) {
      return SmartRound(this.value + bonus);
    }
    return this.value;
  }

  get bonus() {
    return this.geneValue;
  }
}
Trait.MAX_VALUE = 999999;
Trait.ID_VITALITY = 0;
Trait.ID_STRENGTH = 1;
Trait.ID_AGILITY = 2;
Trait.ID_BITE = 3;
Trait.ID_STING = 4;
Trait.NAMES = ['vitality', 'strength', 'agility', 'bite', 'sting'];

export default Trait;
