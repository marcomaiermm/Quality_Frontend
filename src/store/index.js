import Vue from "vue";
import Vuex from "vuex";

import dataset from "./store-data";
import states from "./store-state";
import defectCollection from "./store-defect-collection-card";
import config from "./store-cfg";
import menuData from "./store-menu";
import costOptions from "./store-cost";
import qCard from "./store-quality-card";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function ( /* { ssrContext } */ ) {
  const Store = new Vuex.Store({
    modules: {
      dataset,
      states,
      defectCollection,
      config,
      menuData,
      costOptions,
      qCard
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
