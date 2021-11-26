import { VehicleService } from '../services/vehicle.service.js'

export const VehicleModule = {
  namespaced: true,
  state: {
    vehicles: []
  },
  getters: {
    vehicles: state => state.vehicles
  },
  mutations: {
    SET_VEHICLES: (state, payload) => {
      state.vehicles = payload
    }
  },
  actions: {
    async getVehicles ({ commit }) {
      await VehicleService.getVehicles().then(response => {
        commit('SET_VEHICLES', response.data)
      })
    }
  }
}
