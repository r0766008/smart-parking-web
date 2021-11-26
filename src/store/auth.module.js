export const AuthModule = {
  namespaced: true,
  state: {
    user: {
      loggedIn: localStorage.getItem('user') ? true : false,
      data: localStorage.getItem('user')
    }
  },
  getters: {
    user(state){
      return state.user
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      localStorage.setItem('user', data)
      state.user.data = data;
    },
    SET_LOGGED_OUT() {
      localStorage.removeItem('user')
    }
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", user.email);
      }
    },
    signOutUser({ commit }) {
      commit("SET_LOGGED_OUT")
    }
  }
}
