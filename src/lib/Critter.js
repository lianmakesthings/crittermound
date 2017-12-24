import { ticksPerSecond, SmartRound, CoinFlip, StatVariance, RandomInRange, Shuffle } from './Helpers';
import Trait from './Trait';
import GeneDict from './GeneDict';

class Critter {
  static GENDER_FEMALE = 'female';
  static GENDER_MALE = 'male';

  static RANK_RECRUIT = 0;
  static RANK_ROYAL = 1;
  static RANK_WORKER = 2;
  static RANK_ARMY = 3;

  constructor(id, generation, gender) {
    this.id = id;
    this.generation = generation;
    this.gender = gender;
    this.rank = this.RANK_RECRUIT;
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

class CritterFactory {
  static default(id, generation, gender) {
    return new Critter(id, generation, gender)
  }

  static calculateExpression(x, y = 0) {
    let expression;
    const sum = x + y;

    if (2 == sum) {
      if (x == y) {
        expression = CoinFlip()
          ? Trait.GENE_EXPRESSION_RECESSIVE
          : CoinFlip()
            ? Trait.GENE_EXPRESSION_DOMINANT
            : Trait.GENE_EXPRESSION_NONE;
      } else {
        expression = Trait.GENE_EXPRESSION_RECESSIVE;
      }
    } else if (3 == sum || 1 == sum) {
      expression = CoinFlip() ? x : y;
    } else if (4 == sum) {
      expression = x
    } else {
      expression = Trait.GENE_EXPRESSION_NONE;
    }

    return expression
  }

  static mutationCheck(geneCount, bonus) {
    if (geneCount >= 10) {
      return bonus >= (geneCount-10)*100+450
    } else {
      return bonus >= geneCount*(geneCount-1)*5
    }
  }

  static mutateStat(motherVal, fatherVal) {
    let lowerVal = Math.min(motherVal, fatherVal);
    let higherVal = Math.max(motherVal, fatherVal);
    lowerVal = lowerVal-StatVariance(lowerVal);
    higherVal = higherVal+StatVariance(higherVal);

    return RandomInRange(lowerVal, higherVal);
  }

  static breed(id, mother, father, state) {
    const generation = Math.max(mother.generation, father.generation) + 1;
    const gender = CoinFlip() ? Critter.GENDER_FEMALE : Critter.GENDER_MALE;
    const child = new Critter(id, generation, gender);

    // iterate through traits, calculate base values & mutations for child
    for (let i = 0; i < mother.traits.length; i++) {
      const motherTrait = mother.traits[i];
      const fatherTrait = father.traits[i];

      // calc base value for trait
      let minTraitVal = Math.min(motherTrait.base, fatherTrait.base);
      minTraitVal = minTraitVal - StatVariance(minTraitVal);
      let maxTraitVal = Math.max(motherTrait.base, fatherTrait.base);
      maxTraitVal = maxTraitVal + StatVariance(maxTraitVal);
      child.traits[i].base = RandomInRange(minTraitVal, Math.min(maxTraitVal, Trait.MAX_VALUE));

      // handle for gene mutation:
      const parentGenes = motherTrait.genes.concat(fatherTrait.genes);

      // parentGeneData = {
      //   geneId: [{expression: motherExpression, value: motherValue}, {...}]}
      //   otherGeneId: [{expression: motherExpression, value: motherValue}]
      // }
      const parentGeneData = {};
      parentGenes.forEach(gene => {
        const geneData = {
          gene: gene.expression,
          value: gene.value
        };
        if (parentGeneData.hasOwnProperty(gene.id)) {
          parentGeneData[gene.id].push(geneData)
        } else {
          parentGeneData[gene.id] = [geneData]
        }
      });

      // add gene to child trait for each geneId collected during traversing parents genes
      const geneMax = 100;
      for (let geneId in parentGeneData) {
        if(parentGeneData.hasOwnProperty(geneId)) {
          const motherGeneData = parentGeneData[geneId][0];
          let fatherExpression = 0;
          if (parentGeneData[geneId][1]) fatherExpression = parentGeneData[geneId][1].expression;

          let expression = this.calculateExpression(motherGeneData.expression, fatherExpression);
          // only genes with expression over 1 will be added
          if (expression > Trait.GENE_EXPRESSION_NONE) {
            let newGene = GeneDict.getGene(geneId);
            // default value is 0
            newGene.value = 0;
            newGene.expression = expression;
            if (parentGeneData[geneId].length > 1) {
              const fatherGeneData = parentGeneData[geneId][1];
              // if both parents have the gene && expression is dominant, calculate value from parent value
              if (expression == Trait.GENE_EXPRESSION_DOMINANT) {
                newGene.value = Math.max(this.mutateStat(motherGeneData, fatherGeneData), geneMax);
              }
            }

            child.traits[newGene.traitId].genes.push(newGene);
          }
        }
      }
    }

    // chance for new gene to randomly develop
    const newGeneChanceRange = 1e3;
    const randVal = RandomInRange(1, newGeneChanceRange);
    if (randVal <= state.newGeneChance) {
      state.newGeneChance = 0;
      const unlockedGenes = state.unlockedGenes;
      const developedGenes = child.traits.reduce((acc, trait) => {
        return acc.concat(trait.genes)
      }, []);

      let nextGeneId = unlockedGenes.find(geneId => !developedGenes.find(gene => gene.id == geneId));
      // discover new gene
      let newGene;
      if (nextGeneId) {
        newGene = GeneDict.getGene(nextGeneId);
      } else {
        newGene = GeneDict.getRandomGeneExcluding(unlockedGenes);
      }

      var base = child.traits[newGene.traitId].base;
      var bonus = child.traits[newGene.traitId].bonus;
      var geneCount = child.traits[newGene.traitId].genes.length+1;
      if (base>25 && this.mutationCheck(geneCount,bonus)) {
        newGene.expression = 1;
        newGene.value = 0;
        child.traits[newGene.traitId].genes.push(u);
        state.unlockedGenes.push(newGene.id);
      }
    } else {
      state.newGeneChance = state.newGeneChance + 1;
    }
    return child
  }

  static fromState(critterState) {
    const critter = new Critter(critterState.id, critterState.generation, critterState.gender);
    critter.rank = critterState.rank;
    critter.traits = critterState.traits.map(trait => new Trait(trait.name, trait.base));
    critter.currentHealth = critterState.currentHealth || 0;
    return critter;
  }
}
export {
  Critter,
  CritterFactory
};
