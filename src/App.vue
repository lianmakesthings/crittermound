<template>
  <div id="app" class="container">
    <div class="totalSod">Sod {{ totalSod }}</div>
    <royal-hatchery></royal-hatchery>
    <worker></worker>
  </div>
</template>

<script>
  import RoyalHatchery from './components/RoyalHatchery.vue'
  import Worker from './components/Worker.vue'
  import { SmartRound } from './lib/Helpers'

  export default {
    name: 'app',
    components: {
      'royal-hatchery': RoyalHatchery,
      'worker': Worker
    },
    computed: {
      totalSod() {
        return SmartRound(this.$store.getters.totalSod)
      }
    }
  }
</script>

<style scoped>
.totalSod {
  float: right;
  font-size: 20px;
  font-weight: bold;
}
</style>
