<template>
  <div class="breeding-slot">
    <h3>{{ owner }}</h3>
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
      owner: {
        required: true,
        type: String,
      },
      id: {
        required: true,
        type: String,
      }
    },
    computed: {
      critter() {
        return this.$store.getters.critters(this.location, this.owner)
      },
      bgColor() {
        return (this.owner === 'mother') ? '#f2dede' : '#d9edf7'
      },
      breedingProgress() {
        return this.$store.getters.critters(this.location, this.owner).progress
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
      }
    }
  }
</script>

<style scoped>

</style>
