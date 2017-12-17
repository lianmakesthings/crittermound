<template>
  <div id="royal-hatchery">
    <h2>Royal Hatchery</h2>
    <breeding-slot id="queen-breeding-slot" context="royalHatchery" owner="queen"></breeding-slot>
    <breeding-slot id="king-breeding-slot" context="royalHatchery" owner="king"></breeding-slot>

    <hatchery-slot id="female-hatchery-slot" context="royalHatchery" owner="female"></hatchery-slot>
    <hatchery-slot id="male-hatchery-slot" context="royalHatchery" owner="male"></hatchery-slot>
  </div>
</template>

<script>
  import BreedingSlot from './BreedingSlot.vue';
  import HatcherySlot from './HatcherySlot.vue';

  export default {
    components: {
      'breeding-slot': BreedingSlot,
      'hatchery-slot': HatcherySlot
    }
  }
</script>

<style>

</style>
