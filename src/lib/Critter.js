import { ticksPerSecond, SmartRound } from './Helpers';

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
    this.traits = [
      {
        name: 'vitality',
        value: 5
      },
      {
        name: 'strength',
        value: 5
      },
      {
        name: 'agility',
        value: 5
      },
      {
        name: 'bite',
        value: 5
      },
      {
        name: 'sting',
        value: 5
      }
    ];
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
}
export {
  Critter,
  CritterFactory
};
