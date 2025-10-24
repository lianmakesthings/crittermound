import { config } from '@vue/test-utils';
import BootstrapVueNext from 'bootstrap-vue-next';
import * as BootstrapComponents from 'bootstrap-vue-next';

// Register Bootstrap-Vue-Next components globally for all tests
config.global.plugins = [BootstrapVueNext];

// Tell Vue Test Utils to NOT stub Bootstrap components - render them instead
// This creates a mapping of component names to actual components
const bootstrapStubs = {};
Object.keys(BootstrapComponents).forEach(key => {
  if (key.startsWith('B')) {
    // Map both PascalCase and kebab-case names to the real component
    bootstrapStubs[key] = BootstrapComponents[key];
    bootstrapStubs[key.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1)] = BootstrapComponents[key];
  }
});

config.global.stubs = bootstrapStubs;
