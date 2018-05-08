import CritterFactory from '../../src/lib/CritterFactory';
import Critter from '../../src/lib/Critter';

describe('CritterFactory', () => {
    const someId = 3;
    const someGeneration = 42;
    const someGender = Critter.GENDER_FEMALE;

    it('should return default Critter', () => {
        const critter = CritterFactory.default(someId, someGeneration, someGender);
        const defaultCritter = new Critter(someId, someGeneration, someGender);
        expect(critter).toEqual(defaultCritter);
    });
});