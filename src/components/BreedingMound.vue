<template>
  <div class="breeding-mound">
    <h3>{{ name }}</h3>
    <b-button v-on:click="boost(location)">Boost: {{ boosts }}/{{ maxBoosts }}</b-button>
    <b-button v-on:click="upgrade(location, critter)">Upgrade {{ upgradeCost }} Sod</b-button>
    <critter-header :bgColor="bgColor"></critter-header>
    <critter :critterId="critter.id" :showProgressBar="true"></critter>
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
      critter() {
        return this.mound.critters[0]
      },
      bgColor() {
        return (this.type === 'mother') ? '#f2dede' : '#d9edf7'
      },
      name() {
        return (this.type === 'mother') ? 'Queen' : 'King';
      },
      boosts() {
          return this.$store.getters.boosts
      },
      maxBoosts() {
        return this.$store.getters.maxBoosts
      },
      upgradeCost() {
        return this.$store.getters.mound(this.location, this.critter.gender).upgradeCost
      }
    },
    methods: {
      boost: function(location) {
        this.$store.dispatch('useBoost', location);
      },
      upgrade: function(location, critter) {
        this.$store.dispatch('upgradeMound', {location, type: critter.gender})
      },
      showDetails: function(event) {
        this[event.originalTarget.id] = true;
      },
      hideDetails: function(event) {
        this[event.originalTarget.id] = false;
      }
    }
  }
</script>

<style scoped>
</style>
