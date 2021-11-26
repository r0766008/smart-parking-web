import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://stark-woodland-65577.herokuapp.com/api/',
  headers: {
    accept: 'application/json'
  }
})

export default apiClient
