import Critter from '../../src/lib/Critter';
import { StatVariance } from "../../src/lib/Helpers";
import CritterFactory from '../../src/lib/CritterFactory';
import GeneFactory from "../../src/lib/GeneFactory";
import Gene from '../../src/lib/Gene';

describe('CritterFactory', () => {
    const someId = 3;
    const someGeneration = 42;
    const someGender = Critter.GENDER_FEMALE;

    it('should return default Critter', () => {
        const critter = CritterFactory.default(someId, someGeneration, someGender);
        const defaultCritter = new Critter(someId, someGeneration, someGender);
        expect(critter).toEqual(defaultCritter);
    });

    describe('breeding a new critter', () => {
        let mother;
        let father;

        beforeEach(() => {
            mother = CritterFactory.default(someId, someGeneration, someGender);
            father = CritterFactory.default(someId, someGeneration, someGender);

            for (let i = 0; i++; i < mother.traits.length) {
                mother.traits[i].base = Math.floor(Math.random() * 20);
                father.traits[i].base = Math.floor(Math.random() * 20);
            }
        });

        afterEach(() => {
            CritterFactory.GeneHelper = GeneFactory
        });

        it("should calculate a base value between the parent's values for each trait", () => {
            const critter = CritterFactory.breed(someId, mother, father, {newGeneChance: 1});
            critter.traits.forEach((trait, index) => {
                const motherVal = mother.traits[index].base;
                const fatherVal = father.traits[index].base;
                const minVal = Math.min(motherVal, fatherVal);
                const maxVal = Math.max(motherVal, fatherVal);

                expect(trait.base).toBeGreaterThanOrEqual(minVal - StatVariance(minVal));
                expect(trait.base).toBeLessThanOrEqual(maxVal + StatVariance(maxVal));
            });
        });

        it("should calculate expression from parent's expressions", () => {
            const someGeneId = 1;
            const someGene = GeneFactory.getGene(someGeneId);
            const someGeneCopy = GeneFactory.getGene(someGeneId);
            someGeneCopy.expression = Gene.EXPRESSION_DOMINANT;
            mother.traits[0].genes.push(someGene);
            father.traits[0].genes.push(someGeneCopy);

            CritterFactory.GeneHelper.calculateExpression = jasmine.createSpy('calculateExpression');
            CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(CritterFactory.GeneHelper.calculateExpression).toHaveBeenCalledWith(someGene.expression, someGeneCopy.expression)
        });

        it("should calculate expression with 0 if second parent doesn't have the gene", () => {
            const someGeneId = 1;
            const someGene = GeneFactory.getGene(someGeneId);
            someGene.expression = Gene.EXPRESSION_DOMINANT;
            mother.traits[0].genes.push(someGene);

            CritterFactory.GeneHelper.calculateExpression = jasmine.createSpy('calculateExpression');
            CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(CritterFactory.GeneHelper.calculateExpression).toHaveBeenCalledWith(someGene.expression, 0)
        });

        it("should give the parent's genes to the child if expression is at least recessive", () => {
            const someGeneId = 1;
            const someGene = GeneFactory.getGene(someGeneId);

            mother.traits[0].genes.push(someGene);

            CritterFactory.GeneHelper.calculateExpression = jasmine.createSpy('calculateExpression').and.returnValue(Gene.EXPRESSION_RECESSIVE);
            const critter = CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(critter.mutations).toBeGreaterThanOrEqual(1);
            expect(critter.traits[0].genes.length).toBe(1);
            expect(critter.traits[0].genes[0].id).toBe(someGeneId);
        });


    })
});