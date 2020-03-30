<template>
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
          name="extern"
          label="Externe Reklamationen"
          @click="setTab('extern')"
        ></q-tab>
        <q-tab
          name="all"
          label="Gesamte Reklamationen"
          @click="setTab('all')"
        ></q-tab>
      </q-tabs>
      <div class="row q-gutter">
        <q-tab-panels class="col-12" v-model="tab" animated>
          <q-tab-panel name="intern">
            <DataTable
              :tab="tab"
              :oldTab="oldTab"
              v-bind:key="tab"
              @dataChanged="getData()"
            />
          </q-tab-panel>
          <q-tab-panel name="extern">
            <DataTable
              :tab="tab"
              :oldTab="oldTab"
              v-bind:key="tab"
              @dataChanged="getData()"
            />
          </q-tab-panel>
          <q-tab-panel name="all">
            <DataTable
              :tab="tab"
              :oldTab="oldTab"
              v-bind:key="tab"
              @dataChanged="getData()"
            />
          </q-tab-panel>
        </q-tab-panels>
        <div class="col-xs-6">
          <HistChart :tab="tab" v-bind:key="tab" ref="histChart" />
        </div>
        <div class="col-xs-6">
          <Pareto :tab="tab" v-bind:key="tab" ref="paretoChart" />
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
    ...mapGetters({
      Tab: "states/getTab",
      History: "dataset/getHistory",
      HistoryAll: "dataset/getHistoryAll",
      HistoryExtern: "dataset/getHistoryExtern",
      Pareto: "dataset/getPareto",
      ParetoAll: "dataset/getParetoAll",
      ParetoExtern: "dataset/getParetoExtern"
    })
  },
  data() {
    return {
      tab: "intern",
      oldTab: "intern"
    };
  },
  methods: {
    ...mapActions("states", ["updateTab"]),
    ...mapActions("dataset", [
      "updateHistory",
      "updateHistoryAll",
      "updateHistoryExtern",
      "updatePareto",
      "updateParetoAll",
      "updateParetoExtern"
    ]),
    setTab(tab) {
      this.tab = tab;
      this.updateTab(tab);
    },
    getData() {
      this.$axios.get("http://192.168.8.218:5000/histogram").then(response => {
        const seed = JSON.parse(response.data);
        this.getDataHistory(seed);
      });

      this.$axios.get("http://192.168.8.218:5000/pareto").then(response => {
        const seed = JSON.parse(response.data);
        this.getDataPareto(seed);
      });
    },
    getDataHistory(seed) {
      switch (this.tab) {
        case "intern":
          this.updateHistory(seed);
          break;
        case "extern":
          this.updateHistoryExtern(seed);
          break;
        case "all":
          this.updateHistoryAll(seed);
          break;
      }
      this.$refs.histChart.fillData();
    },
    getDataPareto(seed) {
      switch (this.tab) {
        case "intern":
          this.updatePareto(seed);
          break;
        case "extern":
          this.updateParetoExtern(seed);
          break;
        case "all":
          this.updateParetoAll(seed);
          break;
      }
      this.$refs.paretoChart.fillPareto();
    }
  },
  mounted() {
    this.tab = this.Tab;
  }
};
</script>
