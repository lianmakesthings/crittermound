<template>
  <div class="d-flex flex-column">
    <div v-for="nation in nations">
      <b-card :id="'nation-'+nation.id" :title="nation.name" class="nationCard" :bg-variant="getBgVariant(nation.id)" :text-variant="getTextVariant(nation.id)" v-on:click="startWar(nation.id)">
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
      },
      getBgVariant() {
        return nationId => {
          if (this.$store.getters.isNationUnlocked(nationId)) {
            return 'secondary'
          }
          return 'light'
        }
      },
      getTextVariant() {
        return nationId => {
          if (this.$store.getters.isNationUnlocked(nationId)) {
            return 'white'
          }
          return 'black'
        }
      }
    },
    methods: {
      startWar: function (nationId) {
        if (this.$store.getters.isNationUnlocked(nationId)) {
          this.$store.dispatch('startWar', nationId);
        }
      }
    }
  }
</script>

<style scoped>
.nationCard {
  text-align: center;
  margin-top: 20px;
}
</style>
