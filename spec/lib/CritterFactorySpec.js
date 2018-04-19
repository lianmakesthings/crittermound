import CritterFactory from '../../src/lib/CritterFactory';
import {Critter} from '../../src/lib/Critter';

describe('CritterFactory', () => {
    const someId = 3;
    const someGeneration = 42;

    it('should return default Critter', () => {
        const critter = CritterFactory.default(someId, someGeneration, Critter.GENDER_FEMALE);
        expect(critter instanceof Critter).toBe(true);
    })
});