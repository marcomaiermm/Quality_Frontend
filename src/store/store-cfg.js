const state = {
  config: {
    year: ""
  },
  path: {
    // host: "AWWKS-004244.allweier.lcl",
    // port: "5000"
    // host: "awslgit01.allweier.lcl",
    // port: "5000"
    host: process.env.HOST,
    port: process.env.PORT
  }
};

const mutations = {
  updateConfig(state, payload) {
    state.config = payload;
  }
};

const actions = {
  updateConfig({
    commit
  }, payload) {
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
