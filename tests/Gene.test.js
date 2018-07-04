import genes from '../src/lib/genes.json';
import Gene from "../src/lib/Gene";
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const expect = chai.expect;

describe('A gene', () => {
    const someGeneData = genes[0];
    it('should create a default gene from given specs', () => {
        const gene = new Gene(someGeneData);

        expect(gene.id).to.equal(someGeneData.id);
        expect(gene.traitId).to.equal(someGeneData.traitId);
        expect(gene.name).to.equal(someGeneData.name);
        expect(gene.value).to.equal(0);
        expect(gene.expression).to.equal(Gene.EXPRESSION_NONE);
    })
});