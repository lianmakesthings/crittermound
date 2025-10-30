# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Quick Reference

- **📋 Project Roadmap:** See [ROADMAP.md](ROADMAP.md) for complete development plan, milestones, and issue tracking
- **🏗️ Architecture:** See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details, design patterns, and system architecture
- **📖 Setup & Usage:** See [README.md](README.md) for installation, development commands, and contribution guidelines

## GitHub Labels

When creating or updating issues, use these existing labels:
- `bug` - Something isn't working
- `critical` - Critical issues that block development
- `dependencies` - Pull requests that update a dependency file
- `duplicate` - This issue or pull request already exists
- `enhancement` - New features or improvements
- `javascript` - Pull requests that update JavaScript code
- `nice to have` - Low priority enhancements
- `Testing` - Test-related work
- `ui` - User interface and visual changes
- `wontfix` - This will not be worked on

## Development Commands

### Running the App
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

**Run specific test file:**
```bash
npx vitest run tests/unit/Critter.spec.js
```

## Current Status

### Completed Work ✅
- Vue 3 migration (tracked in [#85](https://github.com/lianmakesthings/crittermound/issues/85))
- All 177 tests passing (143 library + 34 component)
- GitHub Actions CI ([#134](https://github.com/lianmakesthings/crittermound/issues/134))
- HTML validation fixes ([#98](https://github.com/lianmakesthings/crittermound/issues/98))
- Critter stat colors ([#102](https://github.com/lianmakesthings/crittermound/issues/102))

### Current Milestone: Pre-War Quick Wins 🔴

**In Progress:**
- [#138](https://github.com/lianmakesthings/crittermound/issues/138): Arrows missing in sod production visualization
- [#144](https://github.com/lianmakesthings/crittermound/issues/144): Factory worker replacement bug
- [#151](https://github.com/lianmakesthings/crittermound/issues/151): Add sacrifice button (parent of [#152](https://github.com/lianmakesthings/crittermound/issues/152)-[#156](https://github.com/lianmakesthings/crittermound/issues/156))

**Status:** 2/6 parent issues complete, 4 remaining

### Next Up: War Mechanic Implementation 🎯

See [ROADMAP.md](ROADMAP.md) for complete milestone breakdown and effort estimates.

## Issue Management

### Creating Sub-Issues

When creating parent/child issue relationships, use the GitHub GraphQL API:

```bash
# Get issue IDs
parentId=$(gh issue view PARENT_NUMBER --json id --jq ".id")
childId=$(gh issue view CHILD_NUMBER --json id --jq ".id")

# Link child to parent
gh api graphql -H "GraphQL-Features: sub_issues" -f query="
mutation {
  addSubIssue(input: {
    issueId: \"$parentId\"
    subIssueId: \"$childId\"
  }) {
    issue { number }
    subIssue { number }
  }
}"
```

### Parent Issues (Quick Reference)

- [#107](https://github.com/lianmakesthings/crittermound/issues/107): Fix map display bug
- [#108](https://github.com/lianmakesthings/crittermound/issues/108): Fog of war system
- [#34](https://github.com/lianmakesthings/crittermound/issues/34): Danger calculation
- [#31](https://github.com/lianmakesthings/crittermound/issues/31): Enemy generation
- [#35](https://github.com/lianmakesthings/crittermound/issues/35): Explorable/attackable tiles
- [#32](https://github.com/lianmakesthings/crittermound/issues/32): Fighting system
- [#36](https://github.com/lianmakesthings/crittermound/issues/36): Collect special tiles
- [#37](https://github.com/lianmakesthings/crittermound/issues/37): End war scenarios
- [#145](https://github.com/lianmakesthings/crittermound/issues/145): Save export/import functionality
- [#151](https://github.com/lianmakesthings/crittermound/issues/151): Add sacrifice button

## Key Architecture Patterns

*Full details in [ARCHITECTURE.md](ARCHITECTURE.md)*

### Dual-Threaded Design
- **Main thread:** Vue.js UI + Vuex store
- **Worker thread:** Game loop (20 ticks/second), breeding, production

### Mound Addressing
All critters exist in mounds with `{location, type}`:
- `{location: 'royalHatchery', type: 'mother'}` - Queen
- `{location: 'royalHatchery', type: 'female'}` - Female offspring
- `{location: 'worker', type: 'mine'}` - Mining workers
- `{location: 'soldiers', type: 'army'}` - Army units

### Store Initialization (Async)
```javascript
import { getStore } from './store/store.js';

getStore((store) => {
  // Store loaded from IndexedDB, ready to use
  createApp(App).use(store).mount('#app');
});
```

### Testing Patterns
- **Library tests:** Mocha + Chai + Sinon (143 tests)
- **Component tests:** Vitest + Vue Test Utils (34 tests)
- **ES modules:** All imports need `.js` extensions
- **JSON imports:** `import data from './file.json' with { type: 'json' }`

## Common Tasks

### Creating a New Issue
```bash
gh issue create --title "Title" --label "enhancement" --milestone "Milestone Name" --body "Description"
```

**Note:** Don't auto-assign issues to user unless explicitly requested.

### Running Tests for Specific Component
```bash
npx vitest run tests/unit/ComponentName.spec.js
```

### Linking Issues as Sub-Issues
See "Creating Sub-Issues" section above.

### Updating Roadmap
When adding/modifying issues:
1. Update [ROADMAP.md](ROADMAP.md) with issue links and effort estimates
2. Update milestone totals
3. Commit with descriptive message

### Updating Architecture Documentation
When changing system design or adding new patterns:
1. Update [ARCHITECTURE.md](ARCHITECTURE.md) in appropriate section
2. Add code examples if helpful
3. Document gotchas and common mistakes
4. Commit with descriptive message

## Migration Notes (Vue 3) ✅

**Production flow (Controller.produceSod):**
1. Miners/farmers produce dirt/grass → stored in buffers
2. Carriers transport resources → factory buffers (limited by carry capacity)
3. Factory consumes equal amounts of dirt+grass → produces Sod
4. Bottleneck: Whichever resource is lower limits factory output

**Why this matters:** When debugging production issues, check:
- Raw production rates (`productionPerSecondRaw`)
- Buffer levels (`dirtStored`, `grassStored`, `factoryDirtStored`, `factoryGrassStored`)
- Carry capacity (if buffers are full, carriers are the bottleneck)

**Bottleneck detection and color coding:**

A bottleneck occurs when output exceeds input capacity. For example, if carry capacity per second is higher than farm production per second, carriers are idle waiting for resources (farm is the bottleneck).

Color coding rules:
- **Red (bottleneck):** Output > Input - The downstream process is starved because upstream can't keep up
- **Green (no bottleneck):** Input > Output - The upstream process is producing more than downstream can consume
- **Neutral:** Input = Output - Production is balanced

Examples:
- If farm production (input) < carry capacity (output) → Farm shows red (bottleneck)
- If mine production (input) > carry capacity (output) → Mine shows green (excess capacity)
- If factory consumption rate = resource delivery rate → Factory shows neutral

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

## Follow-up Issues

**Known bugs/improvements:**
- [#97](https://github.com/lianmakesthings/crittermound/issues/97): Component tests show "Failed to resolve component" warnings (harmless but clutters output)
- [#138](https://github.com/lianmakesthings/crittermound/issues/138): Arrows missing in sod production visualization
- [#144](https://github.com/lianmakesthings/crittermound/issues/144): Factory worker replacement when full

**Planned enhancements:**
- [#95](https://github.com/lianmakesthings/crittermound/issues/95): Migrate all tests to Vitest (consolidate testing framework)
- [#96](https://github.com/lianmakesthings/crittermound/issues/96): Add dark mode support
- [#106](https://github.com/lianmakesthings/crittermound/issues/106): Upgrade to Node.js 24 LTS
- [#136](https://github.com/lianmakesthings/crittermound/issues/136): Show generation counter
- [#145](https://github.com/lianmakesthings/crittermound/issues/145): Save export/import functionality

## Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `claude-memory` - Memory and documentation updates
- Feature branches - Named after issue number (e.g., `102-critter-stat-colors-not-showing-in-royal-hatchery-greenred-indicators`)

### Commit Message Format
```
type: short description

- Detailed change 1
- Detailed change 2
- Related issue references

Optional body with more context
```

**Types:** `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

### Pull Request Workflow
1. Create feature branch
2. Make changes with tests
3. Ensure all tests pass (`npm test`)
4. Commit changes
5. Push to remote
6. Create PR with description linking issues
7. Wait for CI to pass
8. Merge when ready

## Documentation Updates

When updating project documentation:
- **ROADMAP.md** - Milestones, issues, effort estimates, dependencies
- **ARCHITECTURE.md** - Technical patterns, system design, code examples
- **README.md** - User-facing setup, usage, contribution guide
- **CLAUDE.md** (this file) - Quick reference for Claude Code

**Always commit documentation updates separately from code changes when possible.**
