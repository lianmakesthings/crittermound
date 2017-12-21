<template>
  <div>
    <b-progress v-if="showProgressBar" :value="health" :max="maxHealth" animated></b-progress>
    <div class="d-flex justify-content-around">
      <div id="totalDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
        <span>{{ critter.score }}</span>
        <div v-if="showTotalDetails">
          <div>Generation: {{ critter.generation }}</div>
          <div>Birth Order: {{ critter.id }}</div>
          <div>Total Score: {{ critter.baseScore }}</div>
          <div>Bonus Score: {{ critter.bonusScore }}</div>
        </div>
      </div>
      <div id="vitalityDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
        <span>{{ critter.traits[0].value }}</span>
        <div v-if="showVitalityDetails">
          <div>Base: {{ critter.traits[0].value }}</div>
          <div>Bonus: {{ critter.traits[0].bonus }}</div>
          <div>Value: {{ critter.traits[0].getTrueValue() }}</div>
          <div>Health: {{ critter.maxHealth }}</div>
          <div>Sod Production: {{ critter.sodPerSecond }} per sec.</div>
        </div>
      </div>
      <div id="strengthDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
        <span>{{ critter.traits[1].value }}</span>
        <div v-if="showStrengthDetails">
          <div>Base: {{ critter.traits[1].value }}</div>
          <div>Bonus: {{ critter.traits[1].bonus }}</div>
          <div>Value: {{ critter.traits[1].getTrueValue() }}</div>
          <div>Carrying Capacity: {{ critter.carryPerSecond}} per sec.</div>
        </div>
      </div>
      <div id="agilityDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
        <span>{{ critter.traits[2].value }}</span>
        <div v-if="showAgilityDetails">
          <div>Base: {{ critter.traits[2].value }}</div>
          <div>Bonus: {{ critter.traits[2].bonus }}</div>
          <div>Value: {{ critter.traits[2].getTrueValue() }}</div>
          <div>Speed: {{ critter.actionTimeSeconds }} seconds</div>
        </div>
      </div>
      <div id="biteDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
        <span>{{ critter.traits[3].value }}</span>
        <div v-if="showBiteDetails">
          <div>Base: {{ critter.traits[3].value }}</div>
          <div>Bonus: {{ critter.traits[3].bonus }}</div>
          <div>Value: {{ critter.traits[3].getTrueValue() }}</div>
          <div>Strength Bonus: {{ critter.strengthBonus }}</div>
          <div>Farm Production: {{ critter.grassPerSecond }} per sec.</div>
        </div>
      </div>
      <div id="stingDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
          <span>{{ critter.traits[4].value }}</span>
          <div v-if="showStingDetails">
            <div>Base: {{ critter.traits[4].value }}</div>
            <div>Bonus: {{ critter.traits[4].bonus }}</div>
            <div>Value: {{ critter.traits[4].getTrueValue() }}</div>
            <div>Agility Bonus {{ critter.agilityBonus }}</div>
            <div>Mine Production: {{ critter.dirtPerSecond }} per sec.</div>
          </div>
        </div>
      </td>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        totalDetails: false,
        strengthDetails: false,
        vitalityDetails: false,
        agilityDetails: false,
        biteDetails: false,
        stingDetails: false
      }
    },
    props: {
      critterId: {
        required: true,
        type: Number
      },
      bgColor: {
        required: true,
        type: String,
      },
      showProgressBar: {
        required: true,
        type: Boolean
      }
    },
    computed: {
      critter() {
        return this.$store.getters.findCritter(this.critterId)
      },
      health() {
        return this.critter.currentHealth
      },
      maxHealth() {
        return this.critter.maxHealth
      },
      showTotalDetails() {
        return this.totalDetails;
      },
      showVitalityDetails() {
        return this.vitalityDetails;
      },
      showStrengthDetails() {
        return this.strengthDetails;
      },
      showAgilityDetails() {
        return this.agilityDetails;
      },
      showBiteDetails() {
        return this.biteDetails;
      },
      showStingDetails() {
        return this.stingDetails;
      }
    },
    methods: {
      showDetails: function (event) {
        this[event.originalTarget.id] = true;
      },
      hideDetails: function (event) {
        this[event.originalTarget.id] = false;
      }
    }
  }
</script>

<style>

</style>
