<template>
  <div class="breeding-mound">
    <h3>{{ name }}</h3>
    <b-button v-on:click="boost(location)">Boost: {{ boosts }}/{{ maxBoosts }}</b-button>
    <b-button v-on:click="upgrade(location, critter)">Upgrade {{ upgradeCost }} Sod</b-button>

    <div v-bind:style="headerStyle" class="d-flex flex-row justify-content-around">
      <div>Score</div>
      <div>Vitality</div>
      <div>Strength</div>
      <div>Agility</div>
      <div>Bite</div>
      <div>Sting</div>
    </div>
    <critter :critterId="critter.id" :bgColor="bgColor" :showProgressBar="true"></critter>
    </table>
  </div>
</template>

<script>
  import Critter from './Critter.vue';

  export default {
    components: {
      'critter': Critter
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
      headerStyle() {
        return {
          'background-color': this.bgColor
        }
      },
      name() {
        return (this.type === 'mother') ? 'Queen' : 'King';
      },
      boosts() {
          return this.$store.getters.boosts(this.location)
      },
      maxBoosts() {
        return this.$store.getters.maxBoosts(this.location)
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
