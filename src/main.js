// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import { store } from './store/store';
import GameController from './lib/GameController';
require('../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss');

Vue.config.productionTip = false;

//enable requestAnimationFrame & cancelAnimationFrame
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
  window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
    || window[vendors[x]+'RequestCancelAnimationFrame'];
}

if (!window.requestAnimationFrame || !window.cancelAnimationFrame) { //current Chrome (16) supports request but not cancel
  window.requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
}

const vueApp = new Vue({
  el: '#app',
  store: store,
  template: '<App/>',
  components: { App }
});

const game = new GameController(store);
game.run();

