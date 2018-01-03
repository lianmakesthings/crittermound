<template>
  <div class="d-flex">
    <div v-for="nation in nations">
      <b-card :title="nation.name" style="min-width: 15rem;" v-on:click="startWar(nation.id)">
        <span>{{ nation.custom }}</span>
        <span>{{ nation.minBaseVal }} - {{ nation.maxBaseVal }}</span>
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

</style>
