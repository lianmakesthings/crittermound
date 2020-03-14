<template>
  <div class="breeding-mound">
    <h3>{{ name }}</h3>
    <b-button :id="'button-boost-'+location+'-'+type" v-on:click="boost">Boost: {{ boosts }}/{{ maxBoosts }}</b-button>
    <b-button :id="'button-upgrade-'+location+'-'+type" v-on:click="upgrade">Upgrade {{ upgradeCost }} Sod</b-button>
    <critter-header :id="'critter-header-'+critter.id" :bgColor="bgColor"></critter-header>
    <critter :id="'critter-'+critter.id" :critterId="critter.id" :showProgressBar="true"></critter>
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
      boost: function() {
        this.$store.dispatch('useBoost', this.location);
      },
      upgrade: function() {
        this.$store.dispatch('upgradeMound', {location: this.location, type: this.critter.gender})
      },
    }
  }
</script>

<style scoped>
</style>
