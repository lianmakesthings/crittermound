<template>
  <div>
    <h4>War</h4>
    <div class="d-flex">
      <div v-for="row in currentWar">
        <div class="d-flex flex-column">
          <div v-for="tile in row">
              <div class="tile">{{tile.danger}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      currentWar() {
        return this.$store.getters.currentMap;
      }
    }
  }
</script>

<style scoped>
  .tile {
    font-size: 6pt;
    text-align: center;
    min-width: 20px;
    min-height: 20px;
    border-radius: 2px;
    border: 1px solid black;
    margin-left: 1px;
    margin-bottom: 1px;
  }

</style>
