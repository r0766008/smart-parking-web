import Vue from 'vue'
import Vuex from 'vuex'

import { AuthModule } from './auth.module'
import { VehicleModule } from './vehicle.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    AuthModule,
    VehicleModule
  },
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  }
})
