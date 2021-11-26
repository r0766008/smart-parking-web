import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from "firebase";
import vuetify from './plugins/vuetify'
import PubNubVue from 'pubnub-vue'

Vue.config.productionTip = false

Vue.use(PubNubVue, {
  subscribeKey: 'sub-c-aeca6404-4225-11ec-8ee6-ce954cd2c970',
  publishKey: 'pub-c-3076e5e4-747f-42aa-bf03-1a97f3042a2b'
})

Vue.use(require('vue-moment'));

const firebaseConfig = {
  apiKey: "AIzaSyCmMALiidEiXR2GrFQD0S0jn7TMyHuNRxM",
  authDomain: "smart-parking-system-b2368.firebaseapp.com",
  projectId: "smart-parking-system-b2368",
  storageBucket: "smart-parking-system-b2368.appspot.com",
  messagingSenderId: "104676653839",
  appId: "1:104676653839:web:119dabc9f72e51bb9a9c7a",
  measurementId: "G-ZYGF1R36PH"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("AuthModule/fetchUser", user);
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
