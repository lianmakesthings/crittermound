# Crittermound v2.0 [![CI](https://github.com/lianmakesthings/crittermound/actions/workflows/ci.yml/badge.svg)](https://github.com/lianmakesthings/crittermound/actions/workflows/ci.yml)

> A complete rework of https://jayseesee.github.io/Crittermound-Fork/ with Vue.js

Visit the game at: [crittermound.lianmakesthings.dev](https://crittermound.lianmakesthings.dev/)

## About

Crittermound is an incremental/clicker game where you breed and evolve virtual insects called "critters" to mine resources and build an insect empire. Through genetic breeding, you'll improve your critters' traits, unlock new mutations, and eventually wage war against other insect nations.

**Key Features:**
- Genetic breeding system with trait inheritance and random mutations
- Resource production pipeline (mine → farm → carry → factory)
- 18 unlockable insect nations to battle
- 22 achievements tracking your progress
- Persistent game state using IndexedDB
- Web Worker-powered game loop for smooth performance

## Documentation

For detailed information about the project:

- **[ROADMAP.md](ROADMAP.md)** - Complete development roadmap with all milestones, issues, and effort estimates (124-168 hours across 12 milestones)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture documentation covering:
  - Dual-threaded architecture (Main thread + Web Worker)
  - Vuex store patterns and state management
  - Genetic system and breeding mechanics
  - Resource production pipeline
  - War mechanic implementation status
  - Testing patterns and common code examples
- **[CLAUDE.md](CLAUDE.md)** - Quick reference guide for Claude Code AI assistant

## Tech Stack

### Frontend
- **Vue.js 3.4** - Progressive JavaScript framework
- **Vuex 4.1** - Centralized state management
- **Bootstrap-Vue-Next 0.15** - UI components (Bootstrap 5)
- **Vue CLI 5.0** - Build tooling and development server

### Game Engine
- **Web Workers** - Multi-threaded game loop (20 ticks/second)
- **LocalForage** - IndexedDB persistence layer

### Testing
- **Mocha + Chai 5** - Library/logic testing (143 tests)
- **Vitest** - Component testing (34 tests)
- **Sinon + Sinon-Chai** - Test spies, stubs, and mocks
- **@vue/test-utils 2** - Vue 3 component testing utilities
- **GitHub Actions** - Continuous Integration (CI/CD)

### Development
- **ES Modules** - Modern JavaScript module system
- **Babel** - JavaScript transpilation
- **ESLint** (optional) - Code linting

## Prerequisites

- **Node.js** (v20 or v21 required)
- **npm** (comes with Node.js)

## Development Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/lianmakesthings/crittermound
cd crittermound
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including Vue.js 3, Vuex 4, Bootstrap-Vue-Next, and development tools.

### 3. Run the Development Server

```bash
npm run serve
```

The application will start at `http://localhost:8080` (or the next available port) with hot-reload enabled. Any changes you make to the source code will automatically reload in the browser.

**Development Server Features:**
- Hot module replacement (HMR)
- Source maps for debugging
- Detailed error messages in the browser console
- Automatic port selection if 8080 is busy

## Project Structure

```
crittermound/
├── src/
│   ├── main.js                 # Vue app entry point, Web Worker initialization
│   ├── App.vue                 # Root component with tab navigation
│   ├── Worker.js               # Web Worker for background game loops
│   ├── components/             # 13 Vue UI components
│   │   ├── Critter.vue        # Individual critter display
│   │   ├── BreedingMound.vue  # Queen/King breeding UI
│   │   ├── HatcheryMound.vue  # Offspring nursery
│   │   ├── WorkerMound.vue    # Worker management
│   │   ├── Worker.vue         # Production visualization
│   │   ├── ArmyMound.vue      # Army units
│   │   ├── Nations.vue        # Nation selection
│   │   ├── War.vue            # Combat interface
│   │   ├── Achievement.vue    # Achievement tracker
│   │   └── ...
│   ├── lib/                    # 21 core game logic libraries
│   │   ├── Critter.js         # Critter entity class
│   │   ├── CritterFactory.js  # Breeding and creation logic
│   │   ├── Trait.js           # Trait system
│   │   ├── Gene.js            # Genetic mutation system
│   │   ├── Controller.js      # Main game loop logic
│   │   ├── SodProduction.js   # Worker allocation optimization
│   │   ├── Achievement.js     # Achievement checking
│   │   ├── Nation.js          # Combat nations
│   │   ├── War.js, Map.js     # Combat system
│   │   ├── genes.json         # Gene database
│   │   └── achievements.json  # Achievement definitions
│   ├── store/
│   │   ├── store.js           # Vuex store (state, mutations, actions, getters)
│   │   └── state.json         # Initial game state
│   └── assets/                 # Static assets
├── tests/
│   ├── lib/                    # 13 Mocha tests for game logic
│   │   ├── Critter.spec.js
│   │   ├── CritterFactory.spec.js
│   │   ├── store.spec.js
│   │   └── ...
│   └── unit/                   # 9 Vue component tests
│       ├── Critter.spec.js
│       ├── BreedingMound.spec.js
│       └── ...
├── public/                     # Static files (served as-is)
├── package.json               # Dependencies and scripts
├── babel.config.js            # Babel configuration
└── README.md
```

## Running Tests

Crittermound has comprehensive test coverage with 177 tests across 22 test files covering both game logic and UI components.

### Run All Tests

```bash
npm test
```

This runs both library tests and component tests sequentially.

### Run Library Tests Only

```bash
npm run test:lib
```

Tests the core game logic in `/src/lib/` including:
- Critter creation and genetics
- Trait inheritance and gene expression
- Breeding mechanics
- Resource production logic
- Achievement checking
- Combat system
- Vuex store mutations and actions

### Run Component Tests Only

```bash
npm run test:components
```

Tests Vue components in `/src/components/` including:
- Component rendering
- User interactions
- Props and computed properties
- Component lifecycle

### Testing Technologies

**Library Tests (143 tests):**
- **Mocha** - Test runner for library/game logic tests
- **Chai 5** - Assertion library with named exports (`expect`, `use`)
- **Sinon** - Test spies, stubs, and mocks
- **Sinon-Chai** - Chai assertions for Sinon

**Component Tests (34 tests):**
- **Vitest** - Fast test runner for Vue 3 components
- **@vue/test-utils 2** - Vue 3 component testing utilities
- **jsdom** - DOM implementation for Node.js

### Creating New Tests

#### Library Test Example

Create a new file in `/tests/lib/` with the `.spec.js` extension:

```javascript
// tests/lib/YourModule.spec.js
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import YourModule from '../../src/lib/YourModule.js';

use(sinonChai);

describe('YourModule', () => {
  it('should do something', () => {
    const result = YourModule.someFunction();
    expect(result).to.equal(expectedValue);
  });

  it('should handle edge cases', () => {
    // Test edge cases
  });
});
```

#### Component Test Example

Create a new file in `/tests/unit/` with the `.spec.js` extension:

```javascript
// tests/unit/YourComponent.spec.js
import { expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import YourComponent from '../../src/components/YourComponent.vue';

describe('YourComponent.vue', () => {
  it('renders props when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(YourComponent, {
      props: { msg }  // Vue 3 uses 'props' instead of 'propsData'
    });
    expect(wrapper.text()).toContain(msg);
  });

  it('handles user interaction', async () => {
    const wrapper = shallowMount(YourComponent);
    await wrapper.find('button').trigger('click');  // await async actions
    expect(wrapper.vm.someData).toBe(expectedValue);
  });
});
```

**Test Best Practices:**
- Keep tests focused and isolated
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies
- Use `shallowMount` for component tests to avoid rendering child components

## Building for Production

### Build the Application

```bash
npm run build
```

This command:
1. Compiles and minifies all JavaScript
2. Optimizes CSS
3. Processes images and assets
4. Generates source maps (for debugging)
5. Outputs everything to the `/dist` directory

The build is optimized for production with:
- Tree shaking (removes unused code)
- Code splitting (smaller initial load)
- Asset optimization (compressed images, minified CSS/JS)
- Cache-busting filenames (for CDN caching)

### Testing the Production Build

You can test the production build locally using a static file server:

```bash
# Install a simple HTTP server (if you don't have one)
npm install -g serve

# Serve the dist directory
serve -s dist
```

The production build will be available at `http://localhost:5000` (or as indicated).

### Deployment

The `/dist` folder contains everything needed to deploy. You can:

1. **Static Hosting** (GitHub Pages, Netlify, Vercel, etc.)
   - Upload the `/dist` folder contents
   - Configure for single-page application (SPA) routing

2. **Traditional Web Server** (Apache, Nginx)
   - Copy `/dist` contents to web root
   - Configure fallback to `index.html` for SPA routing

3. **CDN** (CloudFront, CloudFlare)
   - Upload to S3/storage bucket
   - Configure CDN with SPA routing support

## Game Architecture

### State Management (Vuex)

The game uses Vuex for centralized state management:

- **State** (`/src/store/state.json`) - Initial game state including critters, resources, achievements
- **Mutations** - Synchronous state changes (add critter, update health, move between mounds)
- **Actions** - Asynchronous operations (breed critter, upgrade mound, save to storage)
- **Getters** - Computed state (find critter, mound allocations, production rates)

**Key Pattern:** Store is initialized asynchronously to load from IndexedDB:
```javascript
import { getStore } from './store/store.js';

getStore((store) => {
  // Store is ready with persisted data
  createApp(App).use(store).mount('#app');
});
```

### Dual-Threaded Architecture

**Main Thread** (UI):
- Vue.js components render UI
- Vuex store manages state
- User interactions dispatch actions
- Receives game state updates from Worker

**Worker Thread** (Game Logic):
- Runs game loop at 20 ticks/second
- Processes breeding, health regen, production
- Calculates complex game mechanics
- Sends only state deltas back to main thread

**Data Flow:**
```
Main Thread → postMessage(state) → Worker
Worker → checkTick() → calculates changes
Worker → postMessage(delta) → Main Thread
Main Thread → updateData(delta) → UI updates
```

This architecture keeps the UI responsive even during intensive breeding calculations or combat processing.

### Mound-Based Organization

All critters exist within "mounds" addressed by `{location, type}`:

**Royal Hatchery:**
- `{location: 'royalHatchery', type: 'mother'}` - Queen's breeding mound
- `{location: 'royalHatchery', type: 'father'}` - King's breeding mound
- `{location: 'royalHatchery', type: 'female'}` - Female offspring hatchery
- `{location: 'royalHatchery', type: 'male'}` - Male offspring hatchery

**Workers:**
- `{location: 'worker', type: 'mine'}` - Mining critters
- `{location: 'worker', type: 'farm'}` - Farming critters
- `{location: 'worker', type: 'carry'}` - Carrier critters
- `{location: 'worker', type: 'factory'}` - Factory workers

**Army:**
- `{location: 'soldiers', type: 'army'}` - Combat critters

### Genetic System

**Three-Layer Trait System:**
1. **Base Value** - Inherited from parents with variance
2. **Genes** - Mutations that add bonuses
3. **Final Value** = `base + sum(gene.value for each gene)`

**Gene Expression Types:**
- `EXPRESSION_NONE (0)` - Gene not present
- `EXPRESSION_RECESSIVE (1)` - Present but inactive (value = 0)
- `EXPRESSION_DOMINANT (2)` - Active with non-zero value

**Inheritance (Mendelian genetics):**
- Two recessive parents → 25% dominant offspring
- One recessive + one dominant → 50% dominant offspring
- Two dominant parents → 100% dominant offspring

### Resource Production Pipeline

```
Mine → Dirt Storage → Carry → Factory ← Carry ← Grass Storage ← Farm
                                  ↓
                                 Sod
```

Production is optimized by `SodProduction.js` which allocates workers to minimize bottlenecks.

### Data Persistence

Game state is automatically saved to IndexedDB using LocalForage. Your progress persists across browser sessions.

## Customization

### Vue CLI Configuration

For advanced build configuration, create a `vue.config.js` file in the project root. See [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).

### Environment Variables

Create `.env` files for environment-specific configuration:

```bash
# .env.local (for local development, not committed to git)
VUE_APP_API_URL=http://localhost:3000
```

Access in code:
```javascript
const apiUrl = process.env.VUE_APP_API_URL
```

## Troubleshooting

### Port Already in Use

If port 8080 is already in use, Vue CLI will automatically select the next available port. You can also specify a custom port:

```bash
npm run serve -- --port 3000
```

### Build Fails

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check Node.js version:
   ```bash
   node --version
   # Should be v20 or v21
   ```

### Tests Failing

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Run tests in watch mode for debugging:
   ```bash
   npm run test:lib -- --watch
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is private and maintained by lianmakesthings.

## Credits

- **Author**: lianmakesthings
- **Original Game**: https://jayseesee.github.io/Crittermound-Fork/
- **Framework**: Vue.js 3
- **UI Library**: Bootstrap-Vue-Next (Bootstrap 5)
