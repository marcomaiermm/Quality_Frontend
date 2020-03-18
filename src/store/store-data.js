const state = {
  parsedData: [],
  parsedHistory: []
};

const mutations = {
  updateData(state, payload) {
    state.parsedData = payload;
  },
  updateHistory(state, payload) {
    state.parsedHistory = payload;
  }
};

const actions = {
  updateData({ commit }, payload) {
    commit("updateData", payload);
  },
  updateHistory({ commit }, payload) {
    commit("updateHistory", payload);
  }
};

const getters = {
  getData: state => {
    return state.parsedData;
  },
  getHistory: state => {
    return state.parsedHistory;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
