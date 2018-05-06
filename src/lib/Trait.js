import {SmartRound} from './Helpers';
class Trait {
  constructor(id, baseValue) {
    this.id = parseInt(id);
    this.name = Trait.NAMES[id];
    this.base = baseValue;
    this.genes = [];
  }

  get geneValue() {
    let totalGeneValue = this.genes.reduce((acc, gene) => {
      if (gene.expression === Trait.GENE_EXPRESSION_DOMINANT) {
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
Trait.GENE_EXPRESSION_DOMINANT = 2;
Trait.GENE_EXPRESSION_RECESSIVE = 1;
Trait.GENE_EXPRESSION_NONE = 0;

export default Trait;
