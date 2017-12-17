<template>
  <div id="worker">
    <h2>Worker</h2>
    <div id="visualisation"></div>
    <div class="worker-column">
      <worker-slot id="mine-worker-slot" location="worker" owner="mine"></worker-slot>
      <worker-slot id="farm-worker-slot" location="worker" owner="farm"></worker-slot>
    </div>
    <div class="worker-column">
      <worker-slot id="carry-worker-slot" location="worker" owner="carry"></worker-slot>
      <worker-slot id="factory-worker-slot" location="worker" owner="factory"></worker-slot>
    </div>
  </div>
</template>

<script>
  import WorkerSlot from './WorkerSlot.vue';

  export default {
    components: {
      'worker-slot': WorkerSlot
    }
  }
</script>

<style scoped>
.worker-column {
  display: inline-block;
}
</style>
