# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run serve          # Start dev server with hot-reload at http://localhost:8080
npm run build          # Build for production to /dist
```

### Testing
```bash
npm test               # Run all tests (library + components)
npm run test:lib       # Run only library tests (Mocha + Chai)
npm run test:components # Run only Vue component tests (Vitest)
```

**Testing workflow:**
- Use `.only()` to run a specific test exclusively: `describe.only()` or `it.only()`
- Use `.skip()` to skip specific tests: `describe.skip()` or `it.skip()`
- When debugging test failures, isolate the failing test with `.only()` for faster iteration

**Hybrid testing approach:**
- Library tests (143 tests in `/tests/lib/`) use Mocha + Chai + Sinon
- Component tests (34 tests in `/tests/unit/`) use Vitest + Vue Test Utils
- Future: Migrate library tests to Vitest for consistency (see GitHub issues)

**Key testing patterns:**
- All imports must include `.js` extensions (ES modules)
- Use `import data from './file.json' with { type: 'json' }` for JSON imports
- Vitest: Use `expect(...).toBe()` instead of Chai's `expect(...).to.equal()`
- Vitest: Use `vi.spyOn()` instead of Sinon's `sinon.stub()`

## Architecture

### State Management & Game Loop

**Dual-threaded architecture:**
1. **Main thread** (main.js) - Handles UI rendering and Vuex store
2. **Web Worker** (Worker.js) - Runs game logic at 20 ticks/second

**Data flow:**
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

### Vuex Store Architecture

**Store initialization is async** because it loads from IndexedDB:
```javascript
// DON'T: createStore() directly
// DO: Use the async wrapper
getStore((store) => {
  // store is ready to use
});
```

**Key getters:**
- `findCritter(id)` - Searches ALL mound locations (expensive, use sparingly)
- `critters(location, type)` - Get critters in a specific mound
- `allCritters` - All breeding + worker critters (excludes army)
- `allWorkers` - Only worker critters

**Mound structure:** All critters live in "mounds" addressed by `{location, type}`:
- Royal Hatchery: `{location: 'royalHatchery', type: 'mother'|'father'|'female'|'male'}`
- Workers: `{location: 'worker', type: 'mine'|'farm'|'carry'|'factory'}`
- Army: `{location: 'soldiers', type: 'army'}`

### Genetic System

**Three-layer trait system:**
1. **Base value** - Inherited from parents with variance
2. **Genes** - Mutations that add bonuses
3. **Final value** - `base + sum(gene.value for each gene)`

**Gene expression types:**
- `EXPRESSION_NONE (0)` - Gene not present
- `EXPRESSION_RECESSIVE (1)` - Present but value = 0 (can become dominant)
- `EXPRESSION_DOMINANT (2)` - Active with non-zero value

**Breeding inheritance (CritterFactory.breed):**
- Base value: Range from `min(parent bases) ± variance` to `max(parent bases) ± variance`
- Gene expression: Calculated by `GeneHelper.calculateExpression()` - two recessive → recessive, one dominant → coin flip
- Gene value: If both parents have dominant gene, calculate from parent values; otherwise 0

**New gene discovery:** Random chance increases each breeding tick until a mutation occurs. When it does:
1. Pick next unlocked but undeveloped gene, OR
2. Discover a brand new gene (added to `state.unlockedGenes`)

### Resource Production Pipeline

**Four worker types form a production chain:**
```
Mine → Carry → Factory → Sod (currency)
 ↑              ↑
Farm ────────────┘
```

**Production flow (Controller.produceSod):**
1. Miners/farmers produce dirt/grass → stored in buffers
2. Carriers transport resources → factory buffers (limited by carry capacity)
3. Factory consumes equal amounts of dirt+grass → produces Sod
4. Bottleneck: Whichever resource is lower limits factory output

**Why this matters:** When debugging production issues, check:
- Raw production rates (`productionPerSecondRaw`)
- Buffer levels (`dirtStored`, `grassStored`, `factoryDirtStored`, `factoryGrassStored`)
- Carry capacity (if buffers are full, carriers are the bottleneck)

### War Mechanic (INCOMPLETE! ⚠️)

**Current implementation status:** Partially implemented map generation, no combat system

**What happens when you click a nation:**
1. `Nations.vue` calls `store.dispatch('startWar', nationId)`
2. Store creates `new War(Nation.get(nationId))`
3. War constructor creates 20x20 `Map` and generates special tiles
4. War.vue displays the map grid (currently broken)

**Map generation (src/lib/Map.js):**
- Creates 20x20 grid of `Tile` objects
- **Player base** and **enemy base** - Randomly placed at top/bottom (3 tiles from edge)
- **8 treasure tiles** - mine, farm, carry, factory, gene, boost, fort, explore
  - Positioned based on range constraints (see `Treasure.js`)
- **4 artifact tiles** - Randomly placed across map

**Tile system (src/lib/Tile.js):**
- Each tile has: `x`, `y`, `bonus` (name of special tile)
- `isBlocked()` returns true if tile has a bonus (used during generation)
- Constants defined for special types but not used in current implementation

**Known bugs:**
- Store getter `currentMap` returns Map object instead of `map.tiles` array (War.vue:155)
- War.vue template references `tile.danger` which doesn't exist on Tile
- No visual differentiation between tile types (all show as empty)

**NOT implemented (major features missing):**
- ❌ Combat mechanics - No turn-based battle system
- ❌ Critter deployment - Can't send army critters to battle
- ❌ Movement system - No way to move across tiles
- ❌ Damage/health calculations - No combat resolution
- ❌ Victory/defeat conditions - No win/loss logic
- ❌ Rewards - No gene unlocks or bonuses for winning
- ❌ Tile ownership/control - No way to capture tiles
- ❌ Enemy AI - No enemy critters or behavior
- ❌ Visual tile indicators - Can't distinguish tile types

**Related GitHub issues:**
- See war mechanic milestone issues for implementation roadmap

## Migration to Vue 3 (COMPLETE! ✅)

**Status:** Successfully migrated and merged to `main` (tracked in issue #85)

**Completed work:**
- ✅ Vue 3.4.0 + Vuex 4.1.0 installed and configured
- ✅ ES modules migration complete (all `.js` and `.vue` extensions added throughout codebase)
- ✅ All 143 library tests passing (Mocha + Chai 5)
- ✅ All 34 component tests passing (Vitest)
- ✅ Store converted to Vuex 4 API (`createStore`, async initialization)
- ✅ Bootstrap-Vue → Bootstrap-Vue-Next component migration complete (all 27 instances)
- ✅ Worker.js converted to ES module format (`self.onmessage`/`self.postMessage`)
- ✅ Component tests migrated from Mocha to Vitest
- ✅ Component tests updated to Vue 3 Test Utils API (remove `createLocalVue`, use `global.plugins`)
- ✅ babel.config.js converted to ES module format (`export default`)
- ✅ main.js fixed to use correct Bootstrap-Vue-Next import
- ✅ Progress bar fixed (`:value` → `:model-value`)
- ✅ Removed mochapack dependencies (incompatible with Vue 3 + ES modules)
- ✅ vitest.config.js created and configured
- ✅ Upgraded Chai from v4 to v5 and added sinon/sinon-chai dependencies
- ✅ Updated all library tests to use Chai 5 named exports
- ✅ Component tests use shallowMount auto-stubbing (no explicit stub configuration needed)
- ✅ **App compiles, runs, and all tests pass!**
- ✅ **Merged to main via multiple PRs**

**Test status:**
- Library tests: 143/143 passing ✅
- Component tests: 34/34 passing ✅
- Total: 177/177 tests passing ✅

**Follow-up issues (non-blocking quality improvements):**
- Issue #97: Component tests show "Failed to resolve component" warnings for Bootstrap components
  - Tests pass despite warnings
  - Warnings are harmless but clutter test output
- Issue #98: HTML validation warnings in HowTo.vue during build
  - Invalid `<ol>` nested in `<p>` tag
  - Missing `<tbody>` in tables
  - App runs correctly despite warnings
- Issue #102: Critter stat color indicators not working in Royal Hatchery
  - Green/red indicators for better/worse stats not displaying
  - Needs tests to prevent regression
  - Pre-existing bug, not caused by migration

**Bootstrap-Vue-Next component mapping:**
- `<b-button>` → `<BButton>`
- `<b-tabs>` → `<BTabs>`
- `<b-tab>` → `<BTab>`
- `<b-popover>` → `<BPopover>`
- `<b-progress>` → `<BProgress>` (use `:model-value` instead of `:value`)
- `<b-dropdown>` → `<BDropdown>`
- Event handlers: `v-on:click` → `@click`

## Common Patterns

### Creating a new critter
```javascript
// In main thread (Vuex action):
const child = CritterFactory.breed(id, mother, father, store);
context.commit('addChildToHatchery', {location, critter: child});

// In Worker thread:
const child = this.breed(state, location);
// (Worker already updates state directly)
```

### Moving critters between mounds
```javascript
context.commit('moveCritter', {
  from: {location: 'royalHatchery', type: 'female'},
  to: {location: 'worker', type: 'mine'}
});
```

### Sorting a mound
```javascript
context.dispatch('sortMound', {
  location: 'royalHatchery',
  type: 'female',
  sortBy: 'score' // or 'base', 'bonus', 'vitality', etc.
});
```

### Persisting state
```javascript
// Manual save (triggered by button):
this.$store.dispatch('saveToStorage');

// State is saved to IndexedDB via LocalForage
// Automatically loaded on next initialization
```

## File Organization Principles

**Component hierarchy:**
- `App.vue` - Tab navigation container
- Tab-level components: `RoyalHatchery.vue`, `Worker.vue`, `Soldiers.vue`, `Achievement.vue`
- Mound components: `BreedingMound.vue`, `HatcheryMound.vue`, `WorkerMound.vue`, `ArmyMound.vue`
- Display components: `Critter.vue`, `CritterHeader.vue`

**Library organization:**
- Entity classes: `Critter.js`, `Trait.js`, `Gene.js`
- Factories: `CritterFactory.js`, `GeneFactory.js`
- Game systems: `Controller.js`, `SodProduction.js`, `Achievement.js`
- Combat: `Nation.js`, `War.js`, `Map.js`
- Data files: `genes.json`, `achievements.json`, `state.json`

## Testing Gotchas

**Store tests require careful setup:**
```javascript
// Always stub LocalForage before using getStore:
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

**Object comparison in assertions:**
- Use `.to.deep.equal()` for comparing object/array structures
- Use `.to.equal()` only for primitives or reference equality
- Use `.to.deep.include()` for checking array membership by structure

**Vuex replaceState caveat:** `store.replaceState(state)` clones the state rather than using the reference. This means:
```javascript
const queen = { id: 'queen' };
mockedState.royalHatchery.mother.critters.push(queen);
store.replaceState(mockedState);

// DON'T: Reference equality fails
expect(store.getters.allCritters).to.include(queen);

// DO: Deep equality works
expect(store.getters.allCritters).to.deep.include(queen);
```
