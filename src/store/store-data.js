const state = {
  parsedData: [],
  parseDataExtern: [],
  parseDataAll: [],
  parsedHistory: [],
  parsedHistoryExtern: [],
  parsedHistoryAll: [],
  parsedPareto: [],
  parsedParetoExtern: [],
  parsedParetoAll: [],
  parsedFilter: {
    machines: [],
    orders: [],
    process: [],
    parts: []
  },
  parsedPPM: [],
  parsedCost: [],
  reportIntern: [],
  reportExtern: [],
  reportAll: [],
  report: ""
};

const mutations = {
  updateData(state, payload) {
    state.parsedData = payload;
  },
  updateDataExtern(state, payload) {
    state.parseDataExtern = payload;
  },
  updateDataAll(state, payload) {
    state.parseDataAll = payload;
  },
  updateHistory(state, payload) {
    state.parsedHistory = payload;
  },
  updateHistoryExtern(state, payload) {
    state.parsedHistoryExtern = payload;
  },
  updateHistoryAll(state, payload) {
    state.parsedHistoryAll = payload;
  },
  updatePareto(state, payload) {
    state.parsedPareto = payload;
  },
  updateParetoExtern(state, payload) {
    state.parsedParetoExtern = payload;
  },
  updateParetoAll(state, payload) {
    state.parsedParetoAll = payload;
  },
  updateFilter(state, payload) {
    state.parsedFilter = payload;
  },
  updatePPM(state, payload) {
    state.parsedPPM = payload;
  },
  updateCost(state, payload) {
    state.parsedCost = payload;
  },
  updateReportAll(state, payload) {
    state.reportAll = payload;
  },
  updateReportIntern(state, payload) {
    state.reportIntern = payload;
  },
  updateReportExtern(state, payload) {
    state.reportExtern = payload;
  },
  updateReport(state, payload) {
    state.report = payload;
  }
};

const actions = {
  updateData({ commit }, payload) {
    commit("updateData", payload);
  },
  updateDataExtern({ commit }, payload) {
    commit("updateDataExtern", payload);
  },
  updateDataAll({ commit }, payload) {
    commit("updateDataAll", payload);
  },
  updateHistory({ commit }, payload) {
    commit("updateHistory", payload);
  },
  updateHistoryExtern({ commit }, payload) {
    commit("updateHistoryExtern", payload);
  },
  updateHistoryAll({ commit }, payload) {
    commit("updateHistoryAll", payload);
  },
  updatePareto({ commit }, payload) {
    commit("updatePareto", payload);
  },
  updateParetoExtern({ commit }, payload) {
    commit("updateParetoExtern", payload);
  },
  updateParetoAll({ commit }, payload) {
    commit("updateParetoAll", payload);
  },
  updateFilter({ commit }, payload) {
    commit("updateFilter", payload);
  },
  updatePPM({ commit }, payload) {
    commit("updatePPM", payload);
  },
  updateCost({ commit }, payload) {
    commit("updateCost", payload);
  },
  updateReportAll({ commit }, payload) {
    commit("updateReportAll", payload);
  },
  updateReportIntern({ commit }, payload) {
    commit("updateReportIntern", payload);
  },
  updateReportExtern({ commit }, payload) {
    commit("updateReportExtern", payload);
  },

  updateReport({ commit }, payload) {
    commit("updateReport", payload);
  }
};

const getters = {
  getData: state => {
    return state.parsedData;
  },
  getDataExtern: state => {
    return state.parseDataExtern;
  },
  getDataAll: state => {
    return state.parseDataAll;
  },
  getHistory: state => {
    return state.parsedHistory;
  },
  getHistoryExtern: state => {
    return state.parsedHistoryExtern;
  },
  getHistoryAll: state => {
    return state.parsedHistoryAll;
  },
  getPareto: state => {
    return state.parsedPareto;
  },
  getParetoExtern: state => {
    return state.parsedParetoExtern;
  },
  getParetoAll: state => {
    return state.parsedParetoAll;
  },
  getFilter: state => {
    return state.parsedFilter;
  },
  getPPM: state => {
    return state.parsedPPM;
  },
  getCost: state => {
    return state.parsedCost;
  },
  getReportAll: state => {
    return state.reportAll;
  },
  getReportIntern: state => {
    return state.reportIntern;
  },
  getReportExtern: state => {
    return state.reportExtern;
  },
  getReport: state => {
    return state.report;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
