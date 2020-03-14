<template>
  <div id="achievements">
    <div v-for="achievement in allAchievements">
      <b-alert show :variant="achievement.unlocked ? 'info' : 'light'">
        <strong>{{ achievement.name }}</strong>
        <span>{{ achievement.description }}</span>
      </b-alert>
    </div>
  </div>
</template>

<script>
  import Achievement from '../lib/Achievement'

  export default {
    computed: {
      allAchievements() {
        const allAchievements = Achievement.allAchievements();
        const unlockedAchievements = this.$store.getters.unlockedAchievements;

        return allAchievements.map(achievement => {
          const currLevel = unlockedAchievements[achievement.typeId];
          achievement.unlocked = currLevel > achievement.level;
          return achievement;
        })
      }
    }
  }
</script>

<style>

</style>
