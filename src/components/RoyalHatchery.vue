<template>
  <div id="royal-hatchery">
    <h2>Royal Hatchery</h2>
    <breeding-slot id="queen-breeding-slot" location="royalHatchery" owner="mother"></breeding-slot>
    <breeding-slot id="king-breeding-slot" location="royalHatchery" owner="father"></breeding-slot>

    <hatchery-slot id="female-hatchery-slot" location="royalHatchery" owner="female"></hatchery-slot>
    <hatchery-slot id="male-hatchery-slot" location="royalHatchery" owner="male"></hatchery-slot>
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
