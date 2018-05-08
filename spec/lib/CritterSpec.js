import Critter from '../../src/lib/Critter';
import Trait from '../../src/lib/Trait';
import GeneFactory from '../../src/lib/GeneFactory';

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
    })
});
