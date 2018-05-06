import Trait from '../../src/lib/Trait';

describe('A trait', () => {
    const someId = Trait.ID_STING;
    const someValue = 5;

    let trait;
    beforeEach(() => {
        trait = new Trait(someId, someValue);
    });

    it('should have given values', () => {
        expect(trait.id).toBe(someId);
        expect(trait.name).toBe(Trait.NAMES[someId]);
        expect(trait.base).toBe(someValue);
        expect(trait.genes instanceof Array).toBe(true);
    });
});