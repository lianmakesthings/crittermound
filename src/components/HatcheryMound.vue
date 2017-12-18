<template>
  <div class="hatchery-mound">
    <div>
      <div>
        <button v-on:click="replaceParent">{{ parent }}</button>
        <button v-on:click="addWorker">Worker</button>
      </div>
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
      type: {
        required: true,
        type: String,
      },
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
      headerBackground() {
        return {
          'background-color': this.bgColor
        }
      },
      parent() {
        return (this.type === 'female') ? 'Queen' : 'King'
      }
    }
  }
</script>

<style>

</style>
