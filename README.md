# Crittermound v2.0 ![build status](https://api.travis-ci.com/lianmakesthings/crittermound.svg?branch=master)

> A complete rework of http://crittermound.com with Vue.js

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

## Tech Stack

- **Vue.js 2.6** - Frontend framework
- **Vuex 3.5** - State management
- **Bootstrap-Vue 2.16** - UI components
- **Web Workers** - Background game processing
- **LocalForage** - IndexedDB persistence
- **Mocha + Chai** - Testing framework
- **Vue CLI 4.4** - Build tooling

## Prerequisites

- **Node.js** (v12 or higher recommended)
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

This will install all required dependencies including Vue.js, Vuex, Bootstrap-Vue, and development tools.

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

Crittermound has comprehensive test coverage with 22 test files covering both game logic and UI components.

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

- **Mocha** - Test runner
- **Chai** - Assertion library (expect, should, assert)
- **Sinon** - Test spies, stubs, and mocks
- **@vue/test-utils** - Vue component testing utilities
- **ESM** - ES6 module support in tests

### Creating New Tests

#### Library Test Example

Create a new file in `/tests/lib/` with the `.spec.js` extension:

```javascript
// tests/lib/YourModule.spec.js
import { expect } from 'chai'
import YourModule from '../../src/lib/YourModule'

describe('YourModule', () => {
  it('should do something', () => {
    const result = YourModule.someFunction()
    expect(result).to.equal(expectedValue)
  })

  it('should handle edge cases', () => {
    // Test edge cases
  })
})
```

#### Component Test Example

Create a new file in `/tests/unit/` with the `.spec.js` extension:

```javascript
// tests/unit/YourComponent.spec.js
import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import YourComponent from '@/components/YourComponent.vue'

describe('YourComponent.vue', () => {
  it('renders props when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(YourComponent, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })

  it('handles user interaction', () => {
    const wrapper = shallowMount(YourComponent)
    wrapper.find('button').trigger('click')
    expect(wrapper.vm.someData).to.equal(expectedValue)
  })
})
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

### Web Worker Architecture

The game runs a background worker (`/src/Worker.js`) that:
1. Receives game state from main thread
2. Runs game tick logic (20 times per second)
3. Calculates health regeneration, breeding, production
4. Sends changes back to main thread
5. Main thread updates Vuex store, triggers UI re-render

This keeps the UI responsive even during intensive calculations.

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
   # Should be v12 or higher
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
- **Original Game**: http://crittermound.com
- **Framework**: Vue.js
- **UI Library**: Bootstrap-Vue
