<template>
  <div v-bind:style="headerStyle" class="d-flex flex-row justify-content-around">
    <div>Score</div>
    <div>Vitality</div>
    <div>Strength</div>
    <div>Agility</div>
    <div>Bite</div>
    <div>Sting</div>
  </div>
</template>

<script>
  export default {
    props: {
      bgColor: {
        required: true,
        type: String,
      }
    },
    computed: {
      headerStyle() {
        return {
          'background-color': this.bgColor
        }
      },
    }
  }
</script>
