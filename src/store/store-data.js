const state = {
  parsedData: [],
  parsedHistory: [],
  parsedHistoryDynamic: [],
  parsedPareto: []
};

const mutations = {
  updateData(state, payload) {
    state.parsedData = payload;
  },
  updateHistoryDynamic(state, payload) {
    state.parsedHistoryDynamic = payload;
  },
  updateHistory(state, payload) {
    state.parsedHistory = payload;
  },
  updatePareto(state, payload) {
    state.parsedPareto = payload;
  }
};

const actions = {
  updateData({ commit }, payload) {
    commit("updateData", payload);
  },
  updateHistory({ commit }, payload) {
    commit("updateHistory", payload);
  },
  updateHistoryDynamic({ commit }, payload) {
    commit("updateHistoryDynamic", payload);
  },
  updatePareto({ commit }, payload) {
    commit("updatePareto", payload);
  }
};

const getters = {
  getData: state => {
    return state.parsedData;
  },
  getHistory: state => {
    return state.parsedHistory;
  },
  getHistoryDynamic: state => {
    return state.parsedHistoryDynamic;
  },
  getPareto: state => {
    return state.parsedPareto;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
