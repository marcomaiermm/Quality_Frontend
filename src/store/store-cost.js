const state = {
  head: 5,
  select: "Material",
  costs: [],
};

const mutations = {
  updateHead(state, payload) {
    state.head = payload;
  },
  updateSelect(state, payload) {
    state.select = payload;
  },
  updateCosts(state, payload) {
    state.costs = payload;
  },
};

const actions = {
  updateHead({
    commit
  }, payload) {
    commit("updateHead", payload);
  },
  updateSelect({
    commit
  }, payload) {
    commit("updateSelect", payload);
  },
  updateCosts({
    commit
  }, payload) {
    commit("updateCosts", payload);
  },
};

const getters = {
  getHead: state => {
    return state.head;
  },
  getSelect: state => {
    return state.select;
  },
  getCosts: state => {
    return state.costs;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
