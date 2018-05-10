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
    });

    describe('checking if mutation should occur', () => {
        it('should return true if count is less than 10 and value is sufficiently greater than count', () => {
            const someCount = 2;
            const someValue = 10;

            const mutationCheck = GeneHelper.shouldMutate(someCount, someValue);
            expect(mutationCheck).toBeTruthy();
        });

        it('should return false if count is less than 10 and value is not sufficiently greater than count', () => {
            const someCount = 2;
            const someValue = 5;

            const mutationCheck = GeneHelper.shouldMutate(someCount, someValue);
            expect(mutationCheck).toBeFalsy();
        });

        it('should return true if count is more than 10 and value is sufficiently greater than count', () => {
            const someCount = 10;
            const someValue = 450;

            const mutationCheck = GeneHelper.shouldMutate(someCount, someValue);
            expect(mutationCheck).toBeTruthy();
        });

        it('should return false if count is more than 10 and value is not sufficiently greater than count', () => {
            const someCount = 10;
            const someValue = 100;

            const mutationCheck = GeneHelper.mutationCheck(someCount, someValue);
            expect(mutationCheck).toBeFalsy();
        })
    })

});