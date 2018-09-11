import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
const sandbox = sinon.createSandbox();
chai.use(sinonChai);
const expect = chai.expect;

import Achievement from '../../src/lib/Achievement';
import Critter from "../../src/lib/Critter";
import CritterFactory from "../../src/lib/CritterFactory";
describe('Achievement', () => {
  describe('getting all achievements', () => {
    it('should return in one flattened array', () => {
      const achievements = Achievement.allAchievements();
      expect(achievements[0]).not.to.be.an('array');
      expect(achievements.length).to.equal(212)
    });

    it('should return with certain properties', () => {
      const achievements = Achievement.allAchievements();
      const randomIdx = Math.floor(Math.random() * 212);
      const achievement = achievements[randomIdx];

      expect(achievement.typeId).to.be.a('number');
      expect(achievement.typeId).to.be.within(0, 21);
      expect(achievement.level).to.be.a('number');
      expect(achievement.level).to.be.within(0, 12);
      expect(achievement.name).to.be.a('string');
      expect(achievement.description).to.be.a('string');
      expect(achievement.value).to.be.a('number');
    });
  });

  describe('checking achievements', () => {
    it('should add finished achievements to changes', () => {
      const critter = CritterFactory.default(1, 1, Critter.GENDER_FEMALE);
      sandbox.stub(critter.traits[0], 'value').value(10);

      const state = {
        achievements: [0],
        royalHatchery: {
          mother: {
            critters: [critter]
          },
          father: {
            critters: []
          },
          female: {
            critters: []
          },
          male: {
            critters: []
          }
        },
        worker: {
          mine: {
            critters: []
          },
          farm: {
            critters: []
          },
          carry: {
            critters: []
          },
          factory: {
            critters: []
          }
        }
      };
      const changes = {
        achievements: state.achievements
      };

      Achievement.check(state, changes);

      expect(changes.achievements[0]).to.equal(1)
    });
  })
});