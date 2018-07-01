import SodProduction from '../../src/lib/SodProduction';
import Trait from '../../src/lib/Trait';
import CritterFactory from '../../src/lib/CritterFactory';
import Critter from '../../src/lib/Critter';

let sodProduction;
describe('Sod production', () => {
    beforeEach(() => {
        sodProduction = new SodProduction({});
    });

    describe('getting the worker with lowest production', () => {
        it('should return Critter', () => {
            const type = 'mine';
            const lowCritter = CritterFactory.default(1, 1, Critter.GENDER_MALE);
            const highCritter = CritterFactory.default(2, 1, Critter.GENDER_FEMALE);
            highCritter.traits[Trait.ID_STING].base = 10;
            sodProduction.state = {
                worker: {
                    mine: {
                        productionProp: 'dirtPerSecond',
                        critters: [lowCritter, highCritter]
                    }
                }
            };
            expect(sodProduction.lowestWorker(type)).toBe(lowCritter)
        });

        it("should return null if production has no workers", () => {
            const type = 'mine';
            sodProduction.state = {
                worker: {
                    mine: {
                        productionProp: 'dirtPerSecond',
                        critters: []
                    }
                }
            };
            expect(sodProduction.lowestWorker(type)).toBeNull()
        });
    })
    
});