<template>
  <div class="d-flex flex-column">
    <div v-for="nation in nations">
      <b-card :title="nation.name" class="nationCard" v-on:click="startWar(nation.id)">
        <p>{{ nation.custom }}</p>
        <p>{{ nation.minBaseVal }} - {{ nation.maxBaseVal }}</p>
      </b-card>
    </div>
  </div>
</template>

<script>
  import Nation from '../lib/Nation';

  export default {
    computed: {
      nations() {
        return Nation.allNations();
      }
    },
    methods: {
      startWar: function (nationId) {
        console.log('start war with '+nationId)
      }
    }
  }
</script>

<style>
.nationCard {
  text-align: center;
  min-width: 15rem;
  margin-top: 20px;
}
</style>
