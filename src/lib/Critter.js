import { ticksPerSecond, SmartRound, CoinFlip, StatVariance, RandomInRange } from './Helpers';
import Trait from './Trait';

class Critter {
  static GENDER_FEMALE = 'female';
  static GENDER_MALE = 'male';

  static RANK_RECRUIT = 0;
  static RANK_ROYAL = 1;

  constructor(id, generation, gender) {
    this.id = id;
    this.generation = generation;
    this.gender = gender;
    this.rank = this.RANK_RECRUIT;
    this.traits = [];
    this.traits.push(new Trait('vitality', 5));
    this.traits.push(new Trait('strength', 5));
    this.traits.push(new Trait('agility', 5));
    this.traits.push(new Trait('bite', 5));
    this.traits.push(new Trait('sting', 5));
    this.currentHealth = 0;
  }

  get score() {
    let score = this.traits.reduce((acc, cur) => {
      return acc * cur.value
    }, 1);
    return SmartRound(Math.pow(score, .2));
  }

  get maxHealth() {
    return this.traits[0].value*15;
  }

  get progress() {
    let progress = Math.round(this.currentHealth / this.maxHealth * 1e4)/100;
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;
    return progress;
  }

  get actionTime() {
    let actionTime = 30 * Math.pow(.9, Math.log(this.traits[2].value) / Math.LN2) * ticksPerSecond;
    return Math.max(actionTime, ticksPerSecond*3);
  }

  get dirtPerSecond() {
    return SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[4].value/60);
  }

  get grassPerSecond() {
    return SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[3].value/60);
  }

  get carryPerSecond() {
    return SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[1].value/60);
  }

  get sodPerSecond() {
    return SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[0].value/60);
  }
}

class CritterFactory {
  static default(id, generation, gender) {
    return new Critter(id, generation, gender)
  }

  static breed(id, mother, father) {
    const generation = Math.max(mother.generation, father.generation) + 1;
    const gender = CoinFlip() ? Critter.GENDER_FEMALE : Critter.GENDER_MALE;
    const child = new Critter(id, generation, gender);

    for (let i = 0; i < mother.traits.length; i++) {
      const motherTrait = mother.traits[i];
      const fatherTrait = father.traits[i];

      // calc base value for trait
      let minTraitVal = Math.min(motherTrait.base, fatherTrait.base);
      minTraitVal = minTraitVal - StatVariance(minTraitVal);
      let maxTraitVal = Math.max(motherTrait.base, fatherTrait.base);
      maxTraitVal = maxTraitVal + StatVariance(maxTraitVal);
      child.traits[i].base = RandomInRange(minTraitVal, Math.min(maxTraitVal, Trait.MAX_VALUE));
    }
    return child
  }

  static fromState(state) {
    const critter = new Critter(state.id, state.generation, state.gender);
    critter.rank = state.rank;
    critter.traits = state.traits.map(trait => new Trait(trait.name, trait.base));
    critter.currentHealth = state.currentHealth || 0 ;
    return critter;
  }
}
export {
  Critter,
  CritterFactory
};
