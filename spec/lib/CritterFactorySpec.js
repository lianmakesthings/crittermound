import Critter from '../../src/lib/Critter';
import { RandomInRange, StatVariance } from "../../src/lib/Helpers";
import CritterFactory from '../../src/lib/CritterFactory';
import GeneFactory from "../../src/lib/GeneFactory";
import Gene from '../../src/lib/Gene';
import GeneHelper from "../../src/lib/GeneHelper";

describe('CritterFactory', () => {
    const someId = 3;
    const someGeneration = 42;
    const someGender = Critter.GENDER_FEMALE;
    const geneHelper = Object.assign({}, GeneHelper);

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
                mother.traits[i].base = RandomInRange(0, 20);
                father.traits[i].base = RandomInRange(0, 20);
            }

            CritterFactory.GeneHelper = {
                calculateExpression: jasmine.createSpy('calculateExpression'),
                calculateValue: jasmine.createSpy('calculateValue')
            }
        });

        afterEach(() => {
            CritterFactory.GeneHelper = geneHelper
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

            CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(CritterFactory.GeneHelper.calculateExpression).toHaveBeenCalledWith(someGene.expression, someGeneCopy.expression)
        });

        it("should calculate expression with 0 if second parent doesn't have the gene", () => {
            const someGene = GeneFactory.getGene(1);
            someGene.expression = Gene.EXPRESSION_DOMINANT;
            mother.traits[0].genes.push(someGene);

            CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(CritterFactory.GeneHelper.calculateExpression).toHaveBeenCalledWith(someGene.expression, 0)
        });

        it("should give the parent's genes to the child", () => {
            const someGeneId = 1;
            const someGene = GeneFactory.getGene(someGeneId);
            mother.traits[0].genes.push(someGene);

            const someExpression = Gene.EXPRESSION_RECESSIVE;
            CritterFactory.GeneHelper.calculateExpression.and.returnValue(someExpression);
            const critter = CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(critter.mutations).toBe(1);
            expect(critter.traits[0].genes.length).toBe(1);
            expect(critter.traits[0].genes[0].id).toBe(someGeneId);
        });

        it("should not give the parent's genes to the child if calculated expression is 0", () => {
            const someGene = GeneFactory.getGene(1);
            mother.traits[0].genes.push(someGene);

            CritterFactory.GeneHelper.calculateExpression.and.returnValue(Gene.EXPRESSION_NONE);
            const critter = CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(critter.mutations).toBe(0);
            expect(critter.traits[0].genes.length).toBe(0);
        });

        it('should give a value of 0 if expression is recessive', () => {
            const someGene = GeneFactory.getGene(1);
            mother.traits[0].genes.push(someGene);
            const expression = Gene.EXPRESSION_RECESSIVE;

            CritterFactory.GeneHelper.calculateExpression.and.returnValue(expression);
            const critter = CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(critter.traits[0].genes[0].expression).toBe(expression);
            expect(critter.traits[0].genes[0].value).toBe(0);
        });

        it("should calculate a value from parent's values if expression if both parents have the gene and expression is dominant", () => {
            const someGene = GeneFactory.getGene(1);
            mother.traits[0].genes.push(someGene);
            father.traits[0].genes.push(someGene);
            const expression = Gene.EXPRESSION_DOMINANT;
            const someValue = 10;

            CritterFactory.GeneHelper.calculateExpression.and.returnValue(expression);
            CritterFactory.GeneHelper.calculateValue.and.returnValue(someValue);
            const critter = CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(critter.traits[0].genes[0].expression).toBe(expression);
            expect(critter.traits[0].genes[0].value).toBe(someValue);
        });

        it('should give gene the maximum value if calculated value is greater', () => {
            const someGene = GeneFactory.getGene(1);
            mother.traits[0].genes.push(someGene);
            father.traits[0].genes.push(someGene);

            const maxValue = 50;
            const calculatedValue = maxValue + 20;

            CritterFactory.GeneHelper.calculateExpression.and.returnValue(Gene.EXPRESSION_DOMINANT);
            CritterFactory.GeneHelper.calculateValue.and.returnValue(calculatedValue);
            CritterFactory.geneMax = maxValue;
            const critter = CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(critter.traits[0].genes[0].value).toBe(maxValue);
        })
    })
});