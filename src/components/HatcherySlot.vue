<template>
  <div class="hatchery-slot">
    <h3>{{ owner }}</h3>
    <table class="table">
      <thead>
        <tr v-bind:style="headerBackground">
          <td>Score</td>
          <td>Vitality</td>
          <td>Strength</td>
          <td>Agility</td>
          <td>Bite</td>
          <td>Sting</td>
        </tr>
      </thead>
      <tbody>
      <tr v-for="critter in critters">
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
        type: String,
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
      critters() {
        return this.$store.getters.critters(this.location, this.owner)
      },
      bgColor() {
        return (this.owner === 'female') ? '#f2dede' : '#d9edf7'
      },
      headerBackground() {
        return {
          'background-color': this.bgColor
        }
      }
    }
  }
</script>

<style>

</style>
