<template>
  <div class="hatchery-mound">
    <div>
      <div>
        <b-button v-on:click="replaceParent">{{ parent }}</b-button>
        <b-button v-on:click="addWorker">Worker</b-button>
      </div>
    </div>
    <critter-header :bgColor="bgColor"></critter-header>
    <div v-for="critter in critters">
      <critter :critterId="critter.id" :bgColor="bgColor" :showProgressBar="false"></critter>
    </div>
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
        type: String
      }
    },
    methods: {
      replaceParent: function () {
        this.$store.dispatch('replaceParent', {
          location: this.location,
          type: this.type
        })
      },
      addWorker: function() {
        this.$store.dispatch('addWorker', {
          location: this.location,
          type: this.type
        })
      }
    },
    computed: {
      critters() {
        return this.$store.getters.critters(this.location, this.type)
      },
      bgColor() {
        return (this.type === 'female') ? '#f2dede' : '#d9edf7'
      },
      parent() {
        return (this.type === 'female') ? 'Queen' : 'King'
      },
      headerStyle() {
        return {
          'background-color': this.bgColor
        }
      }
    }
  }
</script>

<style>

</style>
