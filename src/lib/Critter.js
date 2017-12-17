import { SmartRound } from './Helpers';

class Critter {
  static GENDER_FEMALE = 0;
  static GENDER_MALE = 1;

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
    ]
  }

  get score() {
    let score = this.traits.reduce((acc, cur) => {
      return acc * cur.value
    }, 1);
    return SmartRound(Math.pow(score, .2));
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
