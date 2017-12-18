<template>
  <div class="breeding-mound">
    <h3>{{ name }}</h3>
    <button v-on:click="boost(location)">Boost: {{ boosts }}/{{ maxBoosts }}</button>
    <div class="progress">
      <div class="progress-bar progress-bar-striped" v-bind:style="progressBar"></div>
    </div>
    <table class="table">
      <thead>
      <tr v-bind:style="headerBackground">
        <th>Score</th>
        <th>Vitality</th>
        <th>Strength</th>
        <th>Agility</th>
        <th>Bite</th>
        <th>Sting</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{ critter.score }}</td>
        <td>{{ critter.traits[0].value }}</td>
        <td>{{ critter.traits[1].value }}</td>
        <td>{{ critter.traits[2].value }}</td>
        <td>{{ critter.traits[3].value }}</td>
        <td>{{ critter.traits[4].value }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
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
      critter() {
        return this.$store.getters.critters(this.location, this.type)[0]
      },
      bgColor() {
        return (this.type === 'mother') ? '#f2dede' : '#d9edf7'
      },
      breedingProgress() {
        return this.critter.progress
      },
      progressBar() {
        return {
          'background-color': this.bgColor,
          'width': this.breedingProgress+'%'
        }
      },
      headerBackground() {
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
      }
    },
    methods: {
      boost: function(location) {
        this.$store.dispatch('useBoost', location);
      }
    }
  }
</script>

<style scoped>

</style>
