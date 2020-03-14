<template>
  <div id="app" class="container">
    <h1>Critter Mound v2.0</h1>
    <div class="appHeader">
        <div class="totalSod">Sod {{ totalSod }}</div>
        <b-button v-on:click="save">Save</b-button>
        <div v-show="stateSaved" class="alert alert-info">State saved</div>
    </div>
    <b-tabs>
      <b-tab :title="'Royal Hatchery '+royalHatchery.current+' / '+royalHatchery.max" active>
        <royal-hatchery></royal-hatchery>
      </b-tab>
      <b-tab :title="'Worker '+worker.current+' / '+worker.max">
        <worker></worker>
      </b-tab>
      <b-tab :title="'Soldiers '+army.current+' / '+army.max">
        <soldiers></soldiers>
      </b-tab>
      <b-tab :title="'Achievements '+achievement.current+' / '+achievement.max">
        <achievement></achievement>
      </b-tab>
      <b-tab title="How To Play">
        <how-to></how-to>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
  import RoyalHatchery from './components/RoyalHatchery.vue'
  import Worker from './components/Worker.vue'
  import Soldiers from './components/Soldiers.vue';
  import Achievement from './components/Achievement.vue';
  import HowTo from './components/HowTo.vue'
  import { SmartRound } from './lib/Helpers'


  export default {
    name: 'app',
    components: {
      'royal-hatchery': RoyalHatchery,
      'worker': Worker,
      'soldiers': Soldiers,
      'achievement': Achievement,
      'how-to': HowTo
    },
    computed: {
      royalHatchery() {
        return this.$store.getters.royalHatcheryAlloc
      },
      worker() {
        return this.$store.getters.workerAlloc
      },
      army() {
        return this.$store.getters.armyAlloc
      },
      achievement() {
        return this.$store.getters.achievementQuota
      },
      totalSod() {
        return SmartRound(this.$store.getters.totalSod)
      },
      stateSaved() {
        return this.$store.getters.showStateSaved
      }
    },
    methods: {
      save: function() {
        this.$store.dispatch('saveToStorage')
      }
    }
  }
</script>

<style scoped>
  .appHeader {
    float: right;
  }
  .totalSod {
    font-size: 20px;
    font-weight: bold;
}
</style>
