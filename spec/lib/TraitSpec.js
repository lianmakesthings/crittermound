import Trait from '../../src/lib/Trait';
import GeneFactory from '../../src/lib/GeneFactory';
import Gene from '../../src/lib/Gene'

describe('A trait', () => {
    const someId = Trait.ID_STING;
    const someValue = 5;

    let trait;
    beforeEach(() => {
        trait = new Trait(someId, someValue);
    });

    it('should have given values', () => {
        expect(trait.id).toBe(someId);
        expect(trait.name).toBe(Trait.NAMES[someId]);
        expect(trait.base).toBe(someValue);
        expect(trait.genes instanceof Array).toBe(true);
    });

    it('should calculate gene value from genes', () => {
        const someGene = GeneFactory.getGene(414);
        const someValue = 5;
        someGene.expression = Gene.EXPRESSION_DOMINANT;
        someGene.value = someValue;
        trait.genes.push(someGene);
        trait.genes.push(someGene);

        expect(trait.geneValue).toBe(someValue*2)
    });

    it('should not add gene value if expression is less than dominant', () => {
        const someGene = GeneFactory.getGene(414);
        someGene.expression = Gene.EXPRESSION_RECESSIVE;
        someGene.value = someValue;
        trait.genes.push(someGene);

        const otherGene = Object.assign({}, someGene);
        otherGene.expression = Gene.EXPRESSION_NONE;
        trait.genes.push(someGene);

        expect(trait.geneValue).toBe(0)
    });

    it('should have the same value for bonus and gene value', () => {
        const someGene = GeneFactory.getGene(414);
        someGene.expression = Gene.EXPRESSION_DOMINANT;
        someGene.value = someValue;
        trait.genes.push(someGene);

        expect(trait.bonus).toBe(trait.geneValue)
    });

    it('should calculate a value from base and gene value', () => {
        const someGene = GeneFactory.getGene(414);
        someGene.expression = Gene.EXPRESSION_RECESSIVE;
        someGene.value = someValue;
        trait.genes.push(someGene);

        expect(trait.value).toBe(5)
    });

    it('should calculate a true value from value and bonus', () => {
        const someGene = GeneFactory.getGene(414);
        someGene.expression = Gene.EXPRESSION_RECESSIVE;
        someGene.value = someValue;
        trait.genes.push(someGene);

        const trueValue = trait.getTrueValue(someValue);
        expect(trueValue).toBe(10)
    });

    it('should not take bonus for calculation for true value if trait is not bite or sting', () => {
        const someGene = GeneFactory.getGene(214);
        someGene.expression = Gene.EXPRESSION_RECESSIVE;
        someGene.value = someValue;
        trait.genes.push(someGene);
        trait.id = Trait.ID_AGILITY;

        const trueValue = trait.getTrueValue(someValue);
        expect(trueValue).toBe(5)
    })
});