const state = {
  dataset: {},
};

const mutations = {
  updateDataset(state, payload) {
    state.dataset = payload;
  }
};

const actions = {
  updateDataset({
    commit
  }, payload) {
    commit("updateDataset", payload);
  },
};

const getters = {
  getDataset: state => {
    return state.dataset;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
