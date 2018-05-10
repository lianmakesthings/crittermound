import GeneHelper from '../../src/lib/GeneHelper';
import Gene from '../../src/lib/Gene';

describe('A Gene helper', () => {
    describe('calculating expressions', () => {
        it("should determine none if both parent's expressions are none", () => {
            const motherExpression = Gene.EXPRESSION_NONE;
            const fatherExpression = Gene.EXPRESSION_NONE;

            const childExpression = GeneHelper.calculateExpression(motherExpression, fatherExpression);
            expect(childExpression).toBe(Gene.EXPRESSION_NONE);
        });

        it("should determine dominant if both parent's expressions are dominant", () => {
            const motherExpression = Gene.EXPRESSION_DOMINANT;
            const fatherExpression = Gene.EXPRESSION_DOMINANT;

            const childExpression = GeneHelper.calculateExpression(motherExpression, fatherExpression);
            expect(childExpression).toBe(Gene.EXPRESSION_DOMINANT);
        });

        it("should determine dominant or recessive if one parent's expression is dominant and the other's is recessive", () => {
            const motherExpression = Gene.EXPRESSION_DOMINANT;
            const fatherExpression = Gene.EXPRESSION_RECESSIVE;

            const childExpression = GeneHelper.calculateExpression(motherExpression, fatherExpression);
            expect(childExpression).toBeGreaterThanOrEqual(Gene.EXPRESSION_RECESSIVE);
            expect(childExpression).toBeLessThanOrEqual(Gene.EXPRESSION_DOMINANT);
        });

        it("should determine recessive or none if one parent's expression is recessive and the other's is none", () => {
            const motherExpression = Gene.EXPRESSION_RECESSIVE;
            const fatherExpression = Gene.EXPRESSION_NONE;

            const childExpression = GeneHelper.calculateExpression(motherExpression, fatherExpression);
            expect(childExpression).toBeGreaterThanOrEqual(Gene.EXPRESSION_NONE);
            expect(childExpression).toBeLessThanOrEqual(Gene.EXPRESSION_RECESSIVE);
        });

        it("should determine recessive if one parent's expression is dominant and the other's is none", () => {
            const motherExpression = Gene.EXPRESSION_DOMINANT;
            const fatherExpression = Gene.EXPRESSION_NONE;

            const childExpression = GeneHelper.calculateExpression(motherExpression, fatherExpression);
            expect(childExpression).toBe(Gene.EXPRESSION_RECESSIVE);
        });

        it("should determine any expression if both parent's expressions are recessive", () => {
            const motherExpression = Gene.EXPRESSION_RECESSIVE;
            const fatherExpression = Gene.EXPRESSION_RECESSIVE;

            const childExpression = GeneHelper.calculateExpression(motherExpression, fatherExpression);
            expect(childExpression).toBeGreaterThanOrEqual(Gene.EXPRESSION_NONE);
            expect(childExpression).toBeLessThanOrEqual(Gene.EXPRESSION_DOMINANT);
        })
    })
});