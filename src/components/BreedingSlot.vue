<template>
  <div class="breeding-slot">
    <h3>{{ owner }}</h3>
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
        <span>{{ slotOwner.score }}</span>
        <span>{{ slotOwner.traits[0].value }}</span>
        <span>{{ slotOwner.traits[1].value }}</span>
        <span>{{ slotOwner.traits[2].value }}</span>
        <span>{{ slotOwner.traits[3].value }}</span>
        <span>{{ slotOwner.traits[4].value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
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
      slotOwner() {
        return this.$store.state.royalHatchery[this.owner]
      }
    }
  }
</script>

<style>

</style>
