<template>
  <div id="royal-hatchery">
    <h2>Royal Hatchery</h2>
    <breeding-slot id="queen-breeding-slot" owner="queen"></breeding-slot>
    <breeding-slot id="king-breeding-slot" owner="king"></breeding-slot>

  </div>
</template>

<script>
  import BreedingSlot from './BreedingSlot.vue';

  export default {
    components: {
      'breeding-slot': BreedingSlot
    }
  }
</script>

<style>

</style>
