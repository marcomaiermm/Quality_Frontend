const state = {
  parsedData: []
}

const mutations = {
  updateData (state, payload) {
    state.parsedData = payload
  }
}

const actions = {
  updateData ({ commit }, payload) {
    commit('updateData', payload)
  }
}

const getters = {
  parsedData: state => {
    return state.parsedData
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
