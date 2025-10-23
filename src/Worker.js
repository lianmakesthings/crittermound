import Controller from './lib/Controller';
let state;
const controller = new Controller();
import CritterFactory from './lib/CritterFactory';

// Respond to message from parent thread
self.onmessage = (msg) => {
  state = msg.data;

  const mounds = [{
    location: 'royalHatchery',
    type: 'mother'
  }, {
    location: 'royalHatchery',
    type: 'father'
  }, {
    location: 'royalHatchery',
    type: 'female'
  }, {
    location: 'royalHatchery',
    type: 'male'
  }, {
    location: 'worker',
    type: 'mine'
  }, {
    location: 'worker',
    type: 'farm'
  }, {
    location: 'worker',
    type: 'carry'
  }, {
    location: 'worker',
    type: 'factory'
  }, {
    location: 'soldiers',
    type: 'army'
  }];
  mounds.forEach(address => {
    const critters = state[address.location][address.type].critters;
    state[address.location][address.type].critters = critters.map(critter => CritterFactory.fromState(critter))
  });

  const changes = controller.checkTick(new Date().getTime(), state);
  self.postMessage(changes);
};
