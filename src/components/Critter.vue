<template>
  <div>
    <BProgress :id="'progressBar-'+critter.id" v-if="showProgressBar" :value="health" :max="maxHealth" show-progress animated striped style="height: 20px; margin-bottom: 10px;"></BProgress>
    <div class="d-flex justify-content-around">
      <div id="totalDetails">
        <div :id="'totalDetails-'+critter.id" :class="scoreClass">{{ critter.score }}</div>
        <BPopover title="Stats" triggers="hover focus" :target="'totalDetails-'+critter.id">
          <div>Generation: {{critter.generation}}</div>
          <div>Birth Order: {{critter.id}}</div>
          <div>Total Score: {{critter.score}}</div>
          <div>Total Base: {{critter.baseScore}}</div>
          <div>Total Bonus: {{critter.bonusScore}}</div>
          <div>Mutations: {{critter.mutations}}</div>
        </BPopover>
      </div>
      <div id="vitalityDetails">
        <div :id="'vitalityDetails-'+critter.id" :class="vitalityClass">{{ critter.traits[0].value }}</div>
        <BPopover title="Stats" triggers="hover focus" :target="'vitalityDetails-'+critter.id">
          <div>Base: {{ critter.traits[0].value }}</div>
          <div>Bonus: {{ critter.traits[0].bonus }}</div>
          <div>Value: {{ critter.traits[0].getTrueValue() }}</div>
          <div>Health: {{ critter.maxHealth }}</div>
          <div>Sod Production: {{ critter.sodPerSecond }} per sec.</div>
        </BPopover>
      </div>
      <div id="strengthDetails">
        <div :id="'strengthDetails-'+critter.id" :class="strengthClass">{{ critter.traits[1].value }}</div>
        <BPopover title="Stats" triggers="hover focus" :target="'strengthDetails-'+critter.id">
          <div>Base: {{ critter.traits[1].value }}</div>
          <div>Bonus: {{ critter.traits[1].bonus }}</div>
          <div>Value: {{ critter.traits[1].getTrueValue() }}</div>
          <div>Carrying Capacity: {{ critter.carryPerSecond}} per sec.</div>
        </BPopover>
      </div>
      <div id="agilityDetails">
        <div :id="'agilityDetails-'+critter.id" :class="agilityClass">{{ critter.traits[2].value }}</div>
        <BPopover title="Stats" triggers="hover focus" :target="'agilityDetails-'+critter.id">
          <div>Base: {{ critter.traits[2].value }}</div>
          <div>Bonus: {{ critter.traits[2].bonus }}</div>
          <div>Value: {{ critter.traits[2].getTrueValue() }}</div>
          <div>Speed: {{ critter.actionTimeSeconds }} seconds</div>
        </BPopover>
      </div>
      <div id="biteDetails">
        <div :id="'biteDetails-'+critter.id" :class="biteClass">{{ critter.traits[3].value }}</div>
        <BPopover title="Stats" triggers="hover focus" :target="'biteDetails-'+critter.id">
          <div>Base: {{ critter.traits[3].value }}</div>
          <div>Bonus: {{ critter.traits[3].bonus }}</div>
          <div>Value: {{ critter.traits[3].getTrueValue(critter.strengthBonus) }}</div>
          <div>Strength Bonus: {{ critter.strengthBonus }}</div>
          <div>Farm Production: {{ critter.grassPerSecond }} per sec.</div>
        </BPopover>
      </div>
      <div id="stingDetails">
        <div :id="'stingDetails-'+critter.id" :class="stingClass">{{ critter.traits[4].value }}</div>
        <BPopover title="Stats" triggers="hover focus" :target="'stingDetails-'+critter.id">
          <div>Base: {{ critter.traits[4].value }}</div>
          <div>Bonus: {{ critter.traits[4].bonus }}</div>
          <div>Value: {{ critter.traits[4].getTrueValue(critter.agilityBonus) }}</div>
          <div>Agility Bonus: {{ critter.agilityBonus }}</div>
          <div>Mine Production: {{ critter.dirtPerSecond }} per sec.</div>
        </BPopover>
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
      },
      parentCritterId: {
        required: true,
        type: Number
      }
    },
    computed: {
      critter() {
        return this.$store.getters.findCritter(this.critterId);
      },
      parentCritter() {
        return this.$store.getters.findCritter(this.parentCritterId);
      },
      health() {
        return this.critter.currentHealth;
      },
      maxHealth() {
        return this.critter.maxHealth;
      },
      scoreClass() {
        if (!this.parentCritter) return '';
        if (this.critter.score > this.parentCritter.score) return 'stat-better';
        if (this.critter.score < this.parentCritter.score) return 'stat-worse';
        return '';
      },
      vitalityClass() {
        if (!this.parentCritter) return '';
        const parentValue = this.parentCritter.traits[0].value;
        if (this.critter.traits[0].value > parentValue) return 'stat-better';
        if (this.critter.traits[0].value < parentValue) return 'stat-worse';
        return '';
      },
      strengthClass() {
        if (!this.parentCritter) return '';
        const parentValue = this.parentCritter.traits[1].value;
        if (this.critter.traits[1].value > parentValue) return 'stat-better';
        if (this.critter.traits[1].value < parentValue) return 'stat-worse';
        return '';
      },
      agilityClass() {
        if (!this.parentCritter) return '';
        const parentValue = this.parentCritter.traits[2].value;
        if (this.critter.traits[2].value > parentValue) return 'stat-better';
        if (this.critter.traits[2].value < parentValue) return 'stat-worse';
        return '';
      },
      biteClass() {
        if (!this.parentCritter) return '';
        const parentValue = this.parentCritter.traits[3].value;
        if (this.critter.traits[3].value > parentValue) return 'stat-better';
        if (this.critter.traits[3].value < parentValue) return 'stat-worse';
        return '';
      },
      stingClass() {
        if (!this.parentCritter) return '';
        const parentValue = this.parentCritter.traits[4].value;
        if (this.critter.traits[4].value > parentValue) return 'stat-better';
        if (this.critter.traits[4].value < parentValue) return 'stat-worse';
        return '';
      }
    },
  }
</script>

<style>
  .stat-better {
    color: #28a745;
    font-weight: bold;
  }

  .stat-worse {
    color: #dc3545;
    font-weight: bold;
  }
</style>
