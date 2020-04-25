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
        <q-tab name="intern" label="Interne Reklamationen" @click="setTab('intern')"></q-tab>
        <q-tab name="extern" label="Externe Reklamationen" @click="setTab('extern')"></q-tab>
        <q-tab name="all" label="Gesamte Reklamationen" @click="setTab('all')"></q-tab>
      </q-tabs>
      <div class="row q-gutter">
        <q-tab-panels class="col-12" v-model="tab" animated>
          <q-tab-panel name="intern">
            <DataTable
              :tab="tab"
              :oldTab="oldTab"
              v-bind:key="tab"
              @refreshEmmit="onClickRefresh"
              ref="dataTableIntern"
            />
          </q-tab-panel>
          <q-tab-panel name="extern">
            <DataTable
              :tab="tab"
              :oldTab="oldTab"
              v-bind:key="tab"
              @refreshEmmit="onClickRefresh"
              ref="dataTableExtern"
            />
          </q-tab-panel>
          <q-tab-panel name="all">
            <DataTable
              :tab="tab"
              :oldTab="oldTab"
              v-bind:key="tab"
              @refreshEmmit="onClickRefresh"
              ref="dataTableAll"
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
  <!--
            <DataTable
              :tab="tab"
              :oldTab="oldTab"
              v-bind:key="tab"
              @dataChanged="getData()"
              @testEmmit="onClickTest"
              ref="dataTableIntern"
            />
  -->
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
      MenuTab: "states/getMenuTab",
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
      oldTab: "intern",
      cancelToken: null,
      source: null
    };
  },
  methods: {
    onClickRefresh(value) {
      this.getData(value);
    },
    ...mapActions("states", ["updateTab"]),
    ...mapActions("dataset", [
      "updateHistory",
      "updateHistoryAll",
      "updateHistoryExtern",
      "updatePareto",
      "updateParetoAll",
      "updateParetoExtern",
      "updateData",
      "updateDataExtern",
      "updateDataAll"
    ]),
    setTab(tab) {
      this.tab = tab;
      this.updateTab(tab);
      if (this.source) {
        this.source.cancel("Operation canceled by the user.");
      }
    },
    getData(parameter) {
      this.cancelToken = this.$axios.CancelToken;
      this.source = this.cancelToken.source();
      this.loading = true;
      this.$axios
        .get("http://192.168.8.218:5000/datatable", {
          cancelToken: this.source.token,
          params: parameter
        })
        .then(response => {
          const seed = response.data;
          this.update(seed);
        })
        .catch(error => {
          if (this.$axios.isCancel(error)) {
            console.log("Request canceled", error.message);
          }
        });
    },
    update(seed) {
      const data = JSON.parse(seed.table);
      const history = JSON.parse(seed.history);
      const pareto = JSON.parse(seed.pareto);
      switch (this.tab) {
        case "intern":
          this.updateData(data);
          this.updateHistory(history);
          this.updatePareto(pareto);
          this.$refs.dataTableIntern.refreshDataTable();
          break;
        case "extern":
          this.updateDataExtern(data);
          this.updateHistoryExtern(history);
          this.updateParetoExtern(pareto);
          this.$refs.dataTableExtern.refreshDataTable();
          break;
        case "all":
          this.updateDataAll(data);
          this.updateHistoryAll(history);
          this.updateParetoAll(pareto);
          this.$refs.dataTableAll.refreshDataTable();
          break;
      }
      this.$refs.histChart.fillData();
      this.$refs.paretoChart.fillPareto();
      this.loading = false;
    }
  },
  mounted() {},
  beforeDestroy() {
    if (this.source) {
      this.source.cancel("Operation canceled by the user.");
    }
  }
};
</script>
