# Crittermound Architecture

This document describes the technical architecture, design patterns, and key implementation details of the Crittermound game.

## Table of Contents
- [State Management & Game Loop](#state-management--game-loop)
- [Vuex Store Architecture](#vuex-store-architecture)
- [Genetic System](#genetic-system)
- [Resource Production Pipeline](#resource-production-pipeline)
- [War Mechanic](#war-mechanic)
- [Common Patterns](#common-patterns)
- [File Organization](#file-organization)
- [Testing Patterns](#testing-patterns)

---

## State Management & Game Loop

### Dual-Threaded Architecture

**Main Thread** (main.js) - Handles UI rendering and Vuex store
**Web Worker Thread** (Worker.js) - Runs game logic at 20 ticks/second

**Data Flow:**
```
Main Thread                 Web Worker Thread
-----------                 -----------------
Vuex Store  ─────────────>  Controller.checkTick()
    │       (postMessage)        │
    │                            │ (game logic: breeding,
    │                            │  health regen, production)
    │       <─────────────       │
    └─── (updates)         (returns changes)
         updateData action
```

The Worker receives full game state, calculates one tick of changes, and sends back a delta object containing only what changed (critters, production stats, sod amount). This keeps the UI responsive during calculations.

**Why this matters:** When modifying game logic, changes must be made in both:
- `src/lib/Controller.js` (Worker calculations)
- `src/store/store.js` (Vuex mutations/actions that apply those changes)

---

## Vuex Store Architecture

### Async Initialization

**Store initialization is async** because it loads from IndexedDB:
```javascript
// DON'T: createStore() directly
// DO: Use the async wrapper
getStore((store) => {
  // store is ready to use
  createApp(App).use(store).mount('#app');
});
```

### Key Getters

- `findCritter(id)` - Searches ALL mound locations (expensive, use sparingly)
- `critters(location, type)` - Get critters in a specific mound
- `allCritters` - All breeding + worker critters (excludes army)
- `allWorkers` - Only worker critters
- `mound(location, type)` - Get mound structure for specific location/type

### Mound Structure

All critters live in "mounds" addressed by `{location, type}`:

**Royal Hatchery:**
- `{location: 'royalHatchery', type: 'mother'}` - Queen's breeding mound
- `{location: 'royalHatchery', type: 'father'}` - King's breeding mound
- `{location: 'royalHatchery', type: 'female'}` - Female offspring hatchery
- `{location: 'royalHatchery', type: 'male'}` - Male offspring hatchery

**Workers:**
- `{location: 'worker', type: 'mine'}` - Mining critters (produce dirt)
- `{location: 'worker', type: 'farm'}` - Farming critters (produce grass)
- `{location: 'worker', type: 'carry'}` - Carrier critters (transport resources)
- `{location: 'worker', type: 'factory'}` - Factory workers (produce sod)

**Army:**
- `{location: 'soldiers', type: 'army'}` - Combat critters

---

## Genetic System

### Three-Layer Trait System

1. **Base value** - Inherited from parents with variance
2. **Genes** - Mutations that add bonuses
3. **Final value** - `base + sum(gene.value for each gene)`

**Example:**
```javascript
Vitality base: 10
Genes: [
  { name: "Thick Carapace", expression: 2, value: 5 },
  { name: "Regeneration", expression: 1, value: 0 }
]
Final vitality: 10 + 5 + 0 = 15
```

### Gene Expression Types

- `EXPRESSION_NONE (0)` - Gene not present
- `EXPRESSION_RECESSIVE (1)` - Present but value = 0 (can become dominant in offspring)
- `EXPRESSION_DOMINANT (2)` - Active with non-zero value

### Breeding Inheritance (CritterFactory.breed)

**Base value:**
- Range from `min(parent bases) ± variance` to `max(parent bases) ± variance`
- Variance increases as base value increases

**Gene expression:**
- Calculated by `GeneHelper.calculateExpression()`
- Follows Mendelian genetics:
  - None + None → 99% none, 1% recessive
  - None + Recessive → 50% none, 50% recessive
  - Recessive + Recessive → 25% none, 50% recessive, 25% dominant
  - Recessive + Dominant → 50% recessive, 50% dominant
  - Dominant + Dominant → 100% dominant

**Gene value:**
- If both parents have dominant gene, calculate from parent values
- Otherwise value = 0 (recessive or absent)

### New Gene Discovery

Random chance increases each breeding tick until a mutation occurs. When it does:
1. Pick next unlocked but undeveloped gene, OR
2. Discover a brand new gene (added to `state.unlockedGenes`)

**Mutation Expression Table:**

| Parents | None | Recessive | Dominant |
|---------|------|-----------|----------|
| None / None | 99% | 1% | 0% |
| None / Recessive | 50% | 50% | 0% |
| None / Dominant | 0% | 100% | 0% |
| Recessive / Recessive | 25% | 50% | 25% |
| Recessive / Dominant | 0% | 50% | 50% |
| Dominant / Dominant | 0% | 0% | 100% |

---

## Resource Production Pipeline

### Four Worker Types Form a Production Chain

```
Mine → Dirt Storage → Carry → Factory ← Carry ← Grass Storage ← Farm
                                  ↓
                                 Sod (currency)
```

### Production Flow (Controller.produceSod)

1. **Miners/farmers** produce dirt/grass → stored in buffers
2. **Carriers** transport resources → factory buffers (limited by carry capacity)
3. **Factory** consumes equal amounts of dirt+grass → produces Sod
4. **Bottleneck:** Whichever resource is lower limits factory output

### Key Production Properties

**Raw Production (per worker):**
- `dirtPerSecond` - Mining rate (based on Sting trait)
- `grassPerSecond` - Farming rate (based on Bite trait)
- `carryPerSecond` - Transport capacity (based on Strength trait)
- `sodPerSecond` - Factory output (based on Vitality trait)

**Storage Buffers:**
- `dirtStored` - Mine output buffer
- `grassStored` - Farm output buffer
- `factoryDirtStored` - Factory input buffer (dirt)
- `factoryGrassStored` - Factory input buffer (grass)

**Why this matters:** When debugging production issues, check:
- Raw production rates (`productionPerSecondRaw`)
- Buffer levels (dirt/grass stored values)
- Carry capacity (if buffers are full, carriers are the bottleneck)

### Worker Allocation (SodProduction.js)

When a critter is promoted to worker, they're assigned to the job where needed most:
1. Identify current production bottleneck
2. Check if new worker can help at bottleneck
3. If yes, assign there; if no, assign where they can help most
4. If they can't help anywhere, they leave the colony

**Example:**
- 100 Strength, 20 second speed → mines 100 dirt every 20 seconds
- Factory needs dirt more than grass → assign to mine
- Carriers can't keep up → assign to carry

---

## War Mechanic

### Implementation Status

⚠️ **INCOMPLETE - Partially implemented map generation, no combat system**

### What Works

**Map Generation (Map.js):**
- Creates 20x20 grid of `Tile` objects
- **Player base** and **enemy base** - Randomly placed at top/bottom (3 tiles from edge)
- **8 treasure tiles** - mine, farm, carry, factory, gene, boost, fort, explore
  - Positioned based on range constraints (see `Treasure.js`)
- **4 artifact tiles** - Randomly placed across map

**Tile System (Tile.js):**
- Each tile has: `x`, `y`, `bonus` (name of special tile)
- `isBlocked()` returns true if tile has a bonus (used during generation)
- Constants defined for special types but not fully implemented

**Adjacency Rules (IMPORTANT):**
- Tiles are adjacent only in **cardinal directions** (up, down, left, right)
- Diagonal tiles are **NOT** considered adjacent
- Each tile has max 4 adjacent tiles (2 for corners, 3 for edges, 4 for interior)

**Fog of War Mechanic:**
- At war start: Only player base tile + adjacent tiles (4 cardinal) are visible
- Special tiles (enemy base, treasures) are hidden until revealed
- As player captures tiles: Adjacent tiles become visible
- Players must explore to discover map features

### What Doesn't Work

**Known bugs:**
- Store getter `currentMap` returns Map object instead of `map.tiles` array
  - Causes War.vue to render 3×20 grid instead of 20×20
- War.vue template references `tile.danger` which doesn't exist on Tile
- No visual differentiation between tile types
- No fog of war implementation (all tiles shown or none shown)

**NOT implemented (major features missing):**
- ❌ Fog of war / tile visibility system
- ❌ Combat mechanics - No turn-based battle system
- ❌ Critter deployment - Can't send army critters to battle
- ❌ Movement/exploration system - No way to move across tiles
- ❌ Damage/health calculations - No combat resolution
- ❌ Victory/defeat conditions - No win/loss logic
- ❌ Rewards - No gene unlocks or bonuses for winning
- ❌ Tile ownership/control - No way to capture tiles
- ❌ Enemy AI - No enemy critters or behavior
- ❌ Visual tile indicators - Can't distinguish tile types

**Related GitHub issues:** See war mechanic milestone issues for implementation roadmap

---

## Common Patterns

### Creating a New Critter

```javascript
// In main thread (Vuex action):
const child = CritterFactory.breed(id, mother, father, store);
context.commit('addChildToHatchery', {location, critter: child});

// In Worker thread:
const child = this.breed(state, location);
// (Worker already updates state directly)
```

### Moving Critters Between Mounds

```javascript
context.commit('moveCritter', {
  from: {location: 'royalHatchery', type: 'female'},
  to: {location: 'worker', type: 'mine'}
});
```

### Sorting a Mound

```javascript
context.dispatch('sortMound', {
  location: 'royalHatchery',
  type: 'female',
  sortBy: 'score' // or 'base', 'bonus', 'vitality', etc.
});
```

### Persisting State

```javascript
// Manual save (triggered by button):
this.$store.dispatch('saveToStorage');

// State is saved to IndexedDB via LocalForage
// Automatically loaded on next initialization
```

---

## File Organization

### Component Hierarchy

- `App.vue` - Tab navigation container
- **Tab-level components:** `RoyalHatchery.vue`, `Worker.vue`, `Soldiers.vue`, `Achievement.vue`
- **Mound components:** `BreedingMound.vue`, `HatcheryMound.vue`, `WorkerMound.vue`, `ArmyMound.vue`
- **Display components:** `Critter.vue`, `CritterHeader.vue`

### Library Organization

- **Entity classes:** `Critter.js`, `Trait.js`, `Gene.js`
- **Factories:** `CritterFactory.js`, `GeneFactory.js`
- **Game systems:** `Controller.js`, `SodProduction.js`, `Achievement.js`
- **Combat:** `Nation.js`, `War.js`, `Map.js`, `Tile.js`
- **Data files:** `genes.json`, `achievements.json`, `state.json`

### Component File Structure

```
src/components/
├── App.vue                 # Root with tab navigation
├── Achievement.vue         # Achievement tracker
├── ArmyMound.vue          # Army units display
├── BreedingMound.vue      # Queen/King breeding UI
├── Critter.vue            # Individual critter display
├── CritterHeader.vue      # Column headers for critter lists
├── HatcheryMound.vue      # Offspring nursery
├── HowTo.vue              # Help/tutorial
├── Nations.vue            # Nation selection for war
├── RoyalHatchery.vue      # Royal breeding tab
├── Soldiers.vue           # Army management tab
├── War.vue                # Combat interface
├── Worker.vue             # Production visualization
└── WorkerMound.vue        # Worker management
```

---

## Testing Patterns

### Hybrid Testing Approach

**Library tests** (143 tests in `/tests/lib/`) use Mocha + Chai + Sinon
**Component tests** (34 tests in `/tests/unit/`) use Vitest + Vue Test Utils

**Future:** Migrate library tests to Vitest for consistency (see GitHub issue #95)

### Key Testing Patterns

**All imports must include `.js` extensions** (ES modules):
```javascript
import Critter from '../../src/lib/Critter.js';
```

**JSON imports:**
```javascript
import data from './file.json' with { type: 'json' };
```

**Vitest vs Chai assertions:**
```javascript
// Vitest
expect(...).toBe()           // Use toBe instead of to.equal

// Chai
expect(...).to.equal()
expect(...).to.deep.equal()  // For objects/arrays
```

**Test spies:**
```javascript
// Vitest
vi.spyOn(object, 'method')

// Sinon (Mocha tests)
sinon.stub(object, 'method')
```

### Store Test Setup

Store tests require careful setup because LocalForage is async:

```javascript
beforeEach(() => {
  if (!localforage.config.restore) {
    sinon.stub(localforage, "config");
  }
  if (!localforage.getItem.restore) {
    sinon.stub(localforage, "getItem").returns(Promise.resolve(null));
  }
});

afterEach(() => {
  if (localforage.config.restore) localforage.config.restore();
  if (localforage.getItem.restore) localforage.getItem.restore();
});
```

### Object Comparison in Assertions

```javascript
// Use deep equality for objects/arrays
expect(obj).to.deep.equal(expectedObj);

// Use deep include for array membership
expect(array).to.deep.include(expectedObject);

// DON'T use reference equality for cloned objects
expect(store.getters.allCritters).to.include(queen);  // ❌ Fails (reference)
expect(store.getters.allCritters).to.deep.include(queen);  // ✅ Works (structure)
```

**Why:** `store.replaceState(state)` clones the state rather than using the reference.

### Test Isolation with `.only()` and `.skip()`

```javascript
// Run only this test (debugging)
describe.only('My Feature', () => { ... });
it.only('should do something', () => { ... });

// Skip this test
describe.skip('Broken Feature', () => { ... });
it.skip('needs fixing', () => { ... });
```

**When debugging test failures:** Isolate the failing test with `.only()` for faster iteration.
