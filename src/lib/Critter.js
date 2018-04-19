import { ticksPerSecond, SmartRound } from './Helpers';
import Trait from './Trait';

class Critter {
  constructor(id, generation, gender) {
    this.id = id;
    this.generation = generation;
    this.gender = gender;
    this.rank = Critter.RANK_RECRUIT;
    this.traits = [];
    this.traits.push(new Trait(Trait.ID_VITALITY, 5));
    this.traits.push(new Trait(Trait.ID_STRENGTH, 5));
    this.traits.push(new Trait(Trait.ID_AGILITY, 5));
    this.traits.push(new Trait(Trait.ID_BITE, 5));
    this.traits.push(new Trait(Trait.ID_STING, 5));
    this.currentHealth = 0;
  }

  get score() {
    let score = this.traits.reduce((acc, trait) => {
      return acc * trait.value
    }, 1);
    return SmartRound(Math.pow(score, .2));
  }

  get maxHealth() {
    return SmartRound(this.traits[Trait.ID_VITALITY].value*15);
  }

  get progress() {
    let progress = Math.round(this.currentHealth / this.maxHealth * 1e4)/100;
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;
    return progress;
  }

  get actionTime() {
    let actionTime = 30 * Math.pow(.9, Math.log(this.traits[Trait.ID_AGILITY].value) / Math.LN2) * ticksPerSecond;
    return Math.max(actionTime, ticksPerSecond*3);
  }

  get actionTimeSeconds() {
    return Math.round(this.actionTime/ticksPerSecond*100)/100;
  }

  get strengthBonus() {
    return SmartRound(this.traits[Trait.ID_STRENGTH].value/2);
  }

  get agilityBonus() {
    return SmartRound(this.traits[Trait.ID_AGILITY].value/2);
  }

  get dirtPerSecond() {
    return SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[Trait.ID_STING].value/60);
  }

  get grassPerSecond() {
    return SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[Trait.ID_BITE].value/60);
  }

  get carryPerSecond() {
    return SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[Trait.ID_STRENGTH].value/60);
  }

  get sodPerSecond() {
    return SmartRound(60/(this.actionTime/ticksPerSecond)*this.traits[Trait.ID_VITALITY].value/60);
  }

  get baseScore() {
    if (!this.rawBaseValue) {
      this.rawBaseValue = this.traits.reduce((acc, trait) => acc * trait.base, 1);
    }
    return SmartRound(Math.pow(this.rawBaseValue,.2));
  }

  get bonusScore() {
    if(!this.rawGeneValue) {
      this.rawGeneValue = this.traits.reduce((acc, trait) => acc * trait.geneValue, 1);
    }
    return SmartRound(Math.pow(this.rawGeneValue,.2));
  }

  get mutations() {
    return this.traits.reduce((acc, trait) => acc + trait.genes.length, 0);
  }
}

Critter.GENDER_FEMALE = 'female';
Critter.GENDER_MALE = 'male';

Critter.RANK_RECRUIT = 0;
Critter.RANK_ROYAL = 1;
Critter.RANK_WORKER = 2;
Critter.RANK_ARMY = 3;

export default Critter;
