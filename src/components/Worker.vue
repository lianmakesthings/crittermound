<template>
  <div id="worker">
    <h2>Worker</h2>
    <div id="visualisation" class="d-flex flex-column justify-content-between" style="text-align: center">
      <div id="mine-dirt" class="alert alert-warning">
        <strong>Mined Dirt</strong>
        <div>{{ sodProductionData.dirtStored }} {{ sodProductionData.dirtPerSecond }}</div>
      </div>
      <div id="carry-dirt">
        <i class="fas fa-angle-double-down fa-3x" style="color:sandybrown"></i>
      </div>
      <div id="factory-dirt" class="alert alert-warning">
        <strong>Factory Dirt</strong>
        <div>{{ sodProductionData.factoryDirtStored }} {{ sodProductionData.dirtCarriedPerSecond }}</div>
      </div>
      <div id="use-dirt">
        <i class="fas fa-angle-double-down fa-3x" style="color:sandybrown"></i>
      </div>
      <div id="produce-sod" class="alert alert-info">
        <strong>Produce Sod</strong>
        <div>{{ sodProductionData.totalSod }} {{ sodProductionData.sodPerSecond }}</div>
      </div>
      <div id="use-grass">
        <i class="fas fa-angle-double-up fa-3x" style="color:darkgreen"></i>
      </div>
      <div id="factory-grass" class="alert alert-success">
        <strong>Factory Grass</strong>
        <div>{{ sodProductionData.factoryGrassStored }} {{ sodProductionData.grassCarriedPerSecond }}</div>
      </div>
      <div id="carry-grass">
        <i class="fas fa-angle-double-up fa-3x" style="color:darkgreen"></i>
      </div>
      <div id="farm-grass" class="alert alert-success">
        <strong>Farmed Grass</strong>
        <div>{{ sodProductionData.grassStored }} {{ sodProductionData.grassPerSecond }}</div>
      </div>
    </div>
    <div></div>
    <div class="d-flex flex-column">
      <worker-mound id="mine-worker-mound" location="worker" type="mine"></worker-mound>
      <worker-mound id="farm-worker-mound" location="worker" type="farm"></worker-mound>
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
        viewData.dirtPerSecond = (sodProduction.dirtPerSecond < 0) ? '' : '+';
        viewData.dirtPerSecond += SmartRound(sodProduction.dirtPerSecond) + '/s';
        viewData.grassPerSecond = (sodProduction.grassPerSecond < 0) ? '' : '+';
        viewData.grassPerSecond += SmartRound(sodProduction.grassPerSecond) + '/s';
        viewData.dirtCarriedPerSecond = (sodProduction.dirtCarriedPerSecond < 0) ? '' : '+';
        viewData.dirtCarriedPerSecond += SmartRound(sodProduction.dirtCarriedPerSecond) + '/s';
        viewData.grassCarriedPerSecond = (sodProduction.grassCarriedPerSecond < 0) ? '-' : '+';
        viewData.grassCarriedPerSecond += SmartRound(sodProduction.grassCarriedPerSecond) + '/s';
        viewData.sodPerSecond = (sodProduction.sodPerSecond < 0) ? '' : '+';
        viewData.sodPerSecond += SmartRound(sodProduction.sodPerSecond) + '/s';
        return viewData;
      }
    }
  }
</script>

<style>
</style>
