import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

const Achievement = require('../../src/lib/Achievement');
describe('Achievement', () => {
  it('should return all achievements in one flattened array', () => {
    const achievements = Achievement.default.allAchievements();
    expect(achievements[0]).not.to.be.an('array');
    expect(achievements.length).to.equal(212)
  });

  it('should return achievement with certain properties', () => {
    const achievements = Achievement.default.allAchievements();
    const randomIdx = Math.floor(Math.random() * 212);
    const achievement = achievements[randomIdx];

    expect(achievement.typeId).to.be.a('number');
    expect(achievement.typeId).to.be.within(0, 21);
    expect(achievement.level).to.be.a('number');
    expect(achievement.level).to.be.within(0, 12);
    expect(achievement.name).to.be.a('string');
    expect(achievement.description).to.be.a('string');
    expect(achievement.value).to.be.a('number');
  })
});