import {CoinFlip, RandomInRange, StatVariance} from "./Helpers";
import Critter from "./Critter";
import Trait from "./Trait";
import GeneFactory from "./GeneFactory";
import GeneHelper from "./GeneHelper";
import Gene from './Gene';

class CritterFactory {
    static GeneHelper = GeneHelper;
    static GeneFactory = GeneFactory;
    static geneMax = 100;
    static newGeneChanceRange = 1e3;
    static RandomInRange = RandomInRange;

    static default(id, generation, gender) {
        return new Critter(id, generation, gender)
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
            const parentGeneData = {};

            parentGenes.forEach(gene => {
                if (parentGeneData.hasOwnProperty(gene.id)) {
                    parentGeneData[gene.id].push(gene)
                } else {
                    parentGeneData[gene.id] = [gene]
                }
            });

            // add gene to child trait for each geneId collected during traversing parents genes
            for (let geneId in parentGeneData) {
                if(parentGeneData.hasOwnProperty(geneId)) {
                    const motherGene = parentGeneData[geneId][0];
                    const fatherGene = parentGeneData[geneId][1];

                    let expression = CritterFactory.GeneHelper.calculateExpression(motherGene.expression, fatherGene ? fatherGene.expression : 0);
                    // only genes with expression over 0 will be added
                    if (expression > Gene.EXPRESSION_NONE) {
                        let newGene = GeneFactory.getGene(geneId);
                        // default value is 0
                        newGene.value = 0;
                        newGene.expression = expression;

                        // if both parents have the gene && expression is dominant, calculate value from parent value
                        if (fatherGene && expression === Gene.EXPRESSION_DOMINANT) {
                            newGene.value = Math.min(CritterFactory.GeneHelper.calculateValue(motherGene.value, fatherGene.value), CritterFactory.geneMax);
                        }

                        child.traits[newGene.traitId].genes.push(newGene);
                    }
                }
            }
        }

        // chance for new gene to randomly develop
        const randVal = CritterFactory.RandomInRange(1, CritterFactory.newGeneChanceRange);
        if (randVal <= state.newGeneChance) {
            state.newGeneChance = 0;
            const unlockedGenes = state.unlockedGenes;
            const developedGenes = child.traits.reduce((acc, trait) => {

                return acc.concat(trait.genes)
            }, []);

            let nextGeneId = unlockedGenes.find(geneId => !developedGenes.find(gene => gene.id === geneId));
            // discover new gene
            let newGene;
            if (nextGeneId) {
                newGene = CritterFactory.GeneFactory.getGene(nextGeneId);
            } else {
                newGene = CritterFactory.GeneFactory.getRandomGeneExcluding(unlockedGenes);
            }

            const base = child.traits[newGene.traitId].base;
            const geneValue = child.traits[newGene.traitId].geneValue;
            const geneCount = child.traits[newGene.traitId].genes.length+1;
            if (base > 25 && CritterFactory.GeneHelper.shouldMutate(geneCount, geneValue)) {
                newGene.expression = Gene.EXPRESSION_RECESSIVE;
                newGene.value = 0;
                child.traits[newGene.traitId].genes.push(newGene);
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

export default CritterFactory;