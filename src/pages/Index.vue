<template>
  <!--<q-page class="flex flex-center">-->
  <div class="q-app">
    <div class="q-pa-md">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        narrow-indicator
        align="center"
      >
        <q-tab
          name="intern"
          label="Interne Reklamationen"
          @click="setTab('intern')"
        ></q-tab>
        <q-tab
          name="lieferant"
          label="Lieferanten Reklamationen"
          @click="setTab('lieferant')"
        ></q-tab>
        <q-tab
          name="kunde"
          label="Kunden Reklamationen"
          @click="setTab('kunde')"
        ></q-tab>
      </q-tabs>
      <div class="row q-gutter">
        <!--<div class="row q-col-gutter-md justify-between">
        <button @click="internal = true">Internal</button>
        <button @click="internal = false">External</button>
        -->

        <q-tab-panels class="col-12" v-model="tab" animated>
          <q-tab-panel name="intern">
            <DataTable :tab="tab" :oldTab="oldTab" v-bind:key="tab" />
          </q-tab-panel>
          <q-tab-panel name="lieferant">
            <DataTable :tab="tab" :oldTab="oldTab" v-bind:key="tab" />
          </q-tab-panel>
          <q-tab-panel name="kunde">
            <DataTable :tab="tab" :oldTab="oldTab" v-bind:key="tab" />
          </q-tab-panel>
        </q-tab-panels>

        <!--<DataTable v-else :internal="false" /> <DataTable v-if="internal == false" :internal="false" />-->
        <div class="col-xs-6">
          <HistChart :tab="tab" v-bind:key="tab" />
        </div>
        <div class="col-xs-6">
          <Pareto :tab="tab" v-bind:key="tab" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PageIndex",
  components: {
    DataTable: () => import("../components/Table"),
    Pareto: () => import("../components/ParetoChart"),
    HistChart: () => import("../components/HistoryChartStacked")
  },
  computed: {
    ...mapGetters({ Tab: "states/getTab" })
  },
  data() {
    return {
      tab: "intern",
      oldTab: "intern"
    };
  },
  /*
  watch: {
    tab: function(newData, oldData) {
      this.oldTab = oldData;
      this.updateTab(newData);
    }
  },
  */
  methods: {
    ...mapActions("states", ["updateTab"]),
    setTab(tab) {
      this.tab = tab;
      this.updateTab(tab);
    }
  },
  mounted() {
    this.tab = this.Tab;
  }
};
</script>
