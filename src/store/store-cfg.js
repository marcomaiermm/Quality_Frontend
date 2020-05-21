const state = {
  config: {
    year: ""
  }
};

const mutations = {
  updateConfig(state, payload) {
    state.config = payload;
  }
};

const actions = {
  updateConfig({ commit }, payload) {
    commit("updateConfig", payload);
  }
};

const getters = {
  getCfg: state => {
    return state.config;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
