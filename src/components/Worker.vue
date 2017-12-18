<template>
  <div id="worker">
    <h2>Worker</h2>
    <div id="visualisation">
      <div v-for="production in productions">
        <div>{{ production.type }}</div>
        <div>{{ production.productionPerSecond }}</div>
      </div>
    </div>
    <div class="worker-column">
      <worker-mound id="mine-worker-mound" location="worker" type="mine"></worker-mound>
      <worker-mound id="farm-worker-mound" location="worker" type="farm"></worker-mound>
    </div>
    <div class="worker-column">
      <worker-mound id="carry-worker-mound" location="worker" type="carry"></worker-mound>
      <worker-mound id="factory-worker-mound" location="worker" type="factory"></worker-mound>
    </div>
  </div>
</template>

<script>
  import WorkerMound from './WorkerMound.vue';

  export default {
    components: {
      'worker-mound': WorkerMound
    },
    computed: {
      productions() {
        return this.$store.getters.productionPerSecond
      }
    }
  }
</script>

<style scoped>
.worker-column {
  display: inline-block;
}
</style>
