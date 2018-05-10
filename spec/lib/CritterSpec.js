import Critter from '../../src/lib/Critter';
import Trait from '../../src/lib/Trait';
import GeneFactory from '../../src/lib/GeneFactory';
import Gene from '../../src/lib/Gene';

describe('A Critter', () => {
    const someId = 2;
    const someGeneration = 42;
    const someGender = Critter.GENDER_FEMALE;

    let critter;
    beforeEach(() => {
        critter = new Critter(someId, someGeneration, someGender);
    });

    it('should have the given specs', () => {
        expect(critter.id).toBe(someId);
        expect(critter.generation).toBe(someGeneration);
        expect(critter.gender).toBe(someGender);
    });

    it('should have the default specs', () => {
        expect(critter.rank).toBe(Critter.RANK_RECRUIT);
        expect(critter.currentHealth).toBe(0);
        expect(critter.traits instanceof Array).toBe(true);
        expect(critter.traits.length).toBe(5);
    });

    it('should have default value (5) for all traits', () => {
        let index = 0;
        [
            Trait.ID_VITALITY,
            Trait.ID_STRENGTH,
            Trait.ID_AGILITY,
            Trait.ID_BITE,
            Trait.ID_STING
        ].forEach(traitId => {
            const trait = critter.traits[index];
            expect(trait instanceof Trait).toBe(true);
            expect(trait.id).toBe(traitId);
            expect(trait.base).toBe(5);
            index++;
        })
    });

    it('should calculate number of mutations', () => {
        const someGene = GeneFactory.getGene(1);
        critter.traits[0].genes.push(someGene);
        critter.traits[3].genes.push(someGene);

        expect(critter.mutations).toBe(2)
    });

    it('should calculate score from all trait values', () => {
        expect(critter.score).toBe(5)
    });

    it('should calculate base score from raw base value', () => {
        const someValue = 3;
        critter.rawBaseValue = Math.pow(someValue, 5);
        expect(critter.baseScore).toBe(someValue);
    });

    it('should calculate raw base value from trait base scores', () => {
        expect(critter.baseScore).toBe(5);
        expect(critter.rawBaseValue).toBe(Math.pow(5, 5));
    });

    it('should calculate bonus score from raw gene value', () => {
        const someValue = 3;
        critter.rawGeneValue = Math.pow(someValue, 5);
        expect(critter.bonusScore).toBe(someValue);
    });

    it('should calculate raw gene value from trait gene values', () => {
        const someValue = 3;
        const someGene = GeneFactory.getGene(1);
        someGene.expression = Gene.EXPRESSION_DOMINANT;
        someGene.value = someValue;
        for (let i = 0; i < 5; i++) {
            critter.traits[i].genes.push(someGene);
        }

        expect(critter.bonusScore).toBe(someValue);
        expect(critter.rawGeneValue).toBe(Math.pow(someValue, 5))
    });

    it('should calculate max health from vitality value', () => {
        const someValue = 5;
        critter.traits[Trait.ID_VITALITY].base = someValue;

        expect(critter.maxHealth).toBe(someValue * 15)

    });

    it('should calculate the current action progress', () => {
        const someValue = 10;
        critter.traits[Trait.ID_VITALITY].base = someValue;
        critter.currentHealth = someValue * 1.5;

        expect(critter.progress).toBe(someValue);
    });

    it('should calculate action time from agility', () => {
        critter.traits[Trait.ID_AGILITY].base = 1;

        expect(critter.actionTime).toBe(600);
    });

    it('should calculate action time in seconds', () => {
        critter.traits[Trait.ID_AGILITY].base = 1;

        expect(critter.actionTimeSeconds).toBe(30);
    });

    it('should calculate strength bonus from trait', () => {
        const someValue = 10;
        critter.traits[Trait.ID_STRENGTH].base = someValue;

        expect(critter.strengthBonus).toBe(someValue/2)
    });

    it('should calculate agility bonus from trait', () => {
        const someValue = 10;
        critter.traits[Trait.ID_AGILITY].base = someValue;

        expect(critter.agilityBonus).toBe(someValue/2)
    });

    it('should calculate dirt per second with sting', () => {
        critter.traits[Trait.ID_STING].base = 24;

        expect(critter.dirtPerSecond).toBe(1)
    });

    it('should calculate grass per second with bite', () => {
        critter.traits[Trait.ID_BITE].base = 24;

        expect(critter.grassPerSecond).toBe(1)
    });

    it('should calculate carry per second with strength', () => {
        critter.traits[Trait.ID_STRENGTH].base = 24;

        expect(critter.carryPerSecond).toBe(1)
    });

    it('should calculate sod per second with vitality', () => {
        critter.traits[Trait.ID_VITALITY].base = 24;

        expect(critter.sodPerSecond).toBe(1)
    });
});
