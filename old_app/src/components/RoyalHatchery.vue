<template>
  <div id="royal-hatchery">
    <h2>Royal Hatchery</h2>
    <div class="d-flex flex-column">
      <div class="breeding-unit">
        <breeding-mound id="queen-breeding-mound" location="royalHatchery" type="mother"></breeding-mound>
        <hatchery-mound id="female-hatchery-mound" location="royalHatchery" type="female"></hatchery-mound>
      </div>
      <div class="breeding-unit">
        <breeding-mound id="king-breeding-mound" location="royalHatchery" type="father"></breeding-mound>
        <hatchery-mound id="male-hatchery-mound" location="royalHatchery" type="male"></hatchery-mound>
      </div>
    </div>
  </div>
</template>

<script>
  import BreedingMound from './BreedingMound.vue';
  import HatcheryMound from './HatcheryMound.vue';

  export default {
    components: {
      'breeding-mound': BreedingMound,
      'hatchery-mound': HatcheryMound
    }
  }
</script>

<style scoped>
  .breeding-unit {
    display: inline-block;
  }
</style>
