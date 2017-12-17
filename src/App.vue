<template>
  <div id="app" class="container">
    <royal-hatchery></royal-hatchery>
    <worker></worker>
  </div>
</template>

<script>
  import RoyalHatchery from './components/RoyalHatchery.vue'
  import Worker from './components/Worker.vue'

  export default {
    name: 'app',
    components: {
      'royal-hatchery': RoyalHatchery,
      'worker': Worker
    }
  }
</script>

<style>

</style>
