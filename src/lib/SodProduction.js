class SodProduction {
  constructor(state) {
    this.state = state;
  }

  lowestWorker(type){
    const mound = this.state.worker[type];
    return mound.critters.reduce((acc, critter) => {
        if (!acc) return critter;
        if (critter[mound.productionProp] < acc[mound.productionProp]) {
            acc = critter
        }
        return acc;
    }, null);
  }

  allocateWorker(critter) {
    const worstMiner = this.lowestWorker('mine');
    const worstFarmer = this.lowestWorker('farm');
    const worstCarrier = this.lowestWorker('carry');
    const worstFactoryWorker = this.lowestWorker('factory');
    const lowestProduction = Math.min(worstMiner, worstFarmer, worstCarrier, worstFactoryWorker);
    const productions = [
      {
        type: 'mine',
        canAdd: critter.dirtPerSecond > worstMiner || this.state.worker.mine.critters.length < this.state.worker.mine.size,
        lowestProduction: lowestProduction === worstMiner,
        production: this.state.worker.mine.productionPerSecondRaw
      }, {
        type: 'farm',
        canAdd: critter.grassPerSecond > worstFarmer || this.state.worker.farm.critters.length < this.state.worker.farm.size,
        lowestProduction: lowestProduction === worstFarmer,
        production: this.state.worker.farm.productionPerSecondRaw
      }, {
        type: 'carry',
        canAdd: critter.carryPerSecond > worstCarrier || this.state.worker.carry.critters.length < this.state.worker.carry.size,
        lowestProduction: lowestProduction === worstCarrier,
        production: this.state.worker.carry.productionPerSecondRaw
      }, {
        type: 'factory',
        canAdd: critter.sodPerSecond > worstFactoryWorker || this.state.worker.factory.critters.length < this.state.worker.factory.size,
        lowestProduction: lowestProduction === worstFactoryWorker,
        production: this.state.worker.factory.productionPerSecondRaw
      }
    ];

    let destination = null;

    const productionsToAdd = productions.filter(prod => prod.canAdd);
    if (productionsToAdd.length > 0) {
      let production = productionsToAdd.find(prod => prod.lowestProduction);
      if (!production) {
        production = productionsToAdd[0]
      }
      destination = {location: 'worker', type: production.type};
    }

    return destination;
  }
}

export default SodProduction;
