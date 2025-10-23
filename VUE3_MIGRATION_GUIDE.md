# Vue 3 Migration Guide for Crittermound

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Migration Scope](#migration-scope)
3. [Prerequisites](#prerequisites)
4. [Phase 1: Dependency Updates](#phase-1-dependency-updates)
5. [Phase 2: Bootstrap-Vue Migration](#phase-2-bootstrap-vue-migration)
6. [Phase 3: Vuex/Pinia Migration](#phase-3-vuexpinia-migration)
7. [Phase 4: Component Migration](#phase-4-component-migration)
8. [Phase 5: Web Worker Updates](#phase-5-web-worker-updates)
9. [Phase 6: Testing & Validation](#phase-6-testing--validation)
10. [Phase 7: Optimization](#phase-7-optimization)
11. [Rollback Plan](#rollback-plan)
12. [Additional Resources](#additional-resources)

---

## Executive Summary

### Current State
- **Vue**: 2.6.11
- **Vuex**: 3.5.1
- **Bootstrap-Vue**: 2.16.0
- **Vue CLI**: 4.4.6
- **Components**: 14 Vue components
- **Testing**: Mocha + Chai + @vue/test-utils

### Target State
- **Vue**: 3.x (latest stable)
- **State Management**: Vuex 4 or Pinia (recommended)
- **UI Library**: BootstrapVue Next or Bootstrap 5 + native components
- **Build Tool**: Vite (recommended) or Vue CLI 5
- **Testing**: Vitest (recommended) or upgraded @vue/test-utils

### Good News
Your codebase is **well-suited for migration**:
- ✅ No lifecycle hooks to convert
- ✅ No Vue.prototype extensions
- ✅ No global filters or directives
- ✅ No event bus patterns
- ✅ No $set/$delete usage
- ✅ No Vue Router to migrate
- ✅ Clean Options API components

### Challenges
- ⚠️ Bootstrap-Vue 2 incompatible with Vue 3 (26+ component instances)
- ⚠️ worker-loader needs replacement with native ES modules
- ⚠️ Vuex 3 → Vuex 4 or Pinia migration required
- ⚠️ Test utilities need updating

### Estimated Timeline
- **Minimum**: 26-35 hours (Vuex 4 + BootstrapVue Next)
- **Recommended**: 32-42 hours (Pinia + BootstrapVue Next)
- **With Vite migration**: Add 4-6 hours

---

## Migration Scope

### Files Requiring Changes

#### Core Application Files (5 files)
1. `/src/main.js` - App initialization, Vue 3 API
2. `/src/App.vue` - Root component
3. `/src/Worker.js` - Web Worker ES module conversion
4. `/package.json` - Dependency updates
5. `/babel.config.js` - Configuration updates (if staying with Vue CLI)

#### Store Files (1 file)
6. `/src/store/store.js` - Vuex 4 or Pinia migration

#### Components (14 files)
7. `/src/components/RoyalHatchery.vue`
8. `/src/components/BreedingMound.vue`
9. `/src/components/HatcheryMound.vue` - **Most complex**
10. `/src/components/Critter.vue`
11. `/src/components/CritterHeader.vue`
12. `/src/components/Worker.vue`
13. `/src/components/WorkerMound.vue`
14. `/src/components/Soldiers.vue`
15. `/src/components/ArmyMound.vue`
16. `/src/components/Nations.vue`
17. `/src/components/War.vue`
18. `/src/components/Achievement.vue`
19. `/src/components/HowTo.vue`

#### Test Files (22 files)
20-41. All test files in `/tests/lib/*.spec.js` (13 files)
42-50. All test files in `/tests/unit/*.spec.js` (9 files)

### Bootstrap-Vue Component Instances to Replace (26+)
- `b-button` (7 instances)
- `b-tabs` / `b-tab` (6 instances)
- `b-popover` (6 instances)
- `b-card` (1 instance)
- `b-dropdown` (1 instance)
- `b-alert` (1 instance)
- `b-progress` (1 instance)

---

## Prerequisites

### 1. Backup Your Work
```bash
# Create a new branch for migration
git checkout -b vue3-migration

# Or create a complete backup
git tag pre-vue3-migration
git push origin pre-vue3-migration
```

### 2. Update Node.js
Vue 3 requires Node.js 12.0.0 or higher (16.x+ recommended):
```bash
node --version  # Should be v16.x or higher
```

### 3. Ensure Tests Pass
```bash
npm test  # All tests should pass before starting
```

### 4. Document Current State
```bash
# Save current dependency tree
npm list --depth=0 > pre-migration-deps.txt
```

---

## Phase 1: Dependency Updates

**Estimated Time**: 2-3 hours

### Option A: Vue CLI 5 (Conservative Approach)

#### Step 1.1: Update package.json

Replace the dependencies section:

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vuex": "^4.1.0",
    "bootstrap": "^5.3.0",
    "bootstrap-vue-next": "^0.15.0",
    "core-js": "^3.35.0",
    "localforage": "^1.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@vue/cli-plugin-babel": "^5.0.8",
    "@vue/cli-plugin-unit-mocha": "^5.0.8",
    "@vue/cli-plugin-vuex": "^5.0.8",
    "@vue/cli-service": "^5.0.8",
    "@vue/test-utils": "^2.4.3",
    "chai": "^4.4.0",
    "esm": "^3.2.25",
    "mocha": "^10.2.0",
    "sinon": "^17.0.1",
    "sinon-chai": "^3.7.0",
    "@vue/compiler-sfc": "^3.4.0"
  }
}
```

#### Step 1.2: Remove worker-loader

Remove `"worker-loader": "^2.0.0"` - we'll use native ES modules instead.

#### Step 1.3: Install dependencies

```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Install new dependencies
npm install

# Check for peer dependency issues
npm ls
```

### Option B: Migrate to Vite (Recommended, Modern Approach)

#### Step 1.1: Install Vite

```bash
npm install -D vite @vitejs/plugin-vue
```

#### Step 1.2: Create vite.config.js

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  worker: {
    format: 'es'
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
```

#### Step 1.3: Update package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:lib": "vitest run tests/lib",
    "test:components": "vitest run tests/unit"
  }
}
```

#### Step 1.4: Move index.html to root

Vite requires `index.html` at the project root, not in `/public`:

```bash
mv public/index.html .
```

Update `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crittermound</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

---

## Phase 2: Bootstrap-Vue Migration

**Estimated Time**: 1.5-2 hours

### Option A: BootstrapVue Next (Easier)

BootstrapVue Next is the official Vue 3 port, though still in development.

#### Step 2.1: Install

```bash
npm install bootstrap-vue-next
```

#### Step 2.2: Update main.js

Replace Bootstrap-Vue imports:

```javascript
// OLD (Vue 2)
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

// NEW (Vue 3)
import { createBootstrap } from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

// In createApp chain:
app.use(createBootstrap())
```

#### Step 2.3: Update component imports (if using individual imports)

Most components have similar names, but check the [BootstrapVue Next docs](https://github.com/bootstrap-vue-next/bootstrap-vue-next).

### Option B: Native Bootstrap 5 + Custom Components (More Control)

If you want more control and fewer dependencies:

#### Step 2.1: Install Bootstrap 5

```bash
npm install bootstrap @popperjs/core
```

#### Step 2.2: Replace Bootstrap-Vue components

You'll need to create wrapper components for:
- Tabs → Bootstrap 5 nav tabs
- Popovers → Bootstrap 5 popovers with composables
- Buttons → Native `<button>` with Bootstrap classes
- Progress bars → Bootstrap 5 progress
- Cards → Bootstrap 5 cards
- Alerts → Bootstrap 5 alerts

**Example: Tabs Replacement**

```vue
<!-- OLD (Bootstrap-Vue) -->
<b-tabs>
  <b-tab title="Breeding" active>
    <RoyalHatchery />
  </b-tab>
  <b-tab title="Workers">
    <Worker />
  </b-tab>
</b-tabs>

<!-- NEW (Native Bootstrap 5) -->
<ul class="nav nav-tabs" role="tablist">
  <li class="nav-item" role="presentation">
    <button
      class="nav-link"
      :class="{ active: activeTab === 'breeding' }"
      @click="activeTab = 'breeding'"
      role="tab"
    >
      Breeding
    </button>
  </li>
  <li class="nav-item" role="presentation">
    <button
      class="nav-link"
      :class="{ active: activeTab === 'workers' }"
      @click="activeTab = 'workers'"
      role="tab"
    >
      Workers
    </button>
  </li>
</ul>
<div class="tab-content">
  <div class="tab-pane" :class="{ 'active show': activeTab === 'breeding' }">
    <RoyalHatchery />
  </div>
  <div class="tab-pane" :class="{ 'active show': activeTab === 'workers' }">
    <Worker />
  </div>
</div>
```

**Example: Popover Replacement**

```vue
<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Popover } from 'bootstrap'

export default {
  setup() {
    const popoverRef = ref(null)
    let popoverInstance = null

    onMounted(() => {
      if (popoverRef.value) {
        popoverInstance = new Popover(popoverRef.value, {
          content: 'Your content here',
          trigger: 'hover'
        })
      }
    })

    onUnmounted(() => {
      if (popoverInstance) {
        popoverInstance.dispose()
      }
    })

    return { popoverRef }
  }
}
</script>

<template>
  <button ref="popoverRef" class="btn btn-primary">
    Hover me
  </button>
</template>
```

### Recommendation

Start with **BootstrapVue Next** for faster migration, then optionally refactor to native Bootstrap 5 later if needed.

---

## Phase 3: Vuex/Pinia Migration

**Estimated Time**: 2-3 hours (Vuex 4) or 6-8 hours (Pinia)

### Option A: Vuex 4 (Conservative)

Minimal changes required - mostly API updates.

#### Step 3.1: Update store initialization

`/src/store/store.js`:

```javascript
// OLD (Vuex 3)
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store

// NEW (Vuex 4)
import { createStore } from 'vuex'

const store = createStore({
  state,
  getters,
  mutations,
  actions
})

export default store
```

#### Step 3.2: Update main.js

```javascript
// OLD
import store from './store/store'
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

// NEW
import { createApp } from 'vue'
import store from './store/store'
import App from './App.vue'

const app = createApp(App)
app.use(store)
app.mount('#app')
```

#### Step 3.3: Update component usage

Good news: Most Vuex patterns stay the same!

```javascript
// These still work in Vuex 4:
this.$store.state.totalSod
this.$store.getters.allCritters
this.$store.commit('addChildToHatchery', critter)
this.$store.dispatch('breedCritter', location)

// mapState, mapGetters, mapMutations, mapActions all work the same
import { mapState, mapGetters, mapActions } from 'vuex'
```

### Option B: Pinia (Recommended, Modern)

Pinia is the official state management for Vue 3 - simpler API, better TypeScript support, better DevTools.

#### Step 3.1: Install Pinia

```bash
npm install pinia
```

#### Step 3.2: Create Pinia store

Create `/src/store/gameStore.js`:

```javascript
import { defineStore } from 'pinia'
import initialState from './state.json'
import localforage from 'localforage'
// Import all your lib files
import CritterFactory from '../lib/CritterFactory'
import Controller from '../lib/Controller'
// ... etc

export const useGameStore = defineStore('game', {
  // State
  state: () => ({
    ...initialState,
    stateSaved: false
  }),

  // Getters (same as Vuex getters)
  getters: {
    entireState(state) {
      return state
    },
    allCritters(state) {
      // Your existing getter logic
      const allCritters = []
      allCritters.push(...state.royalHatchery.mother)
      allCritters.push(...state.royalHatchery.father)
      // ... etc
      return allCritters
    },
    // Convert all your existing getters...
  },

  // Actions (replaces both mutations + actions)
  actions: {
    // Simple mutations become simple actions
    addChildToHatchery(child) {
      const location = child.female ? 'female' : 'male'
      this.royalHatchery[location].push(child)
      this.sortMound({ location: 'royalHatchery', type: location })
    },

    setCritterHealth(payload) {
      const { critterId, health } = payload
      const critter = this.findCritter(critterId)
      if (critter) {
        critter.health = health
      }
    },

    // Async actions work the same
    async breedCritter(location) {
      const mother = this.royalHatchery.mother[0]
      const father = this.royalHatchery.father[0]

      // Your existing breeding logic...
      const child = CritterFactory.breed(mother, father, this.unlockedGenes)

      this.addChildToHatchery(child)
      // ... etc
    },

    async saveToStorage() {
      try {
        await localforage.setItem('crittermound', this.$state)
        this.stateSaved = true
        setTimeout(() => this.stateSaved = false, 2000)
      } catch (err) {
        console.error('Save failed:', err)
      }
    }
  }
})
```

#### Step 3.3: Update main.js

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

#### Step 3.4: Update components

```vue
<script>
import { useGameStore } from '@/store/gameStore'
import { mapState, mapActions } from 'pinia'

export default {
  computed: {
    // Map state and getters
    ...mapState(useGameStore, ['totalSod', 'allCritters', 'boosts']),

    // Or use specific getters
    ...mapState(useGameStore, {
      critters: store => store.critters('royalHatchery', 'female')
    })
  },

  methods: {
    // Map actions
    ...mapActions(useGameStore, ['breedCritter', 'addWorker', 'useBoost'])
  }
}
</script>
```

Or use Composition API (more flexible):

```vue
<script>
import { useGameStore } from '@/store/gameStore'
import { computed } from 'vue'

export default {
  setup() {
    const store = useGameStore()

    const totalSod = computed(() => store.totalSod)
    const allCritters = computed(() => store.allCritters)

    const breedCritter = (location) => {
      store.breedCritter(location)
    }

    return {
      totalSod,
      allCritters,
      breedCritter
    }
  }
}
</script>
```

### Recommendation

If you have time, **migrate to Pinia**. It's the future of Vue state management and will make future updates easier. However, **Vuex 4** works fine if you want a faster migration.

---

## Phase 4: Component Migration

**Estimated Time**: 10-14 hours

### Migration Pattern Overview

Your components use Options API, which still works in Vue 3! You can migrate incrementally.

**Two approaches:**

1. **Keep Options API** (faster, ~10 hours)
2. **Migrate to Composition API** (slower, ~14 hours, but more future-proof)

### Approach 1: Keep Options API (Recommended for faster migration)

#### Step 4.1: Update main.js

```javascript
// OLD (Vue 2)
import Vue from 'vue'
import App from './App.vue'
import store from './store/store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

// NEW (Vue 3)
import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store'

const app = createApp(App)
app.use(store)
app.mount('#app')
```

#### Step 4.2: Update App.vue

`/src/App.vue` - Minimal changes needed:

```vue
<template>
  <div id="app">
    <!-- Replace b-tabs with BootstrapVue Next or native Bootstrap -->
    <!-- Your existing tabs structure -->
  </div>
</template>

<script>
// Components stay the same
import RoyalHatchery from './components/RoyalHatchery.vue'
import Worker from './components/Worker.vue'
// ... etc

export default {
  name: 'App',
  components: {
    RoyalHatchery,
    Worker,
    // ... etc
  },
  computed: {
    // These work exactly the same in Vue 3!
    royalHatcheryAlloc() {
      return this.$store.getters.royalHatcheryAlloc
    },
    workerAlloc() {
      return this.$store.getters.workerAlloc
    },
    // ... etc
  },
  methods: {
    // Methods work the same
    switchTab(tab) {
      this.activeTab = tab
    }
  },
  mounted() {
    // Worker initialization - needs updating (see Phase 5)
  }
}
</script>
```

#### Step 4.3: Update BreedingMound.vue

```vue
<template>
  <div class="breeding-mound">
    <!-- Replace b-button, b-card, etc. with BootstrapVue Next versions -->
    <!-- Your existing template -->
  </div>
</template>

<script>
import Critter from './Critter.vue'
import CritterHeader from './CritterHeader.vue'

export default {
  name: 'BreedingMound',
  components: {
    Critter,
    CritterHeader
  },
  computed: {
    // All computed properties work the same!
    mother() {
      return this.$store.getters.critters('royalHatchery', 'mother')[0]
    },
    father() {
      return this.$store.getters.critters('royalHatchery', 'father')[0]
    },
    boosts() {
      return this.$store.getters.boosts
    },
    moundSize() {
      return this.$store.getters.mound('royalHatchery', 'mother').size
    },
    upgradeCost() {
      return this.$store.getters.mound('royalHatchery', 'mother').upgradeCost
    },
    totalSod() {
      return this.$store.state.totalSod
    }
  },
  methods: {
    useBoost() {
      this.$store.dispatch('useBoost', 'royalHatchery')
    },
    upgradeMound() {
      this.$store.dispatch('upgradeMound', {
        location: 'royalHatchery',
        type: 'mother'
      })
    }
  }
}
</script>
```

**Key Points:**
- ✅ Computed properties work exactly the same
- ✅ Methods work exactly the same
- ✅ `this.$store` works exactly the same
- ⚠️ Only Bootstrap-Vue components need replacing

#### Step 4.4: Update HatcheryMound.vue (Most Complex Component)

This component has the most logic (7 computed, 4 methods):

```vue
<template>
  <div class="hatchery-mound">
    <!-- Replace Bootstrap-Vue components -->
    <!-- Your existing template -->
  </div>
</template>

<script>
import Critter from './Critter.vue'
import CritterHeader from './CritterHeader.vue'

export default {
  name: 'HatcheryMound',
  props: {
    location: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    // All these work the same in Vue 3
    critters() {
      return this.$store.getters.critters(this.location, this.type)
    },
    mound() {
      return this.$store.getters.mound(this.location, this.type)
    },
    moundSize() {
      return this.mound.size
    },
    currentSort() {
      return this.mound.sortBy
    },
    sorts() {
      return this.$store.getters.sorts
    },
    upgradeCost() {
      return this.mound.upgradeCost
    },
    totalSod() {
      return this.$store.state.totalSod
    }
  },
  methods: {
    // All these work the same in Vue 3
    sortMound(sortBy) {
      this.$store.commit('sortMound', {
        location: this.location,
        type: this.type,
        sortBy
      })
    },
    addWorker(critter) {
      this.$store.dispatch('addWorker', {
        critterId: critter.id,
        location: this.location,
        type: this.type
      })
    },
    addSoldier(critter) {
      this.$store.dispatch('addSoldier', {
        critterId: critter.id,
        location: this.location,
        type: this.type
      })
    },
    upgradeMound() {
      this.$store.dispatch('upgradeMound', {
        location: this.location,
        type: this.type
      })
    }
  }
}
</script>
```

#### Step 4.5: Update Remaining 12 Components

Follow the same pattern for all remaining components:

**Simple Components (minimal changes):**
- `RoyalHatchery.vue` - Just template updates for Bootstrap-Vue
- `Worker.vue` - Just template updates
- `Soldiers.vue` - Just template updates
- `Achievement.vue` - Just template updates
- `HowTo.vue` - Just template updates

**Components with Logic:**
- `WorkerMound.vue` - Similar to HatcheryMound, but simpler
- `ArmyMound.vue` - Has data() function, but otherwise similar
- `Critter.vue` - Has computed props + popover to replace
- `CritterHeader.vue` - Just computed props
- `Nations.vue` - Has methods with closure functions
- `War.vue` - Just computed props

**Component Checklist:**
```bash
□ RoyalHatchery.vue
□ BreedingMound.vue
□ HatcheryMound.vue
□ Critter.vue - Replace b-popover!
□ CritterHeader.vue
□ Worker.vue
□ WorkerMound.vue
□ Soldiers.vue
□ ArmyMound.vue - Has data() function
□ Nations.vue
□ War.vue
□ Achievement.vue
□ HowTo.vue
□ App.vue
```

### Approach 2: Migrate to Composition API (Optional, More Work)

If you want to modernize fully, you can convert components to Composition API:

**Example: BreedingMound.vue with Composition API**

```vue
<script>
import { computed } from 'vue'
import { useStore } from 'vuex' // or useGameStore from Pinia
import Critter from './Critter.vue'
import CritterHeader from './CritterHeader.vue'

export default {
  name: 'BreedingMound',
  components: {
    Critter,
    CritterHeader
  },
  setup() {
    const store = useStore() // or useGameStore()

    // Computed properties
    const mother = computed(() =>
      store.getters.critters('royalHatchery', 'mother')[0]
    )
    const father = computed(() =>
      store.getters.critters('royalHatchery', 'father')[0]
    )
    const boosts = computed(() => store.getters.boosts)
    const moundSize = computed(() =>
      store.getters.mound('royalHatchery', 'mother').size
    )
    const upgradeCost = computed(() =>
      store.getters.mound('royalHatchery', 'mother').upgradeCost
    )
    const totalSod = computed(() => store.state.totalSod)

    // Methods
    const useBoost = () => {
      store.dispatch('useBoost', 'royalHatchery')
    }
    const upgradeMound = () => {
      store.dispatch('upgradeMound', {
        location: 'royalHatchery',
        type: 'mother'
      })
    }

    return {
      mother,
      father,
      boosts,
      moundSize,
      upgradeCost,
      totalSod,
      useBoost,
      upgradeMound
    }
  }
}
</script>
```

Or with `<script setup>` syntax (even cleaner):

```vue
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Critter from './Critter.vue'
import CritterHeader from './CritterHeader.vue'

const store = useStore()

const mother = computed(() =>
  store.getters.critters('royalHatchery', 'mother')[0]
)
const father = computed(() =>
  store.getters.critters('royalHatchery', 'father')[0]
)
const boosts = computed(() => store.getters.boosts)
const moundSize = computed(() =>
  store.getters.mound('royalHatchery', 'mother').size
)
const upgradeCost = computed(() =>
  store.getters.mound('royalHatchery', 'mother').upgradeCost
)
const totalSod = computed(() => store.state.totalSod)

const useBoost = () => {
  store.dispatch('useBoost', 'royalHatchery')
}
const upgradeMound = () => {
  store.dispatch('upgradeMound', {
    location: 'royalHatchery',
    type: 'mother'
  })
}
</script>

<template>
  <!-- Same template -->
</template>
```

**Recommendation**: Start with **Options API** (Approach 1) for faster migration. You can convert to Composition API later if desired - Vue 3 supports both!

---

## Phase 5: Web Worker Updates

**Estimated Time**: 2-3 hours

### Problem
`worker-loader` is incompatible with Webpack 5 and Vite. Need to use native ES module workers.

### Solution: Native Web Worker API

#### Step 5.1: Update Worker.js

`/src/Worker.js` - Convert to ES module:

```javascript
// Make sure all imports use ES modules
import Controller from './lib/Controller'
import Critter from './lib/Critter'
import Trait from './lib/Trait'
import Gene from './lib/Gene'

// Worker message handler
self.onmessage = function(e) {
  const state = e.data

  // Unmarshal critters (your existing logic)
  const allCritters = []
  // ... your existing unmarshaling logic ...

  // Run game tick
  const changes = Controller.checkTick(state, allCritters)

  // Send back changes
  self.postMessage(changes)
}
```

#### Step 5.2: Update main.js or App.vue

Replace worker-loader syntax with native Worker:

```javascript
// OLD (worker-loader)
import Worker from 'worker-loader!./Worker.js'
const worker = new Worker()

// NEW (Native ES Module Worker)
// In Vite:
const worker = new Worker(
  new URL('./Worker.js', import.meta.url),
  { type: 'module' }
)

// In Vue CLI 5 with Webpack 5:
const worker = new Worker(
  new URL('./Worker.js', import.meta.url)
)
```

#### Step 5.3: Update message handling

The rest stays the same:

```javascript
// In mounted() or setup()
worker.postMessage(store.state) // or store.$state for Pinia

worker.onmessage = (e) => {
  const changes = e.data
  store.dispatch('updateData', changes) // Vuex
  // or
  store.updateData(changes) // Pinia
}

// Send state every 50ms
setInterval(() => {
  worker.postMessage(store.state)
}, 50)
```

#### Step 5.4: Handle Web Worker in Vite config

If using Vite, ensure web workers are configured:

```javascript
// vite.config.js
export default defineConfig({
  worker: {
    format: 'es',
    plugins: [vue()]
  }
})
```

---

## Phase 6: Testing & Validation

**Estimated Time**: 4-6 hours

### Step 6.1: Update Test Dependencies

```bash
npm install -D @vue/test-utils@^2.4.3 vitest@^1.2.0 jsdom@^24.0.0
```

### Step 6.2: Create Vitest Config

If using Vitest, create `vitest.config.js`:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### Step 6.3: Update Test Files

#### Library Tests (Mocha/Chai stay mostly the same)

Most library tests should work with minimal changes:

```javascript
// tests/lib/Critter.spec.js
import { expect } from 'chai'
import Critter from '../../src/lib/Critter'

describe('Critter', () => {
  it('should calculate score correctly', () => {
    // Your existing tests work!
    const critter = new Critter(/* ... */)
    expect(critter.score).to.be.above(0)
  })
})
```

#### Component Tests (Need Updates)

Update for @vue/test-utils v2:

```javascript
// OLD (Vue Test Utils 1.x)
import { shallowMount } from '@vue/test-utils'
import Critter from '@/components/Critter.vue'

const wrapper = shallowMount(Critter, {
  propsData: { critter: mockCritter },
  mocks: {
    $store: mockStore
  }
})

// NEW (Vue Test Utils 2.x)
import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Critter from '@/components/Critter.vue'

const store = createStore({
  state: { /* ... */ },
  getters: { /* ... */ }
})

const wrapper = shallowMount(Critter, {
  props: { critter: mockCritter }, // "propsData" → "props"
  global: {
    plugins: [store],
    stubs: ['b-popover'] // Stub Bootstrap-Vue components
  }
})
```

**Key Changes:**
- `propsData` → `props`
- `mocks` → `global.mocks`
- `stubs` → `global.stubs`
- `localVue` no longer needed
- Must provide store via `global.plugins`

### Step 6.4: Update Store Tests

`tests/lib/store.spec.js` needs updates:

```javascript
// OLD
import Vuex from 'vuex'
import { expect } from 'chai'

const store = new Vuex.Store({
  state: { /* ... */ },
  mutations: { /* ... */ }
})

// NEW
import { createStore } from 'vuex'
import { expect } from 'chai'

const store = createStore({
  state: { /* ... */ },
  mutations: { /* ... */ }
})
```

### Step 6.5: Run Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run specific test file
npm test tests/lib/Critter.spec.js
```

### Step 6.6: Manual Testing Checklist

Test all game functionality:

```
□ Breeding System
  □ Queen and King health regeneration
  □ Automatic breeding when both at 100%
  □ Manual breeding with boost
  □ Offspring appear in correct nursery (male/female)
  □ Trait inheritance works correctly
  □ Gene mutations appear randomly

□ Worker System
  □ Promote critters to workers
  □ Mine produces dirt
  □ Farm produces grass
  □ Carry transports resources
  □ Factory produces sod
  □ Production rates scale with traits

□ Combat System
  □ Promote critters to soldiers
  □ Nations unlock correctly
  □ War starts when nation selected
  □ Map generation works

□ UI/UX
  □ Tabs switch correctly
  □ Buttons respond to clicks
  □ Popovers show on hover
  □ Progress bars animate
  □ Sorting works in all mounds
  □ Upgrade buttons work

□ Persistence
  □ Game state saves to IndexedDB
  □ State loads correctly on refresh
  □ Save indicator appears

□ Performance
  □ Game loop runs at 20 ticks/second
  □ UI remains responsive
  □ No memory leaks after 5+ minutes
  □ Web Worker doesn't crash

□ Achievements
  □ Achievements unlock correctly
  □ Achievement display updates
```

---

## Phase 7: Optimization

**Estimated Time**: 1-2 hours

### Step 7.1: Performance Audit

```bash
# Build for production
npm run build

# Check bundle size
ls -lh dist/assets/*.js

# Analyze bundle (if using Vite)
npm install -D rollup-plugin-visualizer
```

Add to `vite.config.js`:
```javascript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({ open: true })
  ]
})
```

### Step 7.2: Code Splitting

Add lazy loading for tabs:

```javascript
// App.vue
const RoyalHatchery = defineAsyncComponent(() =>
  import('./components/RoyalHatchery.vue')
)
const Worker = defineAsyncComponent(() =>
  import('./components/Worker.vue')
)
const Soldiers = defineAsyncComponent(() =>
  import('./components/Soldiers.vue')
)
```

### Step 7.3: Optimize Web Worker

Ensure worker only sends changed data, not entire state:

```javascript
// Worker.js
const changes = Controller.checkTick(state, allCritters)

// Only send what changed
self.postMessage({
  critters: changes.critters, // Only updated critters
  sod: changes.addSod,
  achievements: changes.achievements
})
```

### Step 7.4: Use Vue DevTools

Install Vue DevTools for Chrome/Firefox:
- [Vue DevTools](https://devtools.vuejs.org/)

Test:
- Component hierarchy
- State inspection (Vuex/Pinia)
- Performance profiling
- Time-travel debugging

---

## Rollback Plan

### If Migration Fails

#### Option 1: Git Revert

```bash
# Revert to pre-migration state
git checkout master
git branch -D vue3-migration

# Or restore from tag
git checkout pre-vue3-migration
```

#### Option 2: Keep Both Versions

```bash
# Keep Vue 3 branch for future work
git checkout master

# Vue 3 work preserved in vue3-migration branch
```

### Known Risks

1. **Bootstrap-Vue components behave differently**
   - **Risk**: Medium
   - **Mitigation**: Test all UI components thoroughly
   - **Fallback**: Use native Bootstrap 5 components

2. **Web Worker communication breaks**
   - **Risk**: Medium
   - **Mitigation**: Test game loop extensively
   - **Fallback**: Run game logic on main thread temporarily

3. **Tests fail after migration**
   - **Risk**: High (test utils changed significantly)
   - **Mitigation**: Update tests incrementally
   - **Fallback**: Keep Vue 2 for CI, migrate tests separately

4. **Performance regression**
   - **Risk**: Low (Vue 3 is faster)
   - **Mitigation**: Profile before/after with DevTools
   - **Fallback**: Optimize worker communication

---

## Migration Checklist

### Pre-Migration
- [ ] Create git branch `vue3-migration`
- [ ] Create git tag `pre-vue3-migration`
- [ ] All tests pass on Vue 2
- [ ] Document current bundle size
- [ ] Node.js v16+ installed

### Phase 1: Dependencies
- [ ] Update package.json
- [ ] Remove worker-loader
- [ ] Install Vue 3 + Vuex 4/Pinia
- [ ] Install BootstrapVue Next or Bootstrap 5
- [ ] Install @vue/test-utils v2
- [ ] Optional: Install Vite
- [ ] npm install succeeds
- [ ] No peer dependency errors

### Phase 2: Bootstrap-Vue
- [ ] Update Bootstrap-Vue imports in main.js
- [ ] Replace b-tabs in App.vue
- [ ] Replace b-popover in Critter.vue (6 instances)
- [ ] Replace b-button (7 instances)
- [ ] Replace b-card (1 instance)
- [ ] Replace b-dropdown (1 instance)
- [ ] Replace b-alert (1 instance)
- [ ] Replace b-progress (1 instance)
- [ ] UI renders correctly

### Phase 3: Store
- [ ] Update store initialization
- [ ] Update main.js to use createStore/createPinia
- [ ] Update all component store access (if using Pinia)
- [ ] Test state mutations
- [ ] Test state actions
- [ ] Test getters

### Phase 4: Components
- [ ] Update main.js (createApp, mount)
- [ ] Update App.vue
- [ ] Update RoyalHatchery.vue
- [ ] Update BreedingMound.vue
- [ ] Update HatcheryMound.vue
- [ ] Update Critter.vue
- [ ] Update CritterHeader.vue
- [ ] Update Worker.vue
- [ ] Update WorkerMound.vue
- [ ] Update Soldiers.vue
- [ ] Update ArmyMound.vue
- [ ] Update Nations.vue
- [ ] Update War.vue
- [ ] Update Achievement.vue
- [ ] Update HowTo.vue
- [ ] All components render

### Phase 5: Web Worker
- [ ] Convert Worker.js to ES module
- [ ] Update Worker instantiation in main.js/App.vue
- [ ] Test worker communication
- [ ] Test game loop (20 ticks/second)
- [ ] Verify no memory leaks

### Phase 6: Testing
- [ ] Update test dependencies
- [ ] Create Vitest config (if using)
- [ ] Update component tests (13 files)
- [ ] Update library tests (9 files)
- [ ] All tests pass
- [ ] Manual testing checklist complete

### Phase 7: Optimization
- [ ] Build for production
- [ ] Check bundle size
- [ ] Add code splitting (optional)
- [ ] Optimize worker communication
- [ ] Test with Vue DevTools

### Post-Migration
- [ ] All features work correctly
- [ ] Performance is acceptable
- [ ] Tests pass in CI/CD
- [ ] Update README with new dependencies
- [ ] Merge to master
- [ ] Deploy to production

---

## Additional Resources

### Official Documentation
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vuex 4 Migration Guide](https://vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [BootstrapVue Next](https://github.com/bootstrap-vue-next/bootstrap-vue-next)
- [Vue Test Utils v2](https://test-utils.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [Vite](https://vitejs.dev/)

### Migration Tools
- [Vue 3 Migration Build](https://v3-migration.vuejs.org/migration-build.html) - Compatibility layer for gradual migration
- [Vue DevTools](https://devtools.vuejs.org/)
- [@vue/compat](https://www.npmjs.com/package/@vue/compat) - Vue 2 compatibility build

### Community Resources
- [Vue.js Discord](https://discord.com/invite/vue)
- [Vue.js Forum](https://forum.vuejs.org/)
- [Stack Overflow - Vue.js](https://stackoverflow.com/questions/tagged/vue.js)

### Breaking Changes Reference

**Removed APIs:**
- `Vue.prototype.$...` → `app.config.globalProperties.$...`
- `Vue.filter()` → Use computed or methods
- Event bus (`$on`, `$off`, `$once`) → Use mitt or provide/inject
- `$listeners` → Merged into `$attrs`
- `$children` → Use refs or provide/inject
- `$scopedSlots` → Merged into `$slots`

**Behavioral Changes:**
- `v-model` on components uses `modelValue` prop instead of `value`
- `v-model` modifiers API changed
- `v-for` ref no longer auto-creates array of refs
- Async components require `defineAsyncComponent()`
- Functional components must be plain functions
- `key` usage on `<template v-for>` changed

**Lifecycle Hooks:**
- `beforeDestroy` → `beforeUnmount`
- `destroyed` → `unmounted`

---

## Estimated Costs

### Time Investment
- **Minimum** (Vuex 4 + BootstrapVue Next + Options API): 26-35 hours
- **Recommended** (Pinia + BootstrapVue Next + Options API): 32-42 hours
- **Maximum** (Pinia + Native Bootstrap + Composition API + Vite): 45-60 hours

### Risk Assessment
- **Low Risk**: Options API components, library code (no changes needed)
- **Medium Risk**: Bootstrap-Vue components, Web Worker, test updates
- **High Risk**: None (no complex lifecycle hooks, no filters, no event bus)

### Cost-Benefit Analysis

**Benefits:**
- Better performance (faster reactivity system)
- Better TypeScript support
- Better DevTools
- Better composition patterns
- Future-proof (Vue 2 EOL Dec 2023)
- Smaller bundle size
- Better tree-shaking

**Costs:**
- Development time (26-60 hours)
- Testing time (4-6 hours)
- Learning curve (if using new patterns)
- Potential bugs during migration

**Recommendation**: The benefits outweigh the costs, especially since your codebase is clean and well-structured.

---

## Support

If you encounter issues during migration:

1. Check the [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
2. Search [GitHub Issues](https://github.com/vuejs/core/issues)
3. Ask on [Vue Discord](https://discord.com/invite/vue)
4. Post on [Stack Overflow](https://stackoverflow.com/questions/tagged/vue.js)

---

## Conclusion

Your Crittermound codebase is **well-suited for migration** to Vue 3. The clean architecture, lack of deprecated patterns, and well-tested code make this a straightforward migration.

**Recommended Approach:**
1. Use **BootstrapVue Next** for faster UI migration
2. Start with **Vuex 4** (upgrade to Pinia later if desired)
3. Keep **Options API** initially (convert to Composition API later if desired)
4. Migrate **incrementally** - test each phase before moving on
5. Consider **Vite** for better DX and faster builds

Good luck with the migration! Feel free to ask if you have questions about any specific step.
