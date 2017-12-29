<template>
  <div class="army-mound">
    <h3>Army {{critters.length}} / {{mound.size}}</h3>
    <b-button v-on:click="upgrade(location, type)">Upgrade {{ upgradeCost }} Sod</b-button>
    <critter-header :bgColor="bgColor"></critter-header>
    <div v-for="critter in critters">
      <critter :critterId="critter.id" :showProgressBar="true"></critter>
    </div>
  </div>
</template>

<script>
  import Critter from './Critter.vue';
  import CritterHeader from './CritterHeader.vue';

  export default {
    data() {
      return {
        location: 'soldiers',
        type: 'army'
      }
    },
    components: {
      'critter': Critter,
      'critter-header': CritterHeader
    },
    computed: {
      mound() {
        return this.$store.getters.mound(this.location, this.type)
      },
      critters() {
        return this.mound.critters
      },
      bgColor() {
        return 'grey';
      },
      upgradeCost() {
        return this.$store.getters.mound(this.location, this.type).upgradeCost
      }
    },
    methods: {
      upgrade: function(location, type) {
        this.$store.dispatch('upgradeMound', {location, type})
      }
    }
  }
</script>

<style>
</style>
