<template>
  <div class="q-app">
    <!--<img id="reportbg" v-show="false" src="../assets/report-bg.png" />-->
    <div class="q-pa-md q-gutter-xs">
      <div class="row q-gutter-md justify-right">
        <q-input v-model="textYear" dense square outlined label="Jahr" @keyup="numericYear">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="clear" @click.stop="textYear = ''"></q-icon>
          </template>
        </q-input>
        <q-input v-model="textSearch" dense square outlined label="Suche" @keyup="upperCaseSearch">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="clear" @click.stop="textSearch = ''"></q-icon>
          </template>
        </q-input>
        <q-radio dense v-model="option" val="machine" label="Maschine"></q-radio>
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
        <q-btn dense flat :disable="save" class="q-ml-xs" icon="save" @click="createPdf()"></q-btn>
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
      save: true,
      pdfDoc: "",
      svgBar: "",
      svgPareto: "",
      base64Bg: "",
      htmlTableFeatures: "",
      htmlTableSummary: "",
      errors: []
    };
  },
  methods: {
    createPdf() {
      /*
      const opt = {
        margin: 0,
        filename: "Report.pdf",
        image: { type: "svg" },
        html2canvas: { scale: 1.5, logging: true, allowTaint: false },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" }
      };
      HTML2pdf()
        .set(opt)
        .from(this.pdfDoc)
        .save();
      */
      const { dialog, app } = require("electron").remote;
      const fs = require("fs");

      const options = {
        title: "Speichern unter...",
        defaultPath: app.getPath("documents"),
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
          fs.writeFile(filename, this.pdfDoc, err => {
            if (err) {
              alert("an error ocurred with file creation " + err.message);
              return;
            }
            alert("WE CREATED YOUR FILE SUCCESFULLY");
          });
          alert("we End");
        })
        .catch(err => {
          alert(err);
        });
    },
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
      this.save = true;
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
    reportDoc() {
      // const bgImg = document.getElementById("reportbg").src;
      this.pdfDoc = `
                        <!DOCTYPE html>
                        <html>
                        <!--
                        * HTML-Sheets-of-Paper (https://github.com/delight-im/HTML-Sheets-of-Paper)
                        * Copyright (c) delight.im (https://www.delight.im/)
                        * Licensed under the MIT License (https://opensource.org/licenses/MIT)
                        -->
                        <head>
                          <meta charset="utf-8" />
                          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                          <meta
                            name="description"
                            content="Emulating real sheets of paper in web documents (using HTML and CSS)"
                          />
                          <title>Report</title>
                        </head>
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
                            padding-left: 2cm;
                            padding-top: 2cm;
                            padding-right: 2cm;
                            padding-bottom: 2cm;
                            background-image: url('data:image/png;base64,${this.base64Bg}'); 
                            background-size: contain;
                          }
                          @page {
                            orphans: 4;
                            widows: 2;
                            size: A4 portrait;
                            margin-left: 2cm;
                            margin-top: 2cm;
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
                              background-image: url('data:image/png;base64,${this.base64Bg}') !important;
                              background-size: contain !important; 
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
                        <body class="document">
                          <div id="background">
                            <div class="page">
                              <h3>Zusammenfassung für ${this.Dataset.Name}</h3>
                              <p>${this.htmlTableSummary}</p>
                            </div>

                            <div class="page">
                              <h3>Reklamationen ppm pro Kalenderwoche</h3>
                              <img style='width:100%;height:100%;' src='data:image/svg+xml;base64,${this.svgBar}'/>
                              </div>
                            </div>

                            <div class="page">
                              <h3>Pareto ppm</h3>
                              <img style='width:100%;height:100%;' src='data:image/svg+xml;base64,${this.svgPareto}'/>
                              </div>
                            </div>

                            <div class="page">
                              <h3>Detailansicht Merkmal Reklamationen pro KW</h3>
                              <p>${this.htmlTableFeatures}</p>
                            </div>
                          </div>
                        </body>
                        </html>
                        `;
    },
    callBase64SVG() {
      this.$axios
        .get("http://192.168.8.218:5000/svgdefectcollection")
        .then(response => {
          const seed = response.data;
          this.svgBar = seed.bar;
          this.svgPareto = seed.pareto;
          this.base64Bg = seed.bg;
          this.htmlTableFeatures = seed.features;
          this.htmlTableSummary = seed.summary;
          this.save = false;
          this.reportDoc();
        })
        .catch(error => {
          this.errors.push(error);
          this.save = false;
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
