<template>
  <div class="worker-mound">
    <h3>{{ type }}</h3>
    <b-button v-on:click="upgrade(location, type)">Upgrade {{ upgradeCost }} Sod</b-button>
    <div v-bind:style="headerStyle" class="d-flex flex-row justify-content-around">
      <div>Score</div>
      <div>Vitality</div>
      <div>Strength</div>
      <div>Agility</div>
      <div>Bite</div>
      <div>Sting</div>
    </div>
    <div v-for="critter in critters">
      <critter :critterId="critter.id" :bgColor="bgColor" :showProgressBar="true"></critter>
    </div>
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
        type: String,
      },
      type: {
        required: true,
        type: String,
      }
    },
    computed: {
      critters() {
        return this.$store.getters.critters(this.location, this.type)
      },
      bgColor() {
        switch(this.type) {
          case 'mine':
            return '#ffd143';
          case 'farm':
            return '#56ab60';
          case 'carry':
            return '#b87900';
          case 'factory':
            return '#65749f';
        }
      },
      headerStyle() {
        return {
          'background-color': this.bgColor
        }
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
