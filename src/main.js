import 'buefy/lib/buefy.css'
import Vue from 'vue'
import App from './App.vue'

import Buefy from 'buefy'

import axios from 'axios'
import VueAxios from 'vue-axios'

import {Observable, Subject, Subscription} from 'rxjs'
import VueRx from 'vue-rx'
Vue.use(Buefy);
Vue.use(VueRx, { Observable, Subject, Subscription});
Vue.use(VueAxios, axios);
new Vue({
  el: '#app',
  render: h => h(App)
})
