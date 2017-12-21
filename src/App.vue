<template>
  <div id="app" class="container">
    <div class="appHeader d-flex justify-content-end">
      <div>
        <div v-show="stateSaved" class="alert alert-info">State saved</div></div>
      <div>
        <div class="totalSod">Sod {{ totalSod }}</div>
        <b-button v-on:click="save">Save</b-button>
      </div>
    </div>
    <b-tabs>
      <b-tab title="Royal Hatchery" active>
        <royal-hatchery></royal-hatchery>
      </b-tab>
      <b-tab title="Worker">
        <worker></worker>
      </b-tab>
      <b-tab title="Soldiers" disabled></b-tab>
      <b-tab title="Achievements" disabled></b-tab>
      <b-tab title="How To Play" disabled></b-tab>
    </b-tabs>
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
      },
      stateSaved() {
        return this.$store.getters.showStateSaved
      }
    },
    methods: {
      save: function() {
        this.$store.dispatch('saveState')
      }
    }
  }
</script>

<style scoped>
  .appHeader {
    float: right;
  }
  .headerColumn {
    display: inline-block;
  }
  .totalSod {
    font-size: 20px;
    font-weight: bold;
}
</style>
