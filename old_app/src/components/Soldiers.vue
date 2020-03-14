<template>
  <div>
  <army-mound></army-mound>
    <war v-if="atWar"></war>
    <nations v-else></nations>
  </div>
</template>

<script>
  import ArmyMound from './ArmyMound.vue';
  import War from './War.vue';
  import Nations from './Nations.vue';

  export default {
    components: {
      'army-mound': ArmyMound,
      'war': War,
      'nations': Nations
    },
    computed: {
      atWar() {
        return !!this.$store.getters.atWar;
      }
    }
  }
</script>

<style>

</style>
