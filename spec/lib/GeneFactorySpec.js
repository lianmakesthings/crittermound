import GeneFactory from '../../src/lib/GeneFactory';
import Gene from '../../src/lib/Gene';
import genes from '../../src/lib/genes.json'

describe('A gene factory', () => {
    const someGeneId = 3;
    it('should create gene from id', () => {
        const gene = GeneFactory.getGene(someGeneId);

        expect(gene instanceof Gene).toBeTruthy();
    });

    it('should create gene, excluding given genes', () => {
        const excludedGenes = genes.filter(g => g.id !== someGeneId).map(g => g.id);
        const gene = GeneFactory.getRandomGeneExcluding(excludedGenes);

        expect(gene.id).toBe(someGeneId);
    })
});