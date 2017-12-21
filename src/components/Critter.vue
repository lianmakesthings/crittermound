<template>
  <div>
    <div v-if="showProgressBar" class="progress">
      <div class="progress-bar progress-bar-striped" v-bind:style="progressBar"></div>
    </div>
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
      <tr>
        <td>
          <div id="totalDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
            <h4>{{ critter.score }}</h4>
            <div v-if="showTotalDetails">
              <div>Generation: {{ critter.generation }}</div>
              <div>Birth Order: {{ critter.id }}</div>
              <div>Total Score: {{ critter.baseScore }}</div>
              <div>Bonus Score: {{ critter.bonusScore }}</div>
            </div>
          </div>
        </td>
        <td>
          <div id="vitalityDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
            <h4>{{ critter.traits[0].value }}</h4>
            <div v-if="showVitalityDetails">
              <div>Base: {{ critter.traits[0].value }}</div>
              <div>Bonus: {{ critter.traits[0].bonus }}</div>
              <div>Value: {{ critter.traits[0].getTrueValue() }}</div>
              <div>Health: {{ critter.maxHealth }}</div>
              <div>Sod Production: {{ critter.sodPerSecond }} per sec.</div>
            </div>
          </div>
        </td>
        <td>
          <div id="strengthDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
            <h4>{{ critter.traits[1].value }}</h4>
            <div v-if="showStrengthDetails">
              <div>Base: {{ critter.traits[1].value }}</div>
              <div>Bonus: {{ critter.traits[1].bonus }}</div>
              <div>Value: {{ critter.traits[1].getTrueValue() }}</div>
              <div>Carrying Capacity: {{ critter.carryPerSecond}} per sec.</div>
            </div>
          </div>
        </td>
        <td>
          <div id="agilityDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
            <h4>{{ critter.traits[2].value }}</h4>
            <div v-if="showAgilityDetails">
              <div>Base: {{ critter.traits[2].value }}</div>
              <div>Bonus: {{ critter.traits[2].bonus }}</div>
              <div>Value: {{ critter.traits[2].getTrueValue() }}</div>
              <div>Speed: {{ critter.actionTimeSeconds }} seconds</div>
            </div>
          </div>
        </td>
        <td>
          <div id="biteDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
            <h4>{{ critter.traits[3].value }}</h4>
            <div v-if="showBiteDetails">
              <div>Base: {{ critter.traits[3].value }}</div>
              <div>Bonus: {{ critter.traits[3].bonus }}</div>
              <div>Value: {{ critter.traits[3].getTrueValue() }}</div>
              <div>Strength Bonus: {{ critter.strengthBonus }}</div>
              <div>Farm Production: {{ critter.grassPerSecond }} per sec.</div>
            </div>
          </div>
        </td>
        <td>
          <div id="stingDetails" @mouseenter="showDetails" @mouseleave="hideDetails">
            <h4>{{ critter.traits[4].value }}</h4>
            <div v-if="showStingDetails">
              <div>Base: {{ critter.traits[4].value }}</div>
              <div>Bonus: {{ critter.traits[4].bonus }}</div>
              <div>Value: {{ critter.traits[4].getTrueValue() }}</div>
              <div>Agility Bonus {{ critter.agilityBonus }}</div>
              <div>Mine Production: {{ critter.dirtPerSecond }} per sec.</div>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
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
      showProgressBar : {
        required: true,
        type: Boolean
      }
    },
    computed: {
      critter() {
        return this.$store.getters.findCritter(this.critterId)
      },
      breedingProgress() {
        return this.critter.progress
      },
      progressBar() {
        return {
          'background-color': this.bgColor,
          'width': this.breedingProgress+'%'
        }
      },
      headerBackground() {
        return {
          'background-color': this.bgColor
        }
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
      showDetails: function(event) {
        this[event.originalTarget.id] = true;
      },
      hideDetails: function(event) {
        this[event.originalTarget.id] = false;
      }
    }
  }
</script>

<style>

</style>
