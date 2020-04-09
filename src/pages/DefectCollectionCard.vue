<template>
  <div class="q-app">
    <div class="q-pa-md q-gutter-xs">
      <div class="row q-gutter-md justify-right">
        <q-input v-model="textYear" dense square outlined label="Jahr">
          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              name="clear"
              @click.stop="textYear = ''"
            ></q-icon> </template
        ></q-input>
        <q-input v-model="textSearch" dense square outlined label="Suche">
          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              name="clear"
              @click.stop="textSearch = ''"
            ></q-icon> </template
        ></q-input>
        <q-radio
          dense
          v-model="option"
          val="machine"
          label="Maschine"
        ></q-radio>
        <q-radio dense v-model="option" val="part" label="Teil"></q-radio>
        <q-radio dense v-model="option" val="order" label="Auftrag"></q-radio>
        <q-btn
          dense
          flat
          class="q-ml-xs"
          icon="refresh"
          @click="refreshData()"
        ></q-btn>
      </div>
      <q-separator></q-separator>
      <div class="features">
        <DefectCollectionTable
          :dataset="DefectCollection"
          :loading="loading"
          :table="'features'"
          :subject="Dataset.Name"
        />
      </div>
      <div class="summary">
        <DefectCollectionTable :dataset="Summary" :loading="loading" />
      </div>
      <q-separator></q-separator>
      <div class="row justify-between">
        <div class="col">
          <DefectCollectionChart ref="chart" />
        </div>
        <div class="col">
          <DefectCollectionPareto ref="pareto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "DefectCollectionCard",
  components: {
    DefectCollectionTable: () => import("../components/DefectCollectionTable"),
    DefectCollectionPareto: () =>
      import("../components/DefectCollectionPareto"),
    DefectCollectionChart: () => import("../components/DefectCollectionChart")
  },
  watch: {
    option() {
      this.textSearch = "";
      this.textYear = "";
    }
  },
  computed: {
    ...mapGetters({
      Dataset: "defectCollection/getDataset",
      Chart: "defectCollection/getChart",
      DefectCollection: "defectCollection/getDefectCollectionCard",
      Pareto: "defectCollection/getPareto",
      Summary: "defectCollection/getSummary"
    })
  },
  data() {
    return {
      textSearch: "",
      textYear: "",
      option: "machine",
      loading: false
    };
  },
  methods: {
    refreshData() {
      this.loading = true;
      this.updateDefectCollectionCard([]);
      this.updateSummary([]);
      this.$axios
        .get("http://192.168.8.218:5000/defectcollectioncard", {
          params: {
            year: this.textYear,
            search: this.textSearch,
            option: this.option
          }
        })
        .then(response => {
          const seed = response.data;
          const chart = JSON.parse(seed.Chart);
          const defectCollectionCard = JSON.parse(seed.Fehlersammelkarte);
          const pareto = JSON.parse(seed.Pareto);
          const summary = JSON.parse(seed.Zusammenfassung);

          this.updateDataset(seed);
          this.updateDefectCollectionCard(defectCollectionCard);
          this.updateSummary(summary);
          this.updateChart(chart["Reklamationen pro eine million Teile"]);
          this.updatePareto(pareto);

          this.loading = false;

          this.$refs.chart.fillData();
          this.$refs.pareto.fillPareto();
        });
    },
    ...mapActions("defectCollection", [
      "updateDataset",
      "updateChart",
      "updateDefectCollectionCard",
      "updatePareto",
      "updateSummary"
    ])
  }
};
</script>
