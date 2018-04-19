import CritterFactory from '../../src/lib/CritterFactory';
import Critter from '../../src/lib/Critter';

describe('CritterFactory', () => {
    const someId = 3;
    const someGeneration = 42;
    const someGender = Critter.GENDER_FEMALE;

    it('should return default Critter', () => {
        const critter = CritterFactory.default(someId, someGeneration, someGender);
        expect(critter instanceof Critter).toBe(true);
        expect(critter.id).toBe(someId);
        expect(critter.generation).toBe(someGeneration);
        expect(critter.gender).toBe(someGender);
        expect(critter.rank).toBe(Critter.RANK_RECRUIT);
        expect(critter.traits[0].base).toBe(5);
    })
});