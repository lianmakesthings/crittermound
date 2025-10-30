# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Quick Reference

- **📋 Project Roadmap:** See [ROADMAP.md](ROADMAP.md) for complete development plan, milestones, and issue tracking
- **🏗️ Architecture:** See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details, design patterns, and system architecture
- **📖 Setup & Usage:** See [README.md](README.md) for installation, development commands, and contribution guidelines

## Documentation Strategy

This project maintains four core documentation files, each with a specific purpose:

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical implementation details, design patterns, system architecture
- **[CLAUDE.md](CLAUDE.md)** (this file) - Quick reference guide for Claude Code AI assistant
- **[ROADMAP.md](ROADMAP.md)** - Development milestones, issue tracking, effort estimates, dependencies
- **[README.md](README.md)** - User-facing setup, usage instructions, contribution guidelines

### Documentation Principles

1. **Cross-Reference, Don't Duplicate** - When information exists in another file, link to it rather than copying it
2. **Single Source of Truth** - Each piece of information should have one canonical location
3. **Easy Access** - Include links liberally to help readers navigate between related topics
4. **Stay DRY** - If you're about to copy content, ask if a link would serve better

### When to Update Which File

- **Architecture changes** → Update [ARCHITECTURE.md](ARCHITECTURE.md), reference from [CLAUDE.md](CLAUDE.md)
- **New milestones/issues** → Update [ROADMAP.md](ROADMAP.md), reference from [CLAUDE.md](CLAUDE.md)
- **User-facing changes** → Update [README.md](README.md), reference from [CLAUDE.md](CLAUDE.md) if needed
- **Claude workflow tips** → Update [CLAUDE.md](CLAUDE.md), link to details in other files

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

**Current Milestone:** Pre-War Quick Wins (56% complete - 5/9 complete, 1 partial, 3 remaining)
**Completed:** ✅ #98, #102, #134, #138, #144
**In Progress:** #151 (Sacrifice button - 2/5 sub-issues complete: #152, #153)
**Remaining:** #162 (Production color coding), #170 (Total production display), #177 (Boost button bug)
**Test Status:** All 177 tests passing ✅ (143 library + 34 component)

For complete milestone breakdown, issue status, and effort estimates, see **[ROADMAP.md](ROADMAP.md)**.

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

See [ROADMAP.md - Parent Issues](ROADMAP.md#parent-issues-trackingorganization) for the complete list of parent issues with their sub-issues.

## Key Architecture Patterns

*For complete technical details, see [ARCHITECTURE.md](ARCHITECTURE.md)*

**Quick reminders:**
- **Dual-threaded:** Main thread (UI) + Worker thread (game loop at 20 ticks/second)
- **Mound addressing:** All critters use `{location, type}` system
- **Store init:** Async via `getStore(callback)` to load from IndexedDB
- **ES modules:** All imports need `.js` extensions
- **JSON imports:** Use `import data from './file.json' with { type: 'json' }`

For detailed patterns including code examples, see [ARCHITECTURE.md](ARCHITECTURE.md).

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

### Updating Documentation
When making changes, follow the [Documentation Strategy](#documentation-strategy) to avoid redundancy:
- **Architecture changes** → Update [ARCHITECTURE.md](ARCHITECTURE.md)
- **New milestones/issues** → Update [ROADMAP.md](ROADMAP.md)
- **User-facing changes** → Update [README.md](README.md)
- Cross-reference rather than duplicate content

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

For known bugs and planned enhancements, see **[ROADMAP.md](ROADMAP.md)** which tracks all issues organized by milestone and priority.

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

Follow the [Documentation Strategy](#documentation-strategy) principles when updating docs. Always commit documentation updates separately from code changes when possible.
