class Trait {
  constructor(id, value) {
    this.id = id;
    this.name = Trait.NAMES[id];
    this.bonus = 0;
    this.base = value;
    this.genes = [];
  }

  get value() {
    return this.base;
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
