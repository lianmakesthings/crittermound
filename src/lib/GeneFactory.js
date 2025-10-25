import genes from './genes.json' with { type: 'json' };
import Gene from './Gene.js';
import {Shuffle} from './Helpers.js';

class GeneFactory {
  static getGene(id) {
    id = parseInt(id);
    return new Gene(genes.find(gene => gene.id === id));
  }

  static getRandomGeneExcluding(excludeIds) {
    let availableGenes = genes.filter(availableGene => {
      return excludeIds.indexOf(availableGene.id) === -1;
    });
    availableGenes = Shuffle(availableGenes);
    return availableGenes[0]
  }
}

export default GeneFactory;
