<template>
  <div>
      <div>
        <h4>How To Play</h4>
        <p>
          <strong>Original Game at <a href="http://yoyz.com/critter/" target="_blank">yoyz.com/critter</a></strong>
        </p>
        <p>
          <strong>Questions & Discussion at <a href="http://www.reddit.com/r/crittermound">www.reddit.com/r/crittermound</a></strong><br />
        </p>
        <p>
          <strong>General</strong><br />
          Breed new critters, breed stronger critters, destroy your enimies.
        </p>

        <p>
          <strong>Quick Guide</strong><br />
        <ol>
          <li>Wait for new critters in the hatchery</li>
          <li>If they are mostly green, use them as King and Queen</li>
          <li>Put red critters to work as a workers</li>
          <li>Put 1 critter to work as a soilder</li>
          <li>Start a war</li>
          <li>Repeat 1 and 2 until you are strong enough to win the war</li>
        </ol>
        </p>

        <p>
          <strong>Hatchery</strong><br />
          The hatcheries are where the King and Queen produce new offspring.  Any egg in the hatchery can become anything, the new King, a Mine Worker, or Military.
          Once assigned a job it can not be changed.  You can tell a building how to prioritize with the dropdown.  It won't change what is produced, just who is kicked out
          when there isn't enough space (the eggs are just tossed out of the mound).  Boost causes an instant mating, and recharges over time.
        </p>

        <p>
          <strong>Traits and Mutations</strong><br />
          The traits vary during each breeding, and are used in various calculations.  In general, a trait varies within it's parents range.  If the mother is 10 and the
          father is 15, then the offspring will be between 9 and 16.  The variance increases as the trait increases.  Randomly, some critters will mutate as they are improved.  Mutation can increase a
          traits value with a bonus.  Mutations breed the same as traits.  You can also find new mutations by going to war.
        </p>
        <p>
          <strong>Vitality</strong><br />
          Vitality controls health, and how well a critter produces sod in the factory
        </p>
        <p>
          <strong>Strength</strong><br />
          Strength gives 50% of it's value as a bonus to bite during battle, and as a worker, controls how much a critter can carry.
        </p>
        <p>
          <strong>Agility</strong><br />
          Agility controls how fast a critter breeds, works, and fighting order.  It also provides 50% of it's value as a bonus to string during battle.
        </p>
        <p>
          <strong>Bite</strong><br />
          Bite is both an attack and defense, it's also how a critter farms grass.
        </p>
        <p>
          <strong>Sting</strong><br />
          Sting is both an attack and defense, it's also how a critter mines dirt.
        </p>
        <p>
          <strong>Bite vs Sting</strong><br />
          These two traits are opposed to eachother.   They are both an attack and they are both a defense.  When each critter attacks it will choose one or the other at random,
          and it's opponet will counter the opposite.  Bite attacks Sting, Sting defends Bite, ect.
        </p>
        <p>
          <strong>Stats</strong><br />
          Stats are calculations made using trait values.  They are what matter in the game.  Health is 15 * Vitality for example.
        </p>

        <strong>Mutation Expression</strong><br />
        <table class="critter">
          <tr>
            <th style="width: 25%">parents</th>
            <th style="width: 25%">none</th>
            <th style="width: 25%">recessive</th>
            <th style="width: 25%">expressed</th>
          </tr>
          <tr><td>None / None</td><td>99%</td><td>1%</td><td>0%</td></tr>
          <tr><td>None / Recessive</td><td>50%</td><td>50%</td><td>0%</td></tr>
          <tr><td>None / Expressed</td><td>0%</td><td>100%</td><td>0%</td></tr>
          <tr><td>Recessive / Recessive</td><td>25%</td><td>50%</td><td>25%</td></tr>
          <tr><td>Recessive / Expressed</td><td>0%</td><td>50%</td><td>50%</td></tr>
          <tr><td>Expressed / Expressed</td><td>0%</td><td>0%</td><td>100%</td></tr>
        </table>

        <p>
          <strong>Workers</strong><br />
          When a critter is promoted to a worker, he is assigned to the job where he is currently needed most, that he can help in.  If the mine needs help the most, that is where he will
          go if he can improve the mines production.  If he can't help at the bottle neck, he goes where he can help.  If he can't help he... leaves the colony and goes to... somewhere else.
          If you have 100 strength and a 20 second speed, you'll mine 100 dirt every 20 seconds.
        </p>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
