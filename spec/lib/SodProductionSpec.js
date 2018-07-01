import SodProduction from '../../src/lib/SodProduction';
import Trait from '../../src/lib/Trait';
import CritterFactory from '../../src/lib/CritterFactory';
import Critter from '../../src/lib/Critter';

let sodProduction;
const type = 'mine';
describe('Sod production', () => {
    beforeEach(() => {
        const state = {
            worker: {
                mine: {
                    productionProp: 'dirtPerSecond',
                    critters: []
                }
            }
        };
        sodProduction = new SodProduction(state);
    });

    describe('getting the worker with lowest production', () => {
        it('should return Critter', () => {
            const lowCritter = CritterFactory.default(1, 1, Critter.GENDER_MALE);
            const highCritter = CritterFactory.default(2, 1, Critter.GENDER_FEMALE);
            highCritter.traits[Trait.ID_STING].base = 10;
            sodProduction.state.worker[type].critters = [lowCritter, highCritter];
            expect(sodProduction.lowestWorker(type)).toBe(lowCritter)
        });

        it("should return null if production has no workers", () => {
            expect(sodProduction.lowestWorker(type)).toBeNull()
        });
    });

});