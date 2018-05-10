import genes from '../../src/lib/genes.json';
import Gene from '../../src/lib/Gene';

describe('A gene', () => {
    const someGeneData = genes[0];
    it('should create a default gene from given specs', () => {
        const gene = new Gene(someGeneData);

        expect(gene.id).toBe(someGeneData.id);
        expect(gene.traitId).toBe(someGeneData.traitId);
        expect(gene.name).toBe(someGeneData.name);
        expect(gene.value).toBe(0);
        expect(gene.expression).toBe(Gene.EXPRESSION_NONE);
    })
});