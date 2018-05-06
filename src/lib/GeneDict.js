import genes from './genes.json';
import {Shuffle} from './Helpers';

class GeneDict {
  static getGene(id) {
    return Object.assign({}, genes.find(gene => gene.id === id));
  }

  static getRandomGeneExcluding(excludeIds) {
    let availableGenes = genes.filter(availableGene => {
      return excludeIds.indexOf(availableGene.id) === -1;
    });
    availableGenes = Shuffle(availableGenes);
    return availableGenes[0]
  }
}

export default GeneDict;
