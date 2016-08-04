// just double check that console logs are available in debugger
function onDeviceReady() {
    if (window.cordova.logger) {
        window.cordova.logger.__onDeviceReady();
    }
}

document.addEventListener('deviceready', onDeviceReady, false);

import Vue from 'vue'
import App from './App'

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
