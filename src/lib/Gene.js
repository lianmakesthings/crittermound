class Gene {
    constructor(data) {
        this.id = data.id;
        this.traitId = data.traitId;
        this.name = data.name;
        this.value = 0;
        this.expression = Gene.EXPRESSION_NONE;
    }
}
Gene.EXPRESSION_DOMINANT = 2;
Gene.EXPRESSION_RECESSIVE = 1;
Gene.EXPRESSION_NONE = 0;

export default Gene;