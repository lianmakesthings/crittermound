import SodProduction from '../../src/lib/SodProduction';
import Trait from '../../src/lib/Trait';
import CritterFactory from '../../src/lib/CritterFactory';
import Critter from '../../src/lib/Critter';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const expect = chai.expect;

let sodProduction;
const type = 'mine';
describe('Sod production', () => {
    beforeEach(() => {
        const state = {
            worker: {
                mine: {
                    productionProp: 'dirtPerSecond',
                    critters: [],
                    size: 1
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
            expect(sodProduction.lowestWorker(type)).to.equal(lowCritter)
        });

        it("should return null if production has no workers", () => {
            expect(sodProduction.lowestWorker(type)).to.be.null;
        });
    });

    describe('checking whether critter can be added to production type', () => {
        it('should return true if critter is better than worst production critter', () => {
            const lowCritter = CritterFactory.default(1, 1, Critter.GENDER_MALE);
            const highCritter = CritterFactory.default(2, 1, Critter.GENDER_MALE);
            highCritter.traits[Trait.ID_STING].base = 15;
            const newCritter = CritterFactory.default(3, 1, Critter.GENDER_FEMALE);
            newCritter.traits[Trait.ID_STING].base = 10;
            sodProduction.state.worker[type].critters = [lowCritter, highCritter];
            expect(sodProduction.canAdd(newCritter, type)).to.be.true;
        });

        it('should return true if production has no critters', () => {
            const newCritter = CritterFactory.default(4, 1, Critter.GENDER_FEMALE);
            expect(sodProduction.canAdd(newCritter, type)).to.be.true;
        });

        it('should return true if mound has empty spaces', () => {
            const highCritter = CritterFactory.default(2, 1, Critter.GENDER_MALE);
            highCritter.traits[Trait.ID_STING].base = 15;
            sodProduction.state.worker[type].critters = [highCritter];
            sodProduction.state.worker[type].size = 2;
            const newCritter = CritterFactory.default(3, 1, Critter.GENDER_FEMALE);
            expect(sodProduction.canAdd(newCritter, type)).to.be.true;
        });

        it('should return false if mound is full and current critter is worse than worst worker', () => {
            const highCritter = CritterFactory.default(2, 1, Critter.GENDER_MALE);
            highCritter.traits[Trait.ID_STING].base = 15;
            sodProduction.state.worker[type].critters = [highCritter];
            const newCritter = CritterFactory.default(3, 1, Critter.GENDER_FEMALE);
            expect(sodProduction.canAdd(newCritter, type)).to.be.false;
        })
    });

});