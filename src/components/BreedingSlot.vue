<template>
  <div class="breeding-slot">
    <h3>{{ owner }}</h3>
    <div>{{ critter.progress }}</div>
    <div>
      <div>
        <span>Score</span>
        <span>Vitality</span>
        <span>Strength</span>
        <span>Agility</span>
        <span>Bite</span>
        <span>Sting</span>
      </div>
      <div>
        <span>{{ critter.score }}</span>
        <span>{{ critter.traits[0].value }}</span>
        <span>{{ critter.traits[1].value }}</span>
        <span>{{ critter.traits[2].value }}</span>
        <span>{{ critter.traits[3].value }}</span>
        <span>{{ critter.traits[4].value }}</span>
      </div>
    </div>
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
      }
    }
  }
</script>

<style>

</style>
