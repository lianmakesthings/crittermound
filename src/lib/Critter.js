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
      const motherVal = mother.traits[i].base;
      const fatherVal = father.traits[i].base;

      var min = motherVal < fatherVal ? motherVal - StatVariance(motherVal) : fatherVal - StatVariance(fatherVal);
      var max = motherVal > fatherVal ? motherVal + StatVariance(motherVal) : fatherVal + StatVariance(fatherVal);
      var traitValue = RandomInRange(min,max);
      traitValue = Math.max(traitValue, min);
      traitValue = Math.min(traitValue, Trait.MAX_VALUE);
      child.traits[i].base = traitValue;
    }
    return child
  }
}
export {
  Critter,
  CritterFactory
};
