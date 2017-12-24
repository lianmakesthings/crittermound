// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import getStore from './store/store';
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import fontawesome from '@fortawesome/fontawesome'
import { faUser } from '@fortawesome/fontawesome-free-solid'
import Worker from 'worker-loader!./Worker.js';
import { Critter, CritterFactory } from './lib/Critter';
fontawesome.icon(faUser);

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

getStore((store) => {
  const vueApp = new Vue({
    el: '#app',
    store: store,
    template: '<App/>',
    components: { App }
  });

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


