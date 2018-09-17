class SodProduction {
    static instance(state) {
        return new SodProduction(state)
    }
    constructor(state) {
        this.state = state;
    }

    getLowestProduction(type){
        const mound = this.state.worker[type];
        const lowestCritter = mound.critters.reduce((acc, critter) => {
            if (!acc) return critter;
            if (critter[mound.productionProp] < acc[mound.productionProp]) {
                acc = critter
            }
            return acc;
        }, null);

        if (lowestCritter) return lowestCritter[mound.productionProp];
        return null;
    }

    canAdd(critter, type) {
        const mound = this.state.worker[type];
        if (mound.critters.length < mound.size) {
            return true;
        }

        const lowestProduction = this.getLowestProduction(type);
        if (lowestProduction) {
            return critter[mound.productionProp] > lowestProduction
        }

    }

    allocateWorker(critter) {
        const productionTypes = [SodProduction.TYPE_MINE, SodProduction.TYPE_FARM, SodProduction.TYPE_CARRY, SodProduction.TYPE_FACTORY]

        const productions = productionTypes.map(type => {
            return {
                type: type,
                canAdd: this.canAdd(critter, type),
                lowestProduction: this.getLowestProduction(type)
            }
        });

        let destination = null;

        const productionsToAdd = productions.filter(prod => prod.canAdd);
        if (productionsToAdd.length > 0) {
            let production = productionsToAdd.reduce((acc, prod) => {
                if (prod.lowestProduction < acc.lowestProduction) {
                    acc = prod;
                }
                return acc;
            });
            destination = {location: 'worker', type: production.type};
        }

        return destination;
    }
}

SodProduction.TYPE_MINE = 'mine';
SodProduction.TYPE_FARM = 'farm';
SodProduction.TYPE_CARRY = 'carry';
SodProduction.TYPE_FACTORY = 'factory';

export default SodProduction;
