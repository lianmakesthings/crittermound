<template>
  <div class="worker-mound">
    <h3>{{ type }} {{critters.length}} / {{mound.size}}</h3>
    <b-button :id="'upgrade-'+location+'-'+type" v-on:click="upgrade(location, type)">Upgrade {{ upgradeCost }} Sod</b-button>
    <critter-header :id="'critter-header-'+location+'-'+type" :bgColor="bgColor"></critter-header>
    <div v-for="critter in critters">
      <critter :id="'critter-'+critter.id" :critterId="critter.id" :showProgressBar="true"></critter>
    </div>
    </div>
</template>

<script>
  import Critter from './Critter.vue';
  import CritterHeader from './CritterHeader.vue';

  export default {
    components: {
      'critter': Critter,
      'critter-header': CritterHeader
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
      mound() {
        return this.$store.getters.mound(this.location, this.type);
      },
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
