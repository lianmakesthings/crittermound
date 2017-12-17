<template>
  <div id="app" class="container">
    <royal-hatchery></royal-hatchery>
  </div>
</template>

<script>
  import RoyalHatchery from './components/RoyalHatchery.vue'

  export default {
    name: 'app',
    components: {
      'royal-hatchery': RoyalHatchery
    }
  }
</script>

<style>

</style>
