<template>
  <div class="q-app">
    <div class="q-pa-md q-gutter-xs">
      <div class="row q-gutter-md justify-right">
        <q-input
          v-model="textYear"
          dense
          square
          outlined
          label="Jahr"
          @keyup="numericYear"
        >
          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              name="clear"
              @click.stop="textYear = ''"
            ></q-icon>
          </template>
        </q-input>
        <q-input
          v-model="textSearch"
          dense
          square
          outlined
          label="Suche"
          @keyup="upperCaseSearch"
        >
          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              name="clear"
              @click.stop="textSearch = ''"
            ></q-icon>
          </template>
        </q-input>
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
          :disable="DisableButton"
          class="q-ml-xs"
          icon="refresh"
          @click="refreshData()"
        ></q-btn>
        <q-btn
          dense
          flat
          :disable="DisableButton"
          class="q-ml-xs"
          icon="save"
          @click="saveCharts()"
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
import HTML2pdf from "html2pdf.js";
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
    DisableButton() {
      //  Die Eingabe der Textfelder wird hier vorgefiltert
      if (this.textSearch !== "" && this.textYear !== "") {
        if (this.textYear.length === 2 || this.textYear.length === 4) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
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
      loading: false,
      errors: []
    };
  },
  methods: {
    saveCharts() {
      const chartHistory = this.$refs.chart.printChart();
      const chartPareto = this.$refs.pareto.printChart();
      // const element = document.createElement("a");
      let typ = "";
      // const win = window.open("", "Print", "height=600,width=800");
      switch (this.option) {
        case "machine":
          typ = "Maschine";
          break;
        case "part":
          typ = "Teil";
          break;
        case "order":
          typ = "Auftrag";
          break;
        default:
          break;
      }
      const content =
        "<div style='font-size:18px'>Fehlersammelkarte von " +
        typ +
        " " +
        this.Dataset.Name +
        "</div>" +
        "<div>Reklamationen ppm</div>" +
        chartHistory +
        "<div>Pareto Merkmale</div>" +
        chartPareto;
      const opt = {
        margin: 0,
        filename: "save.pdf",
        image: { type: "jpg", quality: 1 },
        html2canvas: {
          scale: 1.5,
          letterRendering: true,
          width: 1100,
          height: 800
        },
        jsPDF: {
          orientation: "l"
        }
      };
      HTML2pdf()
        .set(opt)
        .from(content)
        .save();
    },
    numericYear() {
      // Alle nicht numerische chars entfernen \D ist regex und eine "kurze" char Klasse für alle non-digits
      this.textYear = this.textYear.replace(/\D/g, "");
      if (this.textYear.length > 4) {
        this.textYear = "";
      }
    },
    upperCaseSearch() {
      this.textSearch = this.textSearch.replace(" ", "_");
      this.textSearch = this.textSearch.toUpperCase();
    },
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
          this.callBase64SVG();

          this.$refs.chart.fillData();
          this.$refs.pareto.fillPareto();
        })
        .catch(error => {
          if (this.$axios.isCancel(error)) {
            console.log("Request canceled", error.message);
          } else {
            this.showNotification();
            this.loading = false;
            // handle error
            this.errors.push(error);
          }
        });
    },
    callBase64SVG() {
      this.$axios
        .get("http://192.168.8.218:5000/svgdefectcollection")
        .then(response => {
          const seed = response.data;
          const barSVG = seed.bar;
          const paretoSVG = seed.pareto;
          console.log("bar_svg: " + barSVG);
          console.log("pareto_svg: " + paretoSVG);
        })
        .catch(error => {
          this.errors.push(error);
        });
    },
    showNotification() {
      this.$q.notify({
        position: "top",
        type: "negative",
        message: "Eingabe überprüfen"
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
