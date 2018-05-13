import CritterFactory from '../../src/lib/CritterFactory';
import Critter from '../../src/lib/Critter';
import { StatVariance } from "../../src/lib/Helpers";
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

        it("should give the parent's genes to the child", () => {
            const someGeneId = 1;
            const someOtherGeneId = 101;
            const someGene = GeneFactory.getGene(someGeneId);
            someGene.expression = Gene.EXPRESSION_RECESSIVE;
            const someOtherGene = GeneFactory.getGene(someOtherGeneId);
            someOtherGene.expression = Gene.EXPRESSION_RECESSIVE;

            mother.traits[0].genes.push(someGene);
            mother.traits[1].genes.push(someOtherGene);
            father.traits[0].genes.push(someGene);

            const critter = CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(critter.mutations).toBe(2);
            expect(critter.traits[0].genes.length).toBe(1);
            expect(critter.traits[0].genes[0].id).toBe(someGeneId);
            expect(critter.traits[1].genes.length).toBe(1);
            expect(critter.traits[1].genes[0].id).toBe(someOtherGeneId);
        });

        it('should not give genes to the child if expression is none', () => {
            const someGene = GeneFactory.getGene(1);
            mother.traits[0].genes.push(someGene);

            const critter = CritterFactory.breed(someId, mother, father, {newGeneChance: 1});

            expect(critter.mutations).toBe(0);
        })
    })
});