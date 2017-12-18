<template>
  <div class="worker-mound">
    <h3>{{ type }}</h3>
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
