# Crittermound Development Roadmap

**Development strategy:** Strategic interleaving approach - complete quick wins, build war mechanic incrementally with strategic breaks, then tackle infrastructure updates and optional advanced features.

**Total timeline:** 130-179 hours (~13-18 weeks of focused work)
**Core features only:** 113-156 hours (~11-16 weeks) - excludes Advanced Features milestone

## Total Effort Summary

| Milestone | Effort | Issues | Priority | Status |
|-----------|--------|--------|----------|--------|
| [Milestone 1: Pre-War Quick Wins](#milestone-1-pre-war-quick-wins-22-35-hours--critical--56) | 22-35h | 9 | 🔴 Critical | ⏳ 56% |
| [Milestone 2: War Phase 1](#milestone-2-war-phase-1---critical-blocker-3-5-hours--critical--0) | 3-5h | 2 | 🔴 Critical | ❌ 0% |
| [Milestone 3: War Phase 2](#milestone-3-war-phase-2---foundation-properties-3-hours--high--0) | 3h | 3 | 🟡 High | ❌ 0% |
| [Milestone 4: War Phase 3](#milestone-4-war-phase-3---core-systems-12-16-hours--critical--0) | 12-16h | 4 | 🔴 Critical | ❌ 0% |
| [Milestone 5: Test Cleanup Break](#milestone-5-test-cleanup-break-2-4-hours--medium--0) | 2-4h | 1 | 🟢 Medium | ❌ 0% |
| [Milestone 6: War Phase 4](#milestone-6-war-phase-4---ui-layer-12-15-hours--critical--0) | 12-15h | 4 | 🔴 Critical | ❌ 0% |
| [Milestone 7: War Phase 5](#milestone-7-war-phase-5---combat-system-17-21-hours--critical--0) | 17-21h | 4 | 🔴 Critical | ❌ 0% |
| [Milestone 8: War Phase 6](#milestone-8-war-phase-6---rewards-system-6-8-hours--high--0) | 6-8h | 2 | 🟢 High | ❌ 0% |
| [Milestone 9: War Phase 7](#milestone-9-war-phase-7---end-game-11-13-hours--critical--0) | 11-13h | 3 | 🔴 Critical | ❌ 0% |
| **War Total** | **67-85h** | **24** | | **0%** |
| [Milestone 10: Infrastructure Updates](#milestone-10-infrastructure-updates-13-20-hours--high--0) | 13-20h | 2 | 🟡 High | ❌ 0% |
| [Milestone 11: Polish & Enhancement](#milestone-11-polish--enhancement-16-23-hours--low--0) | 16-23h | 6 | 🟢 Low | ❌ 0% |
| [Milestone 12: Advanced Features: Secondary Breeding](#milestone-12-advanced-features---secondary-breeding-line-17-23-hours--low--0) | 17-23h | 5 | 🟢 Low | ❌ 0% |
| **Grand Total** | **130-179h** | **53** | | **~4%** |

---

## Milestone 1: Pre-War Quick Wins (22-35 hours) 🔴 CRITICAL ⏳ 56%
**Status:** 5/9 parent issues complete, 1 partial (2/5 sub-issues)
**Priority:** DO FIRST - Clean slate before major feature work

**Issues:**
- ✅ [#98](https://github.com/lianmakesthings/crittermound/issues/98): Fix HTML validation warnings in HowTo.vue (1h, easy) - **COMPLETE**
- ✅ [#102](https://github.com/lianmakesthings/crittermound/issues/102): Fix critter stat colors bug in Royal Hatchery (4-6h, medium) - **COMPLETE**
- ✅ [#134](https://github.com/lianmakesthings/crittermound/issues/134): Set up GitHub Actions CI for automated testing (2-4h, medium) - **COMPLETE**
- ✅ [#138](https://github.com/lianmakesthings/crittermound/issues/138): Arrows missing in sod production visualization (Workers tab) (2-3h, easy) - **COMPLETE**
- ✅ [#144](https://github.com/lianmakesthings/crittermound/issues/144): Factory full: cannot assign better critters (should replace weakest) (3-4h, medium) - **COMPLETE** - [PR #169](https://github.com/lianmakesthings/crittermound/pull/169)
- 🔄 [#151](https://github.com/lianmakesthings/crittermound/issues/151): Add sacrifice button to remove critters from mounds (4-6h, medium) - **Parent issue** (2/5 sub-issues complete)
  - ✅ [#152](https://github.com/lianmakesthings/crittermound/issues/152): Design sacrifice functionality specification (0.5-1h, easy) - **COMPLETE**
  - ✅ [#153](https://github.com/lianmakesthings/crittermound/issues/153): Implement store action for sacrificing critters (1h, easy) - **COMPLETE** - [PR #167](https://github.com/lianmakesthings/crittermound/pull/167)
  - [#154](https://github.com/lianmakesthings/crittermound/issues/154): Add sacrifice UI button to mound components (1-1.5h, medium)
  - [#155](https://github.com/lianmakesthings/crittermound/issues/155): Add confirmation dialog for sacrifice action (0.5-1h, easy)
  - [#156](https://github.com/lianmakesthings/crittermound/issues/156): Add comprehensive testing for sacrifice functionality (1-1.5h, medium)
- [#162](https://github.com/lianmakesthings/crittermound/issues/162): Color code sod production chain to show bottlenecks (2-4h, medium)
- [#170](https://github.com/lianmakesthings/crittermound/issues/170): Display total sod production in workers tab (1-2h, easy)
- [#177](https://github.com/lianmakesthings/crittermound/issues/177): Boost button only breeds female critters (should breed both) (2-4h, medium)

**Reasoning:** Quick cleanup wins that improve UX and remove build noise. Fixing [#102](https://github.com/lianmakesthings/crittermound/issues/102) adds test coverage that will be valuable during war development. Setting up CI ensures all tests pass before merging, protecting main branch during complex feature development. Restoring production arrows ([#138](https://github.com/lianmakesthings/crittermound/issues/138)) improves visual clarity for understanding resource flow. Factory replacement bug ([#144](https://github.com/lianmakesthings/crittermound/issues/144)) fixes frustrating gameplay issue. Production color coding ([#162](https://github.com/lianmakesthings/crittermound/issues/162)) provides visual feedback on bottlenecks, matching Royal Hatchery patterns. Sacrifice feature ([#151](https://github.com/lianmakesthings/crittermound/issues/151)) adds essential population management capability. Total production display ([#170](https://github.com/lianmakesthings/crittermound/issues/170)) gives players quick production overview. Boost button bug ([#177](https://github.com/lianmakesthings/crittermound/issues/177)) affects core breeding mechanics and player progression.

**Success criteria:**
- ✅ Zero HTML validation warnings in build
- ✅ Critter stats show green/red color indicators correctly
- ✅ Production arrows visible in Workers tab
- ✅ CI workflow runs on all pull requests
- ✅ All 177 tests must pass before merging
- ✅ Factory workers can be replaced with better critters
- Production bottlenecks shown with color indicators (green/red)
- Color coding updates dynamically with production changes
- Sacrifice button allows removing unwanted critters
- King and Queen cannot be sacrificed
- Total sod production displayed prominently in workers tab
- Boost button breeds both male and female critters correctly
- Tests added to prevent regression

---

## Milestone 2: War Phase 1 - Critical Blocker (3-5 hours) 🔴 CRITICAL ❌ 0%
**Status:** 0/2 issues complete
**Priority:** MUST COMPLETE FIRST - Blocks all other war work

**Issues:**
- ❌ [#109](https://github.com/lianmakesthings/crittermound/issues/109): Fix store getter to return map.tiles array (1-2h, easy)
- ❌ [#110](https://github.com/lianmakesthings/crittermound/issues/110): Add component tests for 20×20 grid rendering (2-3h, medium)

**Reasoning:** Current bug renders 3×20 grid instead of 20×20. Cannot develop features on broken foundation.

**Dependencies:** Pre-War Quick Wins
**Blocks:** All other war phases

**Success criteria:**
- currentMap getter returns map.tiles array correctly
- War.vue renders full 20×20 grid
- Component tests verify grid structure

---

## Milestone 3: War Phase 2 - Foundation Properties (3 hours) 🟡 HIGH ❌ 0%
**Status:** 0/3 issues complete
**Priority:** Foundation layer for all future systems

**Issues (all parallelizable):**
- ❌ [#111](https://github.com/lianmakesthings/crittermound/issues/111): Add tile visibility properties (isVisible, isExplored) (1h, easy)
- ❌ [#115](https://github.com/lianmakesthings/crittermound/issues/115): Add danger property (1h, easy)
- ❌ [#119](https://github.com/lianmakesthings/crittermound/issues/119): Add tile state properties (isControlled, hasEnemies, explorable, attackable) (1h, easy)

**Reasoning:** Establishes data model before complex logic. All three can be done in parallel.

**Dependencies:** War Phase 1
**Blocks:** War Phase 3

**Success criteria:**
- Tile class has all required properties
- Properties initialized correctly in Map constructor
- Unit tests verify property behavior

---

## Milestone 4: War Phase 3 - Core Systems (12-16 hours) 🔴 CRITICAL ❌ 0%
**Status:** 0/4 issues complete
**Priority:** Fundamental game logic

**Issues:**
- ❌ [#112](https://github.com/lianmakesthings/crittermound/issues/112): Implement getAdjacentTiles() with cardinal directions (2-3h, medium)
- ❌ [#116](https://github.com/lianmakesthings/crittermound/issues/116): Implement danger calculation algorithm (3-4h, medium)
- ❌ [#113](https://github.com/lianmakesthings/crittermound/issues/113): Implement updateVisibility() for fog of war (3-4h, medium) - depends on [#112](https://github.com/lianmakesthings/crittermound/issues/112)
- ❌ [#118](https://github.com/lianmakesthings/crittermound/issues/118): Implement generateEnemyArmy() method (4-5h, medium) - can parallelize with fog of war

**Reasoning:** Core algorithms that everything else depends on. [#118](https://github.com/lianmakesthings/crittermound/issues/118) can be done in parallel with fog of war work.

**Dependencies:** War Phase 2
**Blocks:** War Phase 4

**Success criteria:**
- Adjacent tiles correctly identified (cardinal only, no diagonals)
- Danger values calculated based on nation difficulty
- Fog of war reveals tiles as player explores
- Enemy armies generated with appropriate difficulty scaling

---

## Milestone 5: Test Cleanup Break (2-4 hours) 🟢 MEDIUM ❌ 0%
**Status:** 0/1 issues complete
**Priority:** Maintenance checkpoint

**Issues:**
- ❌ [#97](https://github.com/lianmakesthings/crittermound/issues/97): Fix Bootstrap component warnings in tests (2-4h, medium)

**Reasoning:** Strategic break after complex fog of war / danger work. Clean up test noise before UI implementation phase. Prevents warning fatigue.

**Dependencies:** War Phase 3
**Optional:** Can be deferred if momentum is strong

**Success criteria:**
- Zero component resolution warnings in test output
- All 177+ tests still passing
- Test output clean and readable

---

## Milestone 6: War Phase 4 - UI Layer (12-15 hours) 🔴 CRITICAL ❌ 0%
**Status:** 0/4 issues complete
**Priority:** Make systems visible to player

**Issues:**
- ❌ [#114](https://github.com/lianmakesthings/crittermound/issues/114): Add fog of war UI styling (3-4h, medium) - depends on [#113](https://github.com/lianmakesthings/crittermound/issues/113)
- ❌ [#117](https://github.com/lianmakesthings/crittermound/issues/117): Add danger display and color coding (2-3h, easy) - depends on [#116](https://github.com/lianmakesthings/crittermound/issues/116)
- ❌ [#120](https://github.com/lianmakesthings/crittermound/issues/120): Implement updateAvailableTiles() logic (3-4h, medium) - depends on [#112](https://github.com/lianmakesthings/crittermound/issues/112)
- ❌ [#121](https://github.com/lianmakesthings/crittermound/issues/121): Add tile interaction UI (click handlers, visual indicators) (3-4h, medium) - depends on [#120](https://github.com/lianmakesthings/crittermound/issues/120)

**Reasoning:** Makes invisible systems visible. UI work is sequential as each builds on previous.

**Dependencies:** War Phase 3

**Success criteria:**
- Hidden tiles displayed with fog of war overlay
- Danger values visible with color coding
- Explorable/attackable tiles clearly indicated
- Click handlers allow tile interaction
- Visual polish matches game aesthetic

---

## Milestone 7: War Phase 5 - Combat System (17-21 hours) 🔴 CRITICAL ❌ 0%
**Status:** 0/4 issues complete
**Priority:** Most complex phase - build carefully

**Issues (sequential):**
- ❌ [#122](https://github.com/lianmakesthings/crittermound/issues/122): Implement combat damage calculation (Bite vs Sting) (4-5h, medium)
- ❌ [#123](https://github.com/lianmakesthings/crittermound/issues/123): Implement combat round resolution (5-6h, hard) - depends on [#122](https://github.com/lianmakesthings/crittermound/issues/122)
- ❌ [#124](https://github.com/lianmakesthings/crittermound/issues/124): Integrate combat into Web Worker tick system (4-5h, hard) - depends on [#123](https://github.com/lianmakesthings/crittermound/issues/123)
- ❌ [#125](https://github.com/lianmakesthings/crittermound/issues/125): Add combat UI (health bars, combat log) (4-5h, medium) - depends on [#124](https://github.com/lianmakesthings/crittermound/issues/124)

**Reasoning:** Combat is core gameplay. Must be built sequentially to ensure correctness.

**Dependencies:** War Phase 4

**Success criteria:**
- Bite vs Sting combat mechanics work correctly
- Turn order, targeting, health tracking functional
- Combat integrated into Worker without performance issues
- UI shows combat state clearly
- Combat feels balanced and strategic

---

## Milestone 8: War Phase 6 - Rewards System (6-8 hours) 🟢 HIGH ❌ 0%
**Status:** 0/2 issues complete
**Priority:** Reward mechanics

**Issues:**
- ❌ [#126](https://github.com/lianmakesthings/crittermound/issues/126): Implement collectTileBonus() for all special tiles (4-5h, medium)
- ❌ [#127](https://github.com/lianmakesthings/crittermound/issues/127): Add bonus collection UI notifications (2-3h, easy) - depends on [#126](https://github.com/lianmakesthings/crittermound/issues/126)

**Reasoning:** Completes gameplay loop: explore → fight → collect → improve. Relatively straightforward after combat complexity.

**Tile bonus types:** Mine/Farm/Carry/Factory boosts, Gene unlocks, Boosts, Fort bonuses, Explore reveals, Artifacts

**Dependencies:** War Phase 5
**Blocks:** War Phase 7

**Success criteria:**
- All special tile types grant correct bonuses
- Bonuses applied to persistent state
- UI notifications show what was collected

---

## Milestone 9: War Phase 7 - End Game (11-13 hours) 🔴 CRITICAL ❌ 0%
**Status:** 0/3 issues complete
**Priority:** Complete the loop

**Issues:**
- ❌ [#128](https://github.com/lianmakesthings/crittermound/issues/128): Implement victory/defeat/retreat detection (3-4h, medium)
- ❌ [#129](https://github.com/lianmakesthings/crittermound/issues/129): Implement endWar store action (3-4h, medium) - depends on [#128](https://github.com/lianmakesthings/crittermound/issues/128)
- ❌ [#130](https://github.com/lianmakesthings/crittermound/issues/130): Add victory/defeat/retreat UI screens (4-5h, medium) - depends on [#129](https://github.com/lianmakesthings/crittermound/issues/129)

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

## Milestone 10: Infrastructure Updates (13-20 hours) 🟡 HIGH ❌ 0%
**Status:** 0/2 issues complete
**Priority:** Technical foundation improvements

**Issues:**
- ❌ [#106](https://github.com/lianmakesthings/crittermound/issues/106): Upgrade to Node.js 24 LTS (5-8h, medium)
- ❌ [#95](https://github.com/lianmakesthings/crittermound/issues/95): Migrate library tests from Mocha to Vitest (8-12h, medium-high)

**Reasoning:** Don't change environment during complex feature development. War mechanic complete = natural time for infrastructure work. Can be done together as "infrastructure week."

**Sequence:** [#106](https://github.com/lianmakesthings/crittermound/issues/106) first (new environment), then [#95](https://github.com/lianmakesthings/crittermound/issues/95) (consolidate testing)

**Dependencies:** War Phase 7
**Can parallelize:** Both issues can be done in same week

**Success criteria:**
- All tests pass on Node.js 24
- All 177 tests migrated to Vitest
- package.json cleaned up (Mocha dependencies removed)
- Single test command: `npm test`
- No deprecation warnings

---

## Milestone 11: Polish & Enhancement (16-23 hours) 🟢 LOW ❌ 0%
**Status:** 0/2 parent issues complete
**Priority:** Quality of life (Victory lap!)

**Issues:**
- ❌ [#96](https://github.com/lianmakesthings/crittermound/issues/96): Add dark mode / night mode support (6-8h, medium)
- ❌ [#145](https://github.com/lianmakesthings/crittermound/issues/145): Save export/import functionality (10-15h, medium-high) - **Parent issue** 0%
  - [#146](https://github.com/lianmakesthings/crittermound/issues/146): Design save export/import system architecture (1-2h, easy)
  - [#147](https://github.com/lianmakesthings/crittermound/issues/147): Implement save export to JSON file (2-3h, medium)
  - [#148](https://github.com/lianmakesthings/crittermound/issues/148): Implement save import from JSON file with validation (3-4h, medium)
  - [#149](https://github.com/lianmakesthings/crittermound/issues/149): Add UI controls for export/import in settings (2-3h, medium)
  - [#150](https://github.com/lianmakesthings/crittermound/issues/150): Add comprehensive testing for save export/import (2-3h, medium)

**Reasoning:** Pure enhancement after major features. Reward project after completing heavy technical work. Fun, user-facing improvements that enhance quality of life.

**Dark Mode Implementation:**
- Bootstrap 5 / Bootstrap-Vue-Next dark mode utilities
- localStorage persistence
- Optional: System preference detection (`prefers-color-scheme`)
- Toggle button in navbar

**Save Export/Import Features:**
- Manual backup of game progress
- Share saves between devices
- Recover from browser data loss
- Share interesting game states with community
- JSON format for transparency and editability

**Dependencies:** Infrastructure Updates (or anytime after war)

**Success criteria:**
- Dark mode toggle works correctly
- All components readable in dark mode
- Preference persisted across sessions
- Smooth transition between modes
- Save export/import works reliably
- Validation prevents corrupted saves
- Clear user feedback for all operations

---

## Milestone 12: Advanced Features - Secondary Breeding Line (17-23 hours) 🟢 LOW ❌ 0%
**Status:** 0/5 issues complete
**Priority:** Optional enhancement for genetic diversity

**Issues:**
- ❌ [#139](https://github.com/lianmakesthings/crittermound/issues/139): Design secondary breeding line system (Princes/Princesses) (2-3h, easy)
- ❌ [#140](https://github.com/lianmakesthings/crittermound/issues/140): Add store support for secondary breeding pair (4-5h, medium)
- ❌ [#141](https://github.com/lianmakesthings/crittermound/issues/141): Add UI components for Princes/Princesses hatchery (5-7h, medium)
- ❌ [#142](https://github.com/lianmakesthings/crittermound/issues/142): Implement breeding logic for secondary breeding line (3-4h, medium)
- ❌ [#143](https://github.com/lianmakesthings/crittermound/issues/143): Integration and polish for secondary breeding line (3-4h, medium)

**Reasoning:** Advanced feature that adds strategic depth by allowing players to maintain multiple breeding lines simultaneously. Princes/Princesses breed independently from King/Queen, enabling experimentation with different genetic strategies.

**Benefits:**
- Genetic diversity: Maintain separate breeding lines for different traits
- Strategic options: Breed for combat in one line, production in another
- Progression depth: Unlockable feature adds mid-game goals
- Replayability: More ways to optimize breeding strategies

**Dependencies:** Can be done anytime after core features complete (War Phase 7 recommended)

**Success criteria:**
- Secondary breeding pair (Prince/Princess) can be promoted
- Secondary breeding produces offspring independently
- Clear visual distinction between breeding lines
- Stat colors compare to correct parent (prince vs king, princess vs queen)
- Save/load compatibility maintained
- Performance acceptable with dual breeding

---

## Parent Issues (Tracking/Organization)
- ❌ [#107](https://github.com/lianmakesthings/crittermound/issues/107): Fix map display bug (parent of [#109](https://github.com/lianmakesthings/crittermound/issues/109), [#110](https://github.com/lianmakesthings/crittermound/issues/110)) - 0%
- ❌ [#108](https://github.com/lianmakesthings/crittermound/issues/108): Fog of war system (parent of [#111](https://github.com/lianmakesthings/crittermound/issues/111), [#112](https://github.com/lianmakesthings/crittermound/issues/112), [#113](https://github.com/lianmakesthings/crittermound/issues/113), [#114](https://github.com/lianmakesthings/crittermound/issues/114)) - 0%
- ❌ [#34](https://github.com/lianmakesthings/crittermound/issues/34): Danger calculation (parent of [#115](https://github.com/lianmakesthings/crittermound/issues/115), [#116](https://github.com/lianmakesthings/crittermound/issues/116), [#117](https://github.com/lianmakesthings/crittermound/issues/117)) - 0%
- ❌ [#31](https://github.com/lianmakesthings/crittermound/issues/31): Enemy generation (parent of [#118](https://github.com/lianmakesthings/crittermound/issues/118)) - 0%
- ❌ [#35](https://github.com/lianmakesthings/crittermound/issues/35): Explorable/attackable tiles (parent of [#119](https://github.com/lianmakesthings/crittermound/issues/119), [#120](https://github.com/lianmakesthings/crittermound/issues/120), [#121](https://github.com/lianmakesthings/crittermound/issues/121)) - 0%
- ❌ [#32](https://github.com/lianmakesthings/crittermound/issues/32): Fighting system (parent of [#122](https://github.com/lianmakesthings/crittermound/issues/122), [#123](https://github.com/lianmakesthings/crittermound/issues/123), [#124](https://github.com/lianmakesthings/crittermound/issues/124), [#125](https://github.com/lianmakesthings/crittermound/issues/125)) - 0%
- ❌ [#36](https://github.com/lianmakesthings/crittermound/issues/36): Collect special tiles (parent of [#126](https://github.com/lianmakesthings/crittermound/issues/126), [#127](https://github.com/lianmakesthings/crittermound/issues/127)) - 0%
- ❌ [#37](https://github.com/lianmakesthings/crittermound/issues/37): End war scenarios (parent of [#128](https://github.com/lianmakesthings/crittermound/issues/128), [#129](https://github.com/lianmakesthings/crittermound/issues/129), [#130](https://github.com/lianmakesthings/crittermound/issues/130)) - 0%
- ❌ [#145](https://github.com/lianmakesthings/crittermound/issues/145): Save export/import functionality (parent of [#146](https://github.com/lianmakesthings/crittermound/issues/146), [#147](https://github.com/lianmakesthings/crittermound/issues/147), [#148](https://github.com/lianmakesthings/crittermound/issues/148), [#149](https://github.com/lianmakesthings/crittermound/issues/149), [#150](https://github.com/lianmakesthings/crittermound/issues/150)) - 0%
- ⏳ [#151](https://github.com/lianmakesthings/crittermound/issues/151): Add sacrifice button to remove critters (parent of [#152](https://github.com/lianmakesthings/crittermound/issues/152), [#153](https://github.com/lianmakesthings/crittermound/issues/153), [#154](https://github.com/lianmakesthings/crittermound/issues/154), [#155](https://github.com/lianmakesthings/crittermound/issues/155), [#156](https://github.com/lianmakesthings/crittermound/issues/156)) - 20%
- ❌ [#162](https://github.com/lianmakesthings/crittermound/issues/162): Color code sod production chain to show bottlenecks (parent of [#163](https://github.com/lianmakesthings/crittermound/issues/163), [#164](https://github.com/lianmakesthings/crittermound/issues/164), [#165](https://github.com/lianmakesthings/crittermound/issues/165), [#166](https://github.com/lianmakesthings/crittermound/issues/166)) - 0%

---
