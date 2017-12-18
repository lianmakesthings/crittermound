<template>
  <div id="worker">
    <h2>Worker</h2>
    <div id="visualisation">
      <div class="worker-column" id="mine-dirt">
        <div>Mined Dirt</div>
        <div>{{ sodProductionData.dirtStored }} {{ sodProductionData.dirtPerSecond }}</div>
      </div>
      <div class="worker-column" id="factory-dirt">
        <div>Factory Dirt</div>
        <div>{{ sodProductionData.factoryDirtStored }} {{ sodProductionData.dirtCarriedPerSecond }}</div>
      </div>
      <div class="worker-column" id="produce-sod">
        <div>Produce Sod</div>
        <div>{{ sodProductionData.totalSod }} {{ sodProductionData.sodPerSecond }}</div>
      </div>
      <div class="worker-column" id="factory-grass">
        <div>Factory Grass</div>
        <div>{{ sodProductionData.factoryGrassStored }} {{ sodProductionData.grassCarriedPerSecond }}</div>
      </div>
      <div class="worker-column" id="farm-grass">
        <div>Farmed Grass</div>
        <div>{{ sodProductionData.grassStored }} {{ sodProductionData.grassPerSecond }}</div>
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
  import { SmartRound } from '../lib/Helpers';
  import WorkerMound from './WorkerMound.vue';

  export default {
    components: {
      'worker-mound': WorkerMound
    },
    computed: {
      sodProductionData() {
        const sodProduction = this.$store.getters.sodProduction;
        const viewData = {
          dirtStored: SmartRound(sodProduction.dirtStored),
          grassStored: SmartRound(sodProduction.grassStored),
          factoryDirtStored: SmartRound(sodProduction.factoryDirtStored),
          factoryGrassStored: SmartRound(sodProduction.factoryGrassStored),
          totalSod: SmartRound(this.$store.getters.totalSod)
        };
        viewData.dirtPerSecond = (sodProduction.dirtPerSecond < 0) ? '-' : '+';
        viewData.dirtPerSecond += SmartRound(sodProduction.dirtPerSecond) + '/s';
        viewData.grassPerSecond = (sodProduction.grassPerSecond < 0) ? '-' : '+';
        viewData.grassPerSecond += SmartRound(sodProduction.grassPerSecond) + '/s';
        viewData.dirtCarriedPerSecond = (sodProduction.dirtCarriedPerSecond < 0) ? '-' : '+';
        viewData.dirtCarriedPerSecond += SmartRound(sodProduction.dirtCarriedPerSecond) + '/s';
        viewData.grassCarriedPerSecond = (sodProduction.grassCarriedPerSecond < 0) ? '-' : '+';
        viewData.grassCarriedPerSecond += SmartRound(sodProduction.grassCarriedPerSecond) + '/s';
        viewData.sodPerSecond = (sodProduction.sodPerSecond < 0) ? '-' : '+';
        viewData.sodPerSecond += SmartRound(sodProduction.sodPerSecond) + '/s';
        return viewData;
      }
    }
  }
</script>

<style scoped>
.worker-column {
  display: inline-block;
}
</style>
