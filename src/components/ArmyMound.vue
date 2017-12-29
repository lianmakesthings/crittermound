<template>
  <div class="army-mound">
    <h3>Army {{critters.length}} / {{mound.size}}</h3>
    <b-button v-on:click="boost(location)">Boost: {{ boosts }}/{{ maxBoosts }}</b-button>
    <b-button v-on:click="upgrade(location, critter)">Upgrade {{ upgradeCost }} Sod</b-button>
    <critter-header :bgColor="bgColor"></critter-header>
    <critter :critterId="critter.id" :bgColor="bgColor" :showProgressBar="true"></critter>
  </div>
</template>

<script>
  import Critter from './Critter.vue';
  import CritterHeader from './CritterHeader.vue';

  export default {
    components: {
      Critter,
      'critter-header': CritterHeader
    },
    props: {
      location: {
        required: true,
        type: String
      },
      type: {
        required: true,
        type: String,
      }
    },
    computed: {
      mound() {
        return this.$store.getters.mound(this.location, this.type)
      },
      bgColor() {
        return 'black';
      },
      upgradeCost() {
        return this.$store.getters.mound(this.location, this.type).upgradeCost
      }
    },
    methods: {
      upgrade: function(location, critter) {
        this.$store.dispatch('upgradeMound', {location, type: critter.gender})
      }
    }
  }
</script>

<style scoped>
</style>
