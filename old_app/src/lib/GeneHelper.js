import {CoinFlip, RandomInRange, StatVariance} from "./Helpers";
import Gene from "./Gene";

class GeneHelper {
    static calculateExpression(bequeatherExpression, otherParentExpression = 0) {
        let expression;
        const sum = bequeatherExpression + otherParentExpression;

        if (2 === sum) {
            if (bequeatherExpression === otherParentExpression) {
                expression = CoinFlip()
                    ? Gene.EXPRESSION_RECESSIVE
                    : CoinFlip()
                        ? Gene.EXPRESSION_DOMINANT
                        : Gene.EXPRESSION_NONE;
            } else {
                expression = Gene.EXPRESSION_RECESSIVE;
            }
        } else if (3 === sum || 1 === sum) {
            expression = CoinFlip() ? bequeatherExpression : otherParentExpression;
        } else if (4 === sum) {
            expression = Gene.EXPRESSION_DOMINANT;
        } else {
            expression = Gene.EXPRESSION_NONE;
        }

        return expression
    }

    static shouldMutate(geneCount, geneValue) {
        if (geneCount >= 10) {
            return geneValue >= (geneCount-10)*100+450
        } else {
            return geneValue >= geneCount*(geneCount-1)*5
        }
    }

    static calculateValue(motherVal, fatherVal) {
        let lowerVal = Math.min(motherVal, fatherVal);
        let higherVal = Math.max(motherVal, fatherVal);
        lowerVal = lowerVal-StatVariance(lowerVal);
        higherVal = higherVal+StatVariance(higherVal);

        return RandomInRange(lowerVal, higherVal);
    }
}

export default GeneHelper;