const state = {
  dataset: [],
  chart: [],
  defectCollectionCard: [],
  pareto: [],
  summary: []
};

const mutations = {
  updateDataset(state, payload) {
    state.dataset = payload;
  },
  updateChart(state, payload) {
    state.chart = payload;
  },
  updateDefectCollectionCard(state, payload) {
    state.defectCollectionCard = payload;
  },
  updatePareto(state, payload) {
    state.pareto = payload;
  },
  updateSummary(state, payload) {
    state.summary = payload;
  }
};

const actions = {
  updateDataset({ commit }, payload) {
    commit("updateDataset", payload);
  },
  updateChart({ commit }, payload) {
    commit("updateChart", payload);
  },
  updateDefectCollectionCard({ commit }, payload) {
    commit("updateDefectCollectionCard", payload);
  },
  updatePareto({ commit }, payload) {
    commit("updatePareto", payload);
  },
  updateSummary({ commit }, payload) {
    commit("updateSummary", payload);
  }
};

const getters = {
  getDataset: state => {
    return state.dataset;
  },
  getChart: state => {
    return state.chart;
  },
  getDefectCollectionCard: state => {
    return state.defectCollectionCard;
  },
  getPareto: state => {
    return state.pareto;
  },
  getSummary: state => {
    return state.summary;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
