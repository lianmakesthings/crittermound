# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## GitHub Labels

When creating or updating issues, use these existing labels:
- `bug` - Bug fixes
- `critical` - Critical issues that block development
- `dependencies` - Pull requests that update a dependency file
- `duplicate` - Duplicate issues
- `enhancement` - New features or improvements
- `javascript` - Pull requests that update JavaScript code
- `Testing` - Test-related work
- `wontfix` - Issues that won't be fixed

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
4. War.vue displays the map grid (currently shows 3×20 instead of 20×20)

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

**Adjacency rules (IMPORTANT):**
- Tiles are adjacent only in **cardinal directions** (up, down, left, right)
- Diagonal tiles are **NOT** considered adjacent
- Each tile has max 4 adjacent tiles (2 for corners, 3 for edges, 4 for interior)

**Fog of War mechanic:**
- At war start: Only player base tile + adjacent tiles (4 cardinal) are visible
- Special tiles (enemy base, treasures) are hidden until revealed
- As player captures tiles: Adjacent tiles become visible
- Players must explore to discover map features
- **Unknown:** When/how danger values are shown to player (needs design decision)

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

**Related GitHub issues:**
- See war mechanic milestone issues for implementation roadmap

## Project Milestones & Roadmap

**Development strategy:** Strategic interleaving approach - complete quick wins, build war mechanic incrementally with strategic breaks, then tackle infrastructure updates.

**Total timeline:** 90-120 hours (~9-12 weeks of focused work)

### Milestone 1: Pre-War Quick Wins (7-11 hours) 🔴 CRITICAL
**Priority:** DO FIRST - Clean slate before major feature work

**Issues:**
- [#98](https://github.com/lianmakesthings/crittermound/issues/98): Fix HTML validation warnings in HowTo.vue (1h, easy)
- [#102](https://github.com/lianmakesthings/crittermound/issues/102): Fix critter stat colors bug in Royal Hatchery (4-6h, medium)
- [#134](https://github.com/lianmakesthings/crittermound/issues/134): Set up GitHub Actions CI for automated testing (2-4h, medium)

**Reasoning:** Quick cleanup wins that improve UX and remove build noise. Fixing #102 adds test coverage that will be valuable during war development. Setting up CI ensures all tests pass before merging, protecting main branch during complex feature development.

**Success criteria:**
- Zero HTML validation warnings in build
- Critter stats show green/red color indicators correctly
- Tests added to prevent regression
- CI workflow runs on all pull requests
- All 177 tests must pass before merging

---

### Milestone 2: War Phase 1 - Critical Blocker (3-5 hours) 🔴 CRITICAL
**Priority:** MUST COMPLETE FIRST - Blocks all other war work

**Issues:**
- [#109](https://github.com/lianmakesthings/crittermound/issues/109): Fix store getter to return map.tiles array (1-2h, easy)
- [#110](https://github.com/lianmakesthings/crittermound/issues/110): Add component tests for 20×20 grid rendering (2-3h, medium)

**Reasoning:** Current bug renders 3×20 grid instead of 20×20. Cannot develop features on broken foundation.

**Dependencies:** Pre-War Quick Wins
**Blocks:** All other war phases

**Success criteria:**
- currentMap getter returns map.tiles array correctly
- War.vue renders full 20×20 grid
- Component tests verify grid structure

---

### Milestone 3: War Phase 2 - Foundation Properties (3 hours) 🟡 HIGH
**Priority:** Foundation layer for all future systems

**Issues (all parallelizable):**
- [#111](https://github.com/lianmakesthings/crittermound/issues/111): Add tile visibility properties (isVisible, isExplored) (1h, easy)
- [#115](https://github.com/lianmakesthings/crittermound/issues/115): Add danger property (1h, easy)
- [#119](https://github.com/lianmakesthings/crittermound/issues/119): Add tile state properties (isControlled, hasEnemies, explorable, attackable) (1h, easy)

**Reasoning:** Establishes data model before complex logic. All three can be done in parallel.

**Dependencies:** War Phase 1
**Blocks:** War Phase 3

**Success criteria:**
- Tile has all required properties with sensible defaults
- Unit tests added for new properties

---

### Milestone 4: War Phase 3 - Core Systems (12-16 hours) 🔴 CRITICAL
**Priority:** Core game logic (adjacency, fog of war, danger, enemies)

**Issues:**
- [#112](https://github.com/lianmakesthings/crittermound/issues/112): Implement getAdjacentTiles() with cardinal directions (2-3h, medium)
- [#113](https://github.com/lianmakesthings/crittermound/issues/113): Implement updateVisibility() for fog of war (3-4h, medium) - depends on #112
- [#116](https://github.com/lianmakesthings/crittermound/issues/116): Implement danger calculation algorithm (3-4h, medium)
- [#118](https://github.com/lianmakesthings/crittermound/issues/118): Implement generateEnemyArmy() method (4-5h, medium) - can parallelize with fog of war

**Reasoning:** Establishes core game rules. Natural stopping point after this for strategic break.

**Parallelization:** #118 can be done while working on fog of war (#112, #113)

**Dependencies:** War Phase 2
**Blocks:** War Phase 4

**Success criteria:**
- getAdjacentTiles() returns only cardinal neighbors (max 4)
- Fog of war reveals tiles adjacent to controlled tiles
- Danger values calculated correctly
- Enemy armies generated with appropriate stats

---

### Milestone 5: Test Cleanup Break (2-4 hours) 🟢 MEDIUM
**Priority:** Quality of life - Strategic break before UI-heavy work

**Issues:**
- [#97](https://github.com/lianmakesthings/crittermound/issues/97): Fix component test Bootstrap-Vue warnings (2-4h, low-medium)

**Reasoning:** Mental break after complex core systems. Clean test output before UI development where you'll run component tests frequently.

**Dependencies:** War Phase 3
**Optional:** Can skip if momentum is strong

**Success criteria:**
- Zero Bootstrap component resolution warnings
- All 34 component tests still passing
- Solution doesn't mask real component errors

---

### Milestone 6: War Phase 4 - UI Layer (12-15 hours) 🔴 CRITICAL
**Priority:** Player interface for war systems

**Issues:**
- [#114](https://github.com/lianmakesthings/crittermound/issues/114): Add fog of war UI styling (3-4h, medium) - depends on #113
- [#117](https://github.com/lianmakesthings/crittermound/issues/117): Add danger display and color coding (2-3h, easy) - depends on #116
- [#120](https://github.com/lianmakesthings/crittermound/issues/120): Implement updateAvailableTiles() logic (3-4h, medium) - depends on #112
- [#121](https://github.com/lianmakesthings/crittermound/issues/121): Add tile interaction UI (click handlers, visual indicators) (3-4h, medium) - depends on #120

**Reasoning:** First playable version! Player can explore the map. #117 can parallelize with #120.

**Dependencies:** War Phase 3
**Suggested:** Test Cleanup Break (clean test output before UI work)
**Blocks:** War Phase 5

**Success criteria:**
- Fog of war visually hides unexplored tiles
- Danger values displayed with color coding
- Explorable tiles highlighted for player
- Click handlers work for tile exploration

---

### Milestone 7: War Phase 5 - Combat System (17-21 hours) 🔴 CRITICAL
**Priority:** Core combat mechanics (HARDEST PHASE)

**Issues (sequential):**
- [#122](https://github.com/lianmakesthings/crittermound/issues/122): Implement combat damage calculation (Bite vs Sting) (4-5h, medium)
- [#123](https://github.com/lianmakesthings/crittermound/issues/123): Implement combat round resolution (5-6h, hard) - depends on #122
- [#124](https://github.com/lianmakesthings/crittermound/issues/124): Integrate combat into Web Worker tick system (4-5h, hard) - depends on #123
- [#125](https://github.com/lianmakesthings/crittermound/issues/125): Add combat UI (health bars, combat log) (4-5h, medium) - depends on #124

**Reasoning:** Most technically challenging phase. Combat logic + threading complexity. After this, war is mostly playable.

**Complexity factors:**
- Combat logic is complex (turn order, targeting, stat bonuses)
- Web Worker threading adds complexity
- Must not block UI during long battles
- Needs thorough testing for edge cases

**Dependencies:** War Phase 4
**Blocks:** War Phase 6

**Success criteria:**
- Damage calculated correctly
- Combat rounds resolve properly
- Combat runs in Web Worker without blocking UI
- Health bars update in real-time
- Comprehensive combat tests

---

### Milestone 8: War Phase 6 - Rewards System (6-8 hours) 🟢 HIGH
**Priority:** Reward mechanics

**Issues:**
- [#126](https://github.com/lianmakesthings/crittermound/issues/126): Implement collectTileBonus() for all special tiles (4-5h, medium)
- [#127](https://github.com/lianmakesthings/crittermound/issues/127): Add bonus collection UI notifications (2-3h, easy) - depends on #126

**Reasoning:** Completes gameplay loop: explore → fight → collect → improve. Relatively straightforward after combat complexity.

**Tile bonus types:** Mine/Farm/Carry/Factory boosts, Gene unlocks, Boosts, Fort bonuses, Explore reveals, Artifacts

**Dependencies:** War Phase 5
**Blocks:** War Phase 7

**Success criteria:**
- All special tile types grant correct bonuses
- Bonuses applied to persistent state
- UI notifications show what was collected

---

### Milestone 9: War Phase 7 - End Game (11-13 hours) 🔴 CRITICAL
**Priority:** Complete the loop

**Issues:**
- [#128](https://github.com/lianmakesthings/crittermound/issues/128): Implement victory/defeat/retreat detection (3-4h, medium)
- [#129](https://github.com/lianmakesthings/crittermound/issues/129): Implement endWar store action (3-4h, medium) - depends on #128
- [#130](https://github.com/lianmakesthings/crittermound/issues/130): Add victory/defeat/retreat UI screens (4-5h, medium) - depends on #129

**Reasoning:** Completes war mechanic feature! Critical for game progression (survivors return to army).

**End scenarios:**
- Victory: Captured enemy base, full rewards
- Defeat: All critters killed, minimal rewards
- Retreat: Player exits early, partial rewards

**Dependencies:** War Phase 6
**Completes:** Entire war mechanic feature!

**Success criteria:**
- Victory/defeat/retreat detected correctly
- Rewards calculated correctly for each scenario
- Surviving critters returned to army
- War state cleaned up properly

---

### Milestone 10: Infrastructure Updates (13-20 hours) 🟡 HIGH
**Priority:** Technical foundation improvements

**Issues:**
- [#106](https://github.com/lianmakesthings/crittermound/issues/106): Upgrade to Node.js 24 LTS (5-8h, medium)
- [#95](https://github.com/lianmakesthings/crittermound/issues/95): Migrate library tests from Mocha to Vitest (8-12h, medium-high)

**Reasoning:** Don't change environment during complex feature development. War mechanic complete = natural time for infrastructure work. Can be done together as "infrastructure week."

**Sequence:** #106 first (new environment), then #95 (consolidate testing)

**Dependencies:** War Phase 7
**Can parallelize:** Both issues can be done in same week

**Success criteria:**
- All tests pass on Node.js 24
- All 177 tests migrated to Vitest
- package.json cleaned up (Mocha dependencies removed)
- Single test command: `npm test`
- No deprecation warnings

---

### Milestone 11: Polish & Enhancement (8-11 hours) 🟢 LOW
**Priority:** Quality of life (Victory lap!)

**Issues:**
- [#96](https://github.com/lianmakesthings/crittermound/issues/96): Add dark mode / night mode support (6-8h, medium)
- [#136](https://github.com/lianmakesthings/crittermound/issues/136): Add generation counter to track breeding progress (2-3h, medium)

**Reasoning:** Pure enhancements after major features. Reward project after completing heavy technical work. Fun, user-facing improvements that add polish.

**Features:**
- **Dark mode:** Bootstrap 5 / Bootstrap-Vue-Next dark mode utilities, localStorage persistence, optional system preference detection
- **Generation counter:** Track breeding generations, display in Royal Hatchery, show progression

**Dependencies:** Infrastructure Updates (or anytime after war)

**Success criteria:**
- Dark mode toggle works correctly
- All components readable in dark mode
- Preference persisted across sessions
- Smooth transition between modes
- Generation counter displays and updates correctly
- Generation persists across save/load

---

### Parent Issues (Tracking/Organization)
- [#107](https://github.com/lianmakesthings/crittermound/issues/107): Fix map display bug (parent of #109, #110)
- [#108](https://github.com/lianmakesthings/crittermound/issues/108): Fog of war system (parent of #111, #112, #113, #114)
- [#34](https://github.com/lianmakesthings/crittermound/issues/34): Danger calculation (parent of #115, #116, #117)
- [#31](https://github.com/lianmakesthings/crittermound/issues/31): Enemy generation (parent of #118)
- [#35](https://github.com/lianmakesthings/crittermound/issues/35): Explorable/attackable tiles (parent of #119, #120, #121)
- [#32](https://github.com/lianmakesthings/crittermound/issues/32): Fighting system (parent of #122, #123, #124, #125)
- [#36](https://github.com/lianmakesthings/crittermound/issues/36): Collect special tiles (parent of #126, #127)
- [#37](https://github.com/lianmakesthings/crittermound/issues/37): End war scenarios (parent of #128, #129, #130)

### Total Effort Summary

| Milestone | Effort | Issues | Priority |
|-----------|--------|--------|----------|
| Pre-War Quick Wins | 7-11h | 3 | 🔴 Critical |
| War Phase 1 | 3-5h | 2 | 🔴 Critical |
| War Phase 2 | 3h | 3 | 🟡 High |
| War Phase 3 | 12-16h | 4 | 🔴 Critical |
| Test Cleanup Break | 2-4h | 1 | 🟢 Medium |
| War Phase 4 | 12-15h | 4 | 🔴 Critical |
| War Phase 5 | 17-21h | 4 | 🔴 Critical |
| War Phase 6 | 6-8h | 2 | 🟢 High |
| War Phase 7 | 11-13h | 3 | 🔴 Critical |
| **War Total** | **67-85h** | **24** | |
| Infrastructure Updates | 13-20h | 2 | 🟡 High |
| Polish & Enhancement | 8-11h | 2 | 🟢 Low |
| **Grand Total** | **90-120h** | **29** | |

**Critical Path (longest dependency chain):**
```
Pre-War Quick Wins (#98, #102, #134 - can parallelize) →
#109 → #110 → #112 → #113 → #114 → #120 → #121 → #122 → #123 → #124 → #125 → #128 → #129 → #130
```

**Notes:**
- Pre-War Quick Wins issues (#98, #102, #134) can be done in parallel, but all must complete before War Phase 1
- War Phase 1 depends on CI being set up (#134) to protect main branch during development
- Sequential work (after Pre-War Quick Wins): ~50-60 hours
- Total critical path: ~57-71 hours (including longest Pre-War issue)

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
- whenever you open a PR, make sure you've updated your internal memory and the change was committed to the current branch
- always update roadmap when updating issues