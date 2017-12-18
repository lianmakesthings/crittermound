import { ticksPerSecond } from './Helpers';

class GameController {
  constructor(store) {
    this.store = store;
    this.timeBetweenTicks = 1000 / ticksPerSecond;
    this.lastTick = null;
  }

  breed(location) {
    const currentBoosts = this.store.getters.boosts(location);
    const totalBoosts = this.store.getters.maxBoosts(location);
    if (currentBoosts < totalBoosts) {
      const newBoost = Math.round((currentBoosts+.1)*10)/10;
      this.store.dispatch('setBoost', {location: location, value: newBoost})
    }
    
    this.store.dispatch('breedCritter', location);
  }

  tick() {
    const location = 'royalHatchery';
    const queen = this.store.getters.critters(location, 'mother')[0];
    const king = this.store.getters.critters(location, 'father')[0];

    if (queen.progress >= 100 && king.progress >= 100) {
      this.breed(location)
    } else {
      this.store.dispatch('healCritter', queen.id);
      this.store.dispatch('healCritter', king.id);
    }
  }

  checkTick(timestamp) {
    if (!this.lastTick) this.lastTick = timestamp;
    const timeSinceLastTick = timestamp - this.lastTick;
    if (timeSinceLastTick >= this.timeBetweenTicks) {
      this.lastTick = timestamp;
      this.tick();
    }
    window.requestAnimationFrame(this.checkTick.bind(this));
  }

  run() {
    window.requestAnimationFrame(this.checkTick.bind(this));
  }
}

export default GameController;
