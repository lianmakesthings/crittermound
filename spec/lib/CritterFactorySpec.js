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
    const randomInRange = RandomInRange.bind({});
    const geneFactory = GeneFactory;

    it('should return default Critter', () => {
        const critter = CritterFactory.default(someId, someGeneration, someGender);
        const defaultCritter = new Critter(someId, someGeneration, someGender);
        expect(critter).toEqual(defaultCritter);
    });

    describe('breeding a new critter', () => {
        let mother;
        let father;
        let state;

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
            };

            state = {newGeneChance: 1, unlockedGenes: []};
        });

        afterEach(() => {
            CritterFactory.GeneHelper = geneHelper;
            CritterFactory.RandomInRange = randomInRange;
            CritterFactory.GeneFactory = geneFactory;
        });

        it("should calculate a base value between the parent's values for each trait", () => {
            const critter = CritterFactory.breed(someId, mother, father, state);
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

            CritterFactory.breed(someId, mother, father, state);

            expect(CritterFactory.GeneHelper.calculateExpression).toHaveBeenCalledWith(someGene.expression, someGeneCopy.expression)
        });

        it("should calculate expression with 0 if second parent doesn't have the gene", () => {
            const someGene = GeneFactory.getGene(1);
            someGene.expression = Gene.EXPRESSION_DOMINANT;
            mother.traits[0].genes.push(someGene);

            CritterFactory.breed(someId, mother, father, state);

            expect(CritterFactory.GeneHelper.calculateExpression).toHaveBeenCalledWith(someGene.expression, 0)
        });

        it("should give the parent's genes to the child", () => {
            const someGene = GeneFactory.getGene(someId);
            mother.traits[someGene.traitId].genes.push(someGene);

            const someExpression = Gene.EXPRESSION_RECESSIVE;
            CritterFactory.GeneHelper.calculateExpression.and.returnValue(someExpression);
            const critter = CritterFactory.breed(someId, mother, father, state);

            expect(critter.mutations).toBe(1);
            expect(critter.traits[someGene.traitId].genes.length).toBe(1);
            expect(critter.traits[someGene.traitId].genes[0].id).toBe(someId);
        });

        it("should not give the parent's genes to the child if calculated expression is 0", () => {
            const someGene = GeneFactory.getGene(1);
            mother.traits[0].genes.push(someGene);

            CritterFactory.GeneHelper.calculateExpression.and.returnValue(Gene.EXPRESSION_NONE);
            const critter = CritterFactory.breed(someId, mother, father, state);

            expect(critter.mutations).toBe(0);
            expect(critter.traits[0].genes.length).toBe(0);
        });

        it('should give a value of 0 if expression is recessive', () => {
            const someGene = GeneFactory.getGene(1);
            mother.traits[0].genes.push(someGene);
            const expression = Gene.EXPRESSION_RECESSIVE;

            CritterFactory.GeneHelper.calculateExpression.and.returnValue(expression);
            const critter = CritterFactory.breed(someId, mother, father, state);

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
            const critter = CritterFactory.breed(someId, mother, father, state);

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
            const critter = CritterFactory.breed(someId, mother, father, state);

            expect(critter.traits[0].genes[0].value).toBe(maxValue);
        });

        it('should set new gene chance to 0 if new gene develops', () => {
            const oldGeneChance = state.newGeneChance;
            CritterFactory.RandomInRange = jasmine.createSpy('RandomInRange').and.returnValue(oldGeneChance);
            CritterFactory.breed(someId, mother, father, state);
            expect(state.newGeneChance).toBe(0);
        });

        it('should increase new gene chance threshold by 1 if no new gene develops', () => {
            const oldGeneChance = state.newGeneChance;
            CritterFactory.RandomInRange = jasmine.createSpy('RandomInRange').and.returnValue(state.newGeneChance+5);
            CritterFactory.breed(someId, mother, father, state);
            expect(state.newGeneChance).toBe(oldGeneChance + 1);
        });

        it('should get first gene which is unlocked but not developed', () => {
            CritterFactory.RandomInRange = jasmine.createSpy('RandomInRange').and.returnValue(state.newGeneChance);
            CritterFactory.GeneFactory.getGene = jasmine.createSpy('getGene').and.returnValue(GeneFactory.getGene(someId));
            state.unlockedGenes.push(someId);
            CritterFactory.breed(someId, mother, father, state);

            expect(CritterFactory.GeneFactory.getGene).toHaveBeenCalledWith(someId)
        });

        it('should get random gene if no genes are unlocked', () => {
            CritterFactory.RandomInRange = jasmine.createSpy('RandomInRange').and.returnValue(state.newGeneChance);
            CritterFactory.GeneFactory.getRandomGeneExcluding = jasmine.createSpy('getRandomGeneExcluding').and.returnValue(GeneFactory.getGene(someId));
            CritterFactory.breed(someId, mother, father, state);

            expect(CritterFactory.GeneFactory.getRandomGeneExcluding).toHaveBeenCalledWith(state.unlockedGenes)
        });

        it('should get random gene if child has all unlocked genes', () => {
            const someGene = GeneFactory.getGene(someId);
            state.unlockedGenes.push(someId);
            mother.traits[someGene.traitId].genes.push(someGene);
            CritterFactory.GeneHelper.calculateExpression = jasmine.createSpy('calculateExpression').and.returnValue(Gene.EXPRESSION_DOMINANT);
            CritterFactory.RandomInRange = jasmine.createSpy('RandomInRange').and.returnValue(state.newGeneChance);
            CritterFactory.GeneFactory.getRandomGeneExcluding = jasmine.createSpy('getRandomGeneExcluding').and.returnValue(someGene);
            CritterFactory.breed(someId, mother, father, state);

            expect(CritterFactory.GeneFactory.getRandomGeneExcluding).toHaveBeenCalledWith(state.unlockedGenes)
        });

        it("should add new gene to unlocked genes and child if base is above 25 and it should mutate", () => {
            const someGene = GeneFactory.getGene(someId);
            mother.traits[someGene.traitId].base = 50;
            father.traits[someGene.traitId].base = 50;
            CritterFactory.RandomInRange = jasmine.createSpy('RandomInRange').and.returnValue(state.newGeneChance);
            CritterFactory.GeneFactory.getRandomGeneExcluding = jasmine.createSpy('getRandomGeneExcluding').and.returnValue(someGene);
            CritterFactory.GeneHelper.shouldMutate = jasmine.createSpy('shouldMutate').and.returnValue(true);

            const critter = CritterFactory.breed(someId, mother, father, state);

            expect(state.unlockedGenes[0]).toBe(someId);
            expect(critter.traits[someGene.traitId].genes[0]).toBe(someGene);
            expect(someGene.expression).toBe(Gene.EXPRESSION_RECESSIVE);
            expect(someGene.value).toBe(0);
        })
    })
});