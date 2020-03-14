import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import getStore from './store/store';
import Worker from 'worker-loader!./Worker.js';
import CritterFactory from './lib/CritterFactory';

Vue.use(BootstrapVue);
Vue.config.productionTip = false

getStore((store) => {
  const vueApp = new Vue({
    store,
    render: h => h(App)
  }).$mount('#app')

  const worker = new Worker();

  worker.onmessage = (msg) => {
    const changes = msg.data;

    changes.critters = changes.critters.map(critterState => {
      return CritterFactory.fromState(critterState)
    });

    store.dispatch('updateData', changes);
    worker.postMessage(store.getters.entireState);
  };

  worker.postMessage(store.getters.entireState);
});
