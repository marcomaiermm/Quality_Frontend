const state = {
  parsedData: [],
  parseDataCustomer: [],
  parseDataSupplier: [],
  parsedHistory: [],
  parsedHistoryDynamic: [],
  parsedPareto: []
};

const mutations = {
  updateData(state, payload) {
    state.parsedData = payload;
  },
  updateDataCustomer(state, payload) {
    state.parseDataCustomer = payload;
  },
  updateDataSupplier(state, payload) {
    state.parseDataSupplier = payload;
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
  updateDataCustomer({ commit }, payload) {
    commit("updateDataCustomer", payload);
  },
  updateDataSupplier({ commit }, payload) {
    commit("updateDataSupplier", payload);
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
  getDataCustomer: state => {
    return state.parseDataCustomer;
  },
  getDataSupplier: state => {
    return state.parseDataSupplier;
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
