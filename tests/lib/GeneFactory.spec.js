import GeneFactory from '../../src/lib/GeneFactory.js';
import Gene from '../../src/lib/Gene.js';
import genes from '../../src/lib/genes.json' with { type: 'json' }

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const expect = chai.expect;

describe('A gene factory', () => {
    const someGeneId = 3;
    it('should create gene from id', () => {
        const gene = GeneFactory.getGene(someGeneId);

        expect(gene instanceof Gene).to.be.true;
    });

    it('should create gene, excluding given genes', () => {
        const excludedGenes = genes.filter(g => g.id !== someGeneId).map(g => g.id);
        const gene = GeneFactory.getRandomGeneExcluding(excludedGenes);

        expect(gene.id).to.equal(someGeneId);
    })
});