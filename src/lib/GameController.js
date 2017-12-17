import { ticksPerSecond } from './Helpers';

class GameController {
  constructor(store) {
    this.store = store;
    this.timeBetweenTicks = 1000 / ticksPerSecond;
    this.lastTick = null;
  }

  breed(location) {
    this.store.dispatch('breedCritter', location);
  }

  tick() {
    const queen = this.store.getters.critters('royalHatchery', 'mother');
    const king = this.store.getters.critters('royalHatchery', 'father');

    if (queen.progress >= 100 && king.progress >= 100) {
      this.breed('royalHatchery')
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
