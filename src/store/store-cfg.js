const state = {
  config: {
    year: ""
  },
  path: {
    host: "pc0547.allweier.lcl",
    port: "5000"
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
  },
  getPath: state => {
    return state.path;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
