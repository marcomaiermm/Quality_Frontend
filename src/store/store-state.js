const state = {
  tab: "intern"
};

const mutations = {
  updateTab(state, payload) {
    state.tab = payload;
  }
};

const actions = {
  updateTab({ commit }, payload) {
    commit("updateTab", payload);
  }
};

const getters = {
  getTab: state => {
    return state.tab;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
