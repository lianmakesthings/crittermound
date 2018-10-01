<template>
  <div>
    <b-progress :id="'progressBar-'+critter.id" v-if="showProgressBar" :value="health" :max="maxHealth" animated></b-progress>
    <div class="d-flex justify-content-around">
      <div id="totalDetails">
        <div :id="'totalDetails-'+critter.id">{{ critter.score }}</div>
        <b-popover title="Stats" triggers="hover focus" :target="'totalDetails-'+critter.id">
          <div>Generation: {{critter.generation}}</div>
          <div>Birth Order: {{critter.id}}</div>
          <div>Total Score: {{critter.score}}</div>
          <div>Total Base: {{critter.baseScore}}</div>
          <div>Total Bonus: {{critter.bonusScore}}</div>
          <div>Mutations: {{critter.mutations}}</div>
        </b-popover>
      </div>
      <div id="vitalityDetails">
        <div :id="'vitalityDetails-'+critter.id">{{ critter.traits[0].value }}</div>
        <b-popover title="Stats" triggers="hover focus" :target="'vitalityDetails-'+critter.id">
          <div>Base: {{ critter.traits[0].value }}</div>
          <div>Bonus: {{ critter.traits[0].bonus }}</div>
          <div>Value: {{ critter.traits[0].getTrueValue() }}</div>
          <div>Health: {{ critter.maxHealth }}</div>
          <div>Sod Production: {{ critter.sodPerSecond }} per sec.</div>
        </b-popover>
      </div>
      <div id="strengthDetails">
        <div :id="'strengthDetails-'+critter.id">{{ critter.traits[1].value }}</div>
        <b-popover title="Stats" triggers="hover focus" :target="'strengthDetails-'+critter.id">
          <div>Base: {{ critter.traits[1].value }}</div>
          <div>Bonus: {{ critter.traits[1].bonus }}</div>
          <div>Value: {{ critter.traits[1].getTrueValue() }}</div>
          <div>Carrying Capacity: {{ critter.carryPerSecond}} per sec.</div>
        </b-popover>
      </div>
      <div id="agilityDetails">
        <div :id="'agilityDetails-'+critter.id">{{ critter.traits[2].value }}</div>
        <b-popover title="Stats" triggers="hover focus" :target="'agilityDetails-'+critter.id">
          <div>Base: {{ critter.traits[2].value }}</div>
          <div>Bonus: {{ critter.traits[2].bonus }}</div>
          <div>Value: {{ critter.traits[2].getTrueValue() }}</div>
          <div>Speed: {{ critter.actionTimeSeconds }} seconds</div>
        </b-popover>
      </div>
      <div id="biteDetails">
        <div :id="'biteDetails-'+critter.id">{{ critter.traits[3].value }}</div>
        <b-popover title="Stats" triggers="hover focus" :target="'biteDetails-'+critter.id">
          <div>Base: {{ critter.traits[3].value }}</div>
          <div>Bonus: {{ critter.traits[3].bonus }}</div>
          <div>Value: {{ critter.traits[3].getTrueValue(critter.strengthBonus) }}</div>
          <div>Strength Bonus: {{ critter.strengthBonus }}</div>
          <div>Farm Production: {{ critter.grassPerSecond }} per sec.</div>
        </b-popover>
      </div>
      <div id="stingDetails">
        <div :id="'stingDetails-'+critter.id">{{ critter.traits[4].value }}</div>
        <b-popover title="Stats" triggers="hover focus" :target="'stingDetails-'+critter.id">
          <div>Base: {{ critter.traits[4].value }}</div>
          <div>Bonus: {{ critter.traits[4].bonus }}</div>
          <div>Value: {{ critter.traits[4].getTrueValue(critter.agilityBonus) }}</div>
          <div>Agility Bonus: {{ critter.agilityBonus }}</div>
          <div>Mine Production: {{ critter.dirtPerSecond }} per sec.</div>
        </b-popover>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      critterId: {
        required: true,
        type: Number
      },
      showProgressBar: {
        required: true,
        type: Boolean
      }
    },
    computed: {
      critter() {
        return this.$store.getters.findCritter(this.critterId);
      },
      health() {
        return this.critter.currentHealth
      },
      maxHealth() {
        return this.critter.maxHealth
      }
    },
  }
</script>

<style>

</style>
