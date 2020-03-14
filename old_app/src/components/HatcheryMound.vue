<template>
  <div class="hatchery-mound">
    <h4>Hatchery {{critters.length}} / {{mound.size}}</h4>
    <div>
      <b-button :id="'replace-parent-'+location+'-'+type" v-on:click="replaceParent">{{ parent }}</b-button>
      <b-button :id="'add-worker-'+location+'-'+type" v-on:click="addWorker">Worker</b-button>
      <b-button :id="'add-soldier-'+location+'-'+type" v-on:click="addSoldier">Army</b-button>

      <b-dropdown :id="'sort-dropdown-'+location+'-'+type">
        <div v-for="sort in sortNames">
          <b-dropdown-item-button v-on:click="sortMound(sort)">{{sort}}</b-dropdown-item-button>
        </div>
      </b-dropdown>
    </div>
    <critter-header :id="'critter-header-'+location+'-'+type" :bgColor="bgColor"></critter-header>
    <div v-for="critter in critters">
      <critter :id="'critter-'+critter.id" :critterId="critter.id" :showProgressBar="false"></critter>
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
      },
      addSoldier: function() {
        this.$store.dispatch('addSoldier', {
          location: this.location,
          type: this.type
        })
      },
      sortMound: function(sortBy) {
        this.$store.dispatch('sortMound', {location: this.location, type: this.type, sortBy});
      }
    },
    computed: {
      mound() {
        return this.$store.getters.mound(this.location, this.type)
      },
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
      },
      sortNames() {
        return this.$store.getters.sorts;
      }
    }
  }
</script>

<style>

</style>
