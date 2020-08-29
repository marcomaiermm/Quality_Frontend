const state = {
  menuDashboardIntern: {},
  menuDashboardExtern: {},
  menuDefectCollectionCard: {}
};

const mutations = {
  updateMenuDashboardIntern(state, payload) {
    state.menuDashboardIntern = payload;
  },
  updateMenuDashboardExtern(state, payload) {
    state.menuDashboardExtern = payload;
  },
  updateMenuDefectCollectionCard(state, payload) {
    state.menuDefectCollectionCard = payload;
  }
};

const actions = {
  updateMenuDashboardIntern({ commit }, payload) {
    commit("updateMenuDashboardIntern", payload);
  },
  updateMenuDashboardExtern({ commit }, payload) {
    commit("updateMenuDashboardExtern", payload);
  },
  updateMenuDefectCollectionCard({ commit }, payload) {
    commit("updateMenuDefectCollectionCard", payload);
  }
};

const getters = {
  getMenuIntern: state => {
    return state.menuDashboardIntern;
  },
  getMenuExtern: state => {
    return state.menuDashboardExtern;
  },
  getMenuDefectCollection: state => {
    return state.menuDefectCollectionCard;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
