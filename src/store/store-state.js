const state = {
  tab: "intern",
  menuTab: "all"
};

const mutations = {
  updateTab(state, payload) {
    state.tab = payload;
  },
  updateMenuTab(state, payload) {
    state.menuTab = payload;
  }
};

const actions = {
  updateTab({ commit }, payload) {
    commit("updateTab", payload);
  },
  updateMenuTab({ commit }, payload) {
    commit("updateMenuTab", payload);
  }
};

const getters = {
  getTab: state => {
    return state.tab;
  },
  getMenuTab: state => {
    return state.menuTab;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
