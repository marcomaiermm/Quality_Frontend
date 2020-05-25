<template>
  <div class="q-app">
    <!--<img id="reportbg" v-show="false" src="../assets/report-bg.png" />-->
    <div class="q-pa-md q-gutter-xs">
      <div class="row q-gutter-md justify-right">
        <div>
          <q-btn dense flat icon="tune" @click="persistent = true">
            <q-tooltip content-class="bg-accent" anchor="top left">Auswahl</q-tooltip>
          </q-btn>

          <q-dialog
            v-model="persistent"
            no-backdrop-dismiss
            transition-show="scale"
            transition-hide="scale"
          >
            <FilterMenu :savedConfig="configOption" @saveConfigEmit="saveConfig" />
          </q-dialog>
          <!--
          <q-toggle
            :label="lanModel"
            icon="g_translate"
            color="primary"
            false-value="de"
            true-value="en"
            v-model="lanModel"
            keep-color
          ></q-toggle>
          -->
          <q-btn
            dense
            flat
            :disable="DisableButton"
            class="q-ml-xs"
            icon="refresh"
            @click="refreshData()"
          >
            <q-tooltip v-if="!loading" content-class="bg-accent" anchor="top left">Aktualisieren</q-tooltip>
          </q-btn>
        </div>
        <q-separator vertical inset></q-separator>
        <q-btn
          dense
          flat
          :disable="DisableSave"
          class="q-ml-xs"
          icon="save"
          @click="createReport()"
        >
          <q-tooltip content-class="bg-accent" anchor="top left">Report speichern...</q-tooltip>
        </q-btn>
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
// import { Platform } from "quasar";
export default {
  name: "DefectCollectionCard",
  components: {
    DefectCollectionTable: () =>
      import("../components/DefectCollectionCart/DefectCollectionTable"),
    DefectCollectionPareto: () =>
      import("../components/DefectCollectionCart/DefectCollectionPareto"),
    DefectCollectionChart: () =>
      import("../components/DefectCollectionCart/DefectCollectionChart"),
    FilterMenu: () => import("../components/DefectCollectionCart/FilterMenuDCC")
  },
  watch: {},
  computed: {
    DisableButton() {
      if (this.loading === true) {
        return true;
      }
      if (
        this.configOption.year !== "" &&
        typeof this.configOption.year !== "undefined"
      ) {
        return false;
      } else {
        return true;
      }
    },
    DisableSave() {
      if (Object.keys(this.Dataset).length > 0) {
        return false;
      } else {
        return true;
      }
    },
    ...mapGetters({
      Dataset: "defectCollection/getDataset",
      Chart: "defectCollection/getChart",
      DefectCollection: "defectCollection/getDefectCollectionCard",
      Pareto: "defectCollection/getPareto",
      Summary: "defectCollection/getSummary",
      Report: "defectCollection/getReport",
      Config: "config/getCfg"
    })
  },
  data() {
    return {
      persistent: false,
      configOption: {},
      save: true,
      loading: false,
      svgBar: "",
      svgPareto: "",
      base64Bg: "",
      htmlTableFeatures: "",
      htmlTableSummary: "",
      errors: [],
      cancelToken: null,
      source: null
    };
  },
  methods: {
    saveConfig(value) {
      this.configOption = value;
    },
    createReport() {
      if (this.$q.platform.is.electron) {
        const { dialog, app } = require("electron").remote;
        const fs = require("fs");

        const options = {
          title: "Speichern unter...",
          defaultPath:
            app.getPath("documents") + "/Report-" + new Date().getTime(),
          filters: [
            { name: "All Files", extensions: ["*"] },
            { name: "Html", extensions: ["html"] }
          ],
          properties: ["openFile"]
        };

        dialog
          .showSaveDialog(null, options)
          .then(result => {
            const filename = result.filePath;
            if (filename === undefined) {
              alert("Kein Name eingegeben.");
              return;
            }
            fs.writeFile(filename, this.Report, err => {
              if (err) {
                if (err.code !== "ENOENT") {
                  alert("Fehler: " + err.message);
                  return;
                }
                return;
              }
              alert("Datei erfolgreich gespeichert");
            });
          })
          .catch(err => {
            alert(err);
          });
      } else {
        const blob = new Blob([this.Report], { type: "text/html" });
        const download = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = download;
        a.download = "Report-" + new Date().getTime();
        document.body.appendChild(a);
        a.click();
      }
    },
    refreshData() {
      this.save = true;
      this.loading = true;

      this.cancelToken = this.$axios.CancelToken;
      this.source = this.cancelToken.source();
      this.updateDefectCollectionCard([]);
      this.updateSummary([]);

      this.$axios
        .get("http://pc0547.allweier.lcl:5000/defectcollectioncard", {
          cancelToken: this.source.token,
          params: {
            year: this.configOption.year,
            weeks: JSON.stringify(this.configOption.weeks),
            parts: JSON.stringify(this.configOption.parts),
            orders: JSON.stringify(this.configOption.orders),
            process: JSON.stringify(this.configOption.process),
            machines: JSON.stringify(this.configOption.machines),
            customer: JSON.stringify(this.configOption.customer),
            tab: this.configOption.tab,
            lang: this.configOption.lang
          }
        })
        .then(response => {
          const seed = response.data;
          const chart = JSON.parse(seed.Chart);
          const defectCollectionCard = JSON.parse(seed.Fehlersammelkarte);
          const pareto = JSON.parse(seed.Pareto);
          const summary = JSON.parse(seed.Zusammenfassung);

          // Byte64 Images und HTML Tabellen
          this.svgBar = seed.bar;
          this.svgPareto = seed.pareto;
          this.base64Bg = seed.bg;
          this.htmlTableFeatures = seed.features;
          this.htmlTableSummary = seed.summary;
          // this.reportDoc();

          this.updateDataset(seed);
          this.updateDefectCollectionCard(defectCollectionCard);
          this.updateSummary(summary);
          this.updateChart(chart["Reklamationen pro eine million Teile"]);
          this.updatePareto(pareto);

          this.reportDoc();

          this.loading = false;
          this.save = false;
          this.$refs.chart.fillData();
          this.$refs.pareto.fillPareto();
        })
        .catch(error => {
          if (this.$axios.isCancel(error)) {
            console.log("Request canceled", error.message);
          } else {
            this.showNotification();
            this.loading = false;
            this.save = false;
            // handle error
            this.errors.push(error);
          }
        });
    },
    reportDoc() {
      const englishTxt = {
        summary: "Summary",
        paretoCW: "Complaints ppm per calendar week",
        features: "Detailed view of complaints per calendar week",
        name: this.Dataset.Name_t
      };
      const germanTxt = {
        summary: "Zusammenfassung",
        paretoCW: "Reklamationen ppm pro Kalenderwoche",
        features: "Detailansicht Merkmal Reklamationen pro KW",
        name: this.Dataset.Name
      };
      let text = germanTxt;
      if (this.configOption.lang === "en") {
        text = englishTxt;
      }
      const head = `
                  <head>
                    <meta charset="utf-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta
                      name="description"
                      content="Emulating real sheets of paper in web documents (using HTML and CSS)"
                    />
                    <title>Report</title>
                  </head>
      `;
      const style = `
                        <style>
                          html,
                          body {
                            margin: 0;   
                            padding: 0;
                            font-family: "Roboto", -apple-system, "San Francisco", "Segoe UI",
                              "Helvetica Neue", sans-serif;
                            font-size: 12pt;
                            background-color: #eee;
                          }
                          * {
                            box-sizing: border-box;
                            -moz-box-sizing: border-box;
                            position: relative;
                          }
                          table {
                            table-layout: fixed;
                            background-color: #FFFFFF;
                            width: 100%;
                            height: 100%;
                            padding: 0;
                            border-spacing: 0;
                          }
                          th, td{
                              width: 100%;
                              border: 1px solid #AAAAAA;
                              font-size: 9px;
                              text-align: center; 
                          }
                          th {
                            font-size: 9px;
                            font-weight: bold;
                            word-wrap: break-word;
                          }
                          tr:nth-child(even) {
                            background: #BFD1E3;
                          }
                          thead{
                            background: #01468e;
                            background: -moz-linear-gradient(top, #4076e8 0%, #195ae3 66%, #01468e 100%);
                            background: -webkit-linear-gradient(top, #4076e8 0%, #195ae3 66%, #01468e 100%);
                            background: linear-gradient(to bottom, #4076e8 0%, #195ae3 66%, #01468e 100%);
                            border-bottom: 2px solid #444444;
                          }
                          thead th{
                            font-weight: bold;
                            color: #FFFFFF;
                            border-left: 1px solid #D0E4F5;
                          }
                          thead th:first-child {
                            border-left: none;
                          }
                          .page {
                            margin: 1cm auto;
                            box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);
                            outline: 0;
                            background: #fff;
                            width: 21cm;
                            min-height: 29.7cm;
                            /*
                            background-image: url('data:image/png;base64,${this.base64Bg}'); 
                            background-size: contain;
                            */
                          }
                          .padded {
                            padding-left: 2cm;
                            padding-top: 2.5cm;
                            padding-right: 2cm;
                            padding-bottom: 2cm;
                          }
                          @page {
                            orphans: 4;
                            widows: 2;
                            size: A4 portrait;
                          }
                          @padded {
                            margin-left: 2cm;
                            margin-top: 2.5cm;
                            margin-right: 2cm;
                            margin-bottom: 2cm;
                          }
                          div.page-break {
                            page-break-after: always;
                          }
                          h1 {
                            page-break-before: always;
                          }
                          h1,
                          h2,
                          h3,
                          h4,
                          h5,
                          h6 {
                            page-break-after: avoid;
                          }
                          p {
                            margin: 0;
                          }
                          p + p {
                            margin-top: 0.5cm;
                          }
                          a {
                            text-decoration: none;
                            color: black;
                          }
                          table {
                            page-break-inside: avoid;
                          }
                          .bg {
                            pointer-events: none;
                            position: absolute;
                            width: 100%
                          }
                          @media screen {
                            div.page-break::before {
                              content: "";
                              display: block;
                              height: 0.8cm;
                              margin-left: 0.5cm;
                              margin-right: 0.5cm;
                              background-color: #fff;
                              box-shadow: 0 6px 5px rgba(75, 75, 75, 0.2);
                            }
                            div.page-break {
                              display: block;
                              height: 1.8cm;
                              margin-left: -2.5cm;
                              margin-right: -2.5cm;
                              margin-top: 1.2cm;
                              margin-bottom: 2cm;
                              background: #eee;
                            }
                          }
                          @media print {
                            html,
                            body {
                              background-color: #fff;
                              /*
                              background-image: url('data:image/png;base64,${this.base64Bg}') !important;
                              background-size: contain !important; 
                              */
                            }
                            .page {
                              width: initial !important;
                              min-height: initial !important;
                              margin: 0 !important;
                              padding: 0 !important;
                              border: initial !important;
                              border-radius: initial !important;
                              background: initial !important;
                              box-shadow: initial !important;
                              page-break-after: always;
                            }
                          }
                          .flex-container {
                            display: flex;
                          }
                          .flex-container > div {
                            margin: 10px;
                            padding: 20px;
                          }
                        </style>      
      
      `;
      const body = `
                  <body class="document">

                      <div class="page">
                        <img class="bg" src='data:image/png;base64,${this.base64Bg}' />
                        <div class="padded">
                          <h3 contenteditable="true">${text.summary} ${text.name}</h3>
                          <p>${this.htmlTableSummary}</p>
                        </div>
                      </div>
                      <div class="page">
                        <img class="bg" src='data:image/png;base64,${this.base64Bg}' />
                        <div class="padded">
                          <h3 contenteditable="true">${text.paretoCW}</h3>
                          <p><img style='width:100%;height:100%;' src='data:image/svg+xml;base64,${this.svgBar}'/></p>
                          <h3 contenteditable="true">Pareto ppm</h3>
                          <img style='width:100%;height:100%;' src='data:image/svg+xml;base64,${this.svgPareto}'/>
                        </div>
                      </div>

                      <div class="page">
                        <img class="bg" src='data:image/png;base64,${this.base64Bg}' />
                        <div class="padded">
                          <h3 contenteditable="true">${text.features}</h3>
                          <p>${this.htmlTableFeatures}</p>
                        </div>
                      </div>
                    </div>
                  </body>
      `;
      const html = `
                  <!DOCTYPE html>
                  <html>
                  <!--
                  * HTML-Sheets-of-Paper (https://github.com/delight-im/HTML-Sheets-of-Paper)
                  * Copyright (c) delight.im (https://www.delight.im/)
                  * Licensed under the MIT License (https://opensource.org/licenses/MIT)
                  -->
                  ${head}
                  ${style}
                  ${body}
                  </html>
      
      `;

      this.updateReport(html);
    },
    showNotification() {
      this.$q.notify({
        position: "top",
        type: "negative",
        message: "Eingabe überprüfen"
      });
    },
    ...mapActions("config", ["updateConfig"]),
    ...mapActions("defectCollection", [
      "updateDataset",
      "updateChart",
      "updateDefectCollectionCard",
      "updatePareto",
      "updateSummary",
      "updateReport"
    ])
  },
  mounted() {},
  created() {
    // NUR  FÜR DEV ZWECKE! HOT RELOAD => REFERENZ index.vue
    if (Object.keys(this.Config).length < 2) {
      const config = {};
      this.$axios.get("http://pc0547.allweier.lcl:5000/cfg").then(response => {
        const seed = response.data;

        Object.keys(seed).forEach(element => {
          const set = JSON.parse(seed[element]);
          const key = Object.keys(set[0]);
          config[element] = Object.values(set)
            .map(item => item[key])
            .sort();
        });
        this.updateConfig(config);
      });
    }
  },
  beforeDestroy() {
    if (this.source) {
      this.source.cancel("Operation canceled by the user.");
    }
  }
};
</script>
