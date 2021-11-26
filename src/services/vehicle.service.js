import http from '../http.js'

export class VehicleService {
  static getVehicles () {
    return http.get('/vehicles')
  }
}
