const state = {
  parsedData: [],
  parseDataCustomer: [],
  parseDataSupplier: [],
  parsedHistory: [],
  parsedHistoryCustomer: [],
  parsedHistorySupplier: [],
  parsedPareto: [],
  parsedParetoCustomer: [],
  parsedParetoSupplier: [],
  parsedFilterMachines: []
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
  updateHistory(state, payload) {
    state.parsedHistory = payload;
  },
  updateHistoryCustomer(state, payload) {
    state.parsedHistoryCustomer = payload;
  },
  updateHistorySupplier(state, payload) {
    state.parsedHistorySupplier = payload;
  },
  updatePareto(state, payload) {
    state.parsedPareto = payload;
  },
  updateParetoCustomer(state, payload) {
    state.parsedParetoCustomer = payload;
  },
  updateParetoSupplier(state, payload) {
    state.parsedParetoSupplier = payload;
  },
  updateFilterMachines(state, payload) {
    state.parsedFilterMachines = payload;
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
  updateHistoryCustomer({ commit }, payload) {
    commit("updateHistoryCustomer", payload);
  },
  updateHistorySupplier({ commit }, payload) {
    commit("updateHistorySupplier", payload);
  },
  updatePareto({ commit }, payload) {
    commit("updatePareto", payload);
  },
  updateParetoCustomer({ commit }, payload) {
    commit("updateParetoCustomer", payload);
  },
  updateParetoSupplier({ commit }, payload) {
    commit("updateParetoSupplier", payload);
  },
  updateFilterMachines({ commit }, payload) {
    commit("updateFilterMachines", payload);
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
  getHistoryCustomer: state => {
    return state.parsedHistoryCustomer;
  },
  getHistorySupplier: state => {
    return state.parsedHistorySupplier;
  },
  getPareto: state => {
    return state.parsedPareto;
  },
  getParetoCustomer: state => {
    return state.parsedParetoCustomer;
  },
  getParetoSupplier: state => {
    return state.parsedParetoSupplier;
  },
  getFilterMachines: state => {
    return state.parsedFilterMachines;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
