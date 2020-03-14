class Nation {
  static allNations() {
    return [
      this.CRICKETS,
      this.ANTS,
      this.GRASSHOPPERS,
      this.GNATS,
      this.CHIGGERS,
      this.LADYBUGS,
      this.BEES,
      this.WASPS,
      this.SCORPIONS,
      this.BEETLES,
      this.HORSEFLIES,
      this.TERMITES,
      this.TICKS,
      this.MOSQUITOES,
      this.LEECHES,
      this.CENTIPEDES,
      this.MANTIS,
      this.TARANTULAS
    ];
  };

  static get(id) {
    return Object.assign({}, this.allNations().find(nation => nation.id == id))
  }
}
Nation.CUSTOM_BALANCED = 'Balanced';
Nation.CUSTOM_HIGH_NUMBERS = 'High Numbers';
Nation.CUSTOM_HIGH_STING = 'High Sting';
Nation.CUSTOM_HIGH_BITE = 'High Bite';
Nation.CUSTOM_HIGH_HEALTH = 'High Health';
Nation.CUSTOM_SOLO_FIGHTERS = 'Solo Fighters';

Nation.CRICKETS = {
  id: 0,
  name: 'Crickets',
  custom: Nation.CUSTOM_BALANCED,
  minBaseVal: 5,
  maxBaseVal: 50,
  armySizeBase: 1,
  requiredToUnlock: null,
  treasurePoints: 1
};
Nation.ANTS = {
  id: 1,
  name: 'Ants',
  custom: Nation.CUSTOM_BALANCED,
  minBaseVal: 1e3,
  maxBaseVal: 2e3,
  armySizeBase: 4,
  requiredToUnlock: Nation.CRICKETS.id,
  treasurePoints: 2
};
Nation.GRASSHOPPERS = {
  id: 2,
  name: 'Grasshoppers',
  custom: Nation.CUSTOM_BALANCED,
  minBaseVal: 15e3,
  maxBaseVal: 25e3,
  armySizeBase: 7,
  requiredToUnlock: Nation.ANTS.id,
  treasurePoints: 3
};
Nation.GNATS = {
  id: 3,
  name: 'Gnats',
  custom: Nation.CUSTOM_HIGH_NUMBERS,
  minBaseVal: 50,
  maxBaseVal: 100,
  armySizeBase: 1,
  requiredToUnlock: Nation.CRICKETS.id,
  treasurePoints: 1
};
Nation.CHIGGERS = {
  id: 4,
  name: 'Chiggers',
  custom: Nation.CUSTOM_HIGH_NUMBERS,
  minBaseVal: 2e3,
  maxBaseVal: 3e3,
  armySizeBase: 4,
  requiredToUnlock: Nation.GNATS.id,
  treasurePoints: 2
};
Nation.LADYBUGS = {
  id: 5,
  name: 'Ladybugs',
  custom: Nation.CUSTOM_HIGH_NUMBERS,
  minBaseVal: 25e3,
  maxBaseVal: 5e4,
  armySizeBase: 7,
  requiredToUnlock: Nation.CHIGGERS.id,
  treasurePoints: 3
};
Nation.BEES = {
  id: 6,
  name: 'Bees',
  custom: Nation.CUSTOM_HIGH_STING,
  minBaseVal: 100,
  maxBaseVal: 200,
  armySizeBase: 2,
  requiredToUnlock: Nation.GNATS.id,
  treasurePoints: 1
};
Nation.WASPS = {
  id: 7,
  name: 'Wasps',
  custom: Nation.CUSTOM_HIGH_STING,
  minBaseVal: 3e3,
  maxBaseVal: 5e3,
  armySizeBase: 5,
  requiredToUnlock: Nation.BEES.id,
  treasurePoints: 2
};
Nation.SCORPIONS = {
  id: 8,
  name: 'Scorpions',
  custom: Nation.CUSTOM_HIGH_STING,
  minBaseVal: 5e4,
  maxBaseVal: 75e3,
  armySizeBase: 8,
  requiredToUnlock: Nation.WASPS.id,
  treasurePoints: 3
};
Nation.BEETLES = {
  id: 9,
  name: 'Beetles',
  custom: Nation.CUSTOM_HIGH_BITE,
  minBaseVal: 200,
  maxBaseVal: 300,
  armySizeBase: 2,
  requiredToUnlock: Nation.BEES.id,
  treasurePoints: 1
};
Nation.HORSEFLIES = {
  id: 10,
  name: 'Horseflies',
  custom: Nation.CUSTOM_HIGH_BITE,
  minBaseVal: 5e3,
  maxBaseVal: 7500,
  armySizeBase: 5,
  requiredToUnlock: Nation.BEETLES.id,
  treasurePoints: 2
};
Nation.TERMITES = {
  id: 11,
  name: 'Termites',
  custom: Nation.CUSTOM_HIGH_BITE,
  minBaseVal: 75e3,
  maxBaseVal: 1e5,
  armySizeBase: 8,
  requiredToUnlock: Nation.HORSEFLIES.id,
  treasurePoints: 3
};
Nation.TICKS = {
  id: 12,
  name: 'Ticks',
  custom: Nation.CUSTOM_HIGH_HEALTH,
  minBaseVal: 300,
  maxBaseVal: 500,
  armySizeBase: 3,
  requiredToUnlock: Nation.BEETLES.id,
  treasurePoints: 1
};
Nation.MOSQUITOES = {
  id: 13,
  name: 'Mosquitoes',
  custom: Nation.CUSTOM_HIGH_HEALTH,
  minBaseVal: 7500,
  maxBaseVal: 1e4,
  armySizeBase: 6,
  requiredToUnlock: Nation.TICKS.id,
  treasurePoints: 2
};
Nation.LEECHES = {
  id: 14,
  name: 'Leeches',
  custom: Nation.CUSTOM_HIGH_HEALTH,
  minBaseVal: 1e5,
  maxBaseVal: 125e3,
  armySizeBase: 9,
  requiredToUnlock: Nation.MOSQUITOES.id,
  treasurePoints: 3
};
Nation.CENTIPEDES = {
  id: 15,
  name: 'Centipedes',
  custom: Nation.CUSTOM_SOLO_FIGHTERS,
  minBaseVal: 500,
  maxBaseVal: 1e3,
  armySizeBase: 3,
  requiredToUnlock: Nation.TICKS.id,
  treasurePoints: 1
};
Nation.MANTIS = {
  id: 16,
  name: 'Praying Mantis',
  custom: Nation.CUSTOM_SOLO_FIGHTERS,
  minBaseVal: 1e4,
  maxBaseVal: 15e3,
  armySizeBase: 6,
  requiredToUnlock: Nation.CENTIPEDES.id,
  treasurePoints: 2
};
Nation.TARANTULAS = {
  id: 17,
  name: 'Tarantulas',
  custom: Nation.CUSTOM_SOLO_FIGHTERS,
  minBaseVal: 125e3,
  maxBaseVal: 15e4,
  armySizeBase: 9,
  requiredToUnlock: Nation.MANTIS.id,
  treasurePoints: 3
};

export default Nation;
