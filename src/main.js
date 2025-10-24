import { createApp } from 'vue';
import App from './App.vue';
import BootstrapVueNext from 'bootstrap-vue-next';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import getStore from './store/store';
import CritterFactory from './lib/CritterFactory';

getStore((store) => {
  const app = createApp(App);

  app.use(store);
  app.use(BootstrapVueNext);

  const vueApp = app.mount('#app');

  // Use native ES module worker
  const worker = new Worker(
    new URL('./Worker.js', import.meta.url),
    { type: 'module' }
  );

  // Helper to serialize state for worker (convert class instances to plain objects)
  const serializeState = (state) => {
    return JSON.parse(JSON.stringify(state));
  };

  worker.onmessage = (msg) => {
    const changes = msg.data;

    changes.critters = changes.critters.map(critterState => {
      return CritterFactory.fromState(critterState)
    });

    store.dispatch('updateData', changes);
    worker.postMessage(serializeState(store.getters.entireState));
  };

  worker.postMessage(serializeState(store.getters.entireState));
});
