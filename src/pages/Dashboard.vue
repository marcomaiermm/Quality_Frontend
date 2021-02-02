<template>
  <div class="q-app">
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
      <!--<q-tab name="all" label="Gesamte Reklamationen" @click="setTab('all')"></q-tab>-->
    </q-tabs>
    <div class="row q-pl-xs">
      <q-tab-panels class="col-12" v-model="tab" animated>
        <q-tab-panel name="intern">
          <DataTable
            :tab="tab"
            :oldTab="oldTab"
            :load="loading"
            v-bind:key="tab"
            @refreshEmmit="onClickRefresh"
            @reportEmit="onClickReport"
            ref="dataTableIntern"
          />
        </q-tab-panel>
        <q-tab-panel name="extern">
          <DataTable
            :tab="tab"
            :oldTab="oldTab"
            :load="loading"
            v-bind:key="tab"
            @refreshEmmit="onClickRefresh"
            @reportEmit="onClickReport"
            ref="dataTableExtern"
          />
        </q-tab-panel>
        <!-- <q-tab-panel name="all">
          <DataTable
            :tab="tab"
            :oldTab="oldTab"
            :load="loading"
            v-bind:key="tab"
            @refreshEmmit="onClickRefresh"
            ref="dataTableAll"
          />
        </q-tab-panel>-->
      </q-tab-panels>
    </div>
    <div class="row q-pa-md">
      <div class="col-xs-6 q-pl-xs">
        <q-card flat>
          <HistChart :tab="tab" v-bind:key="tab" ref="histChart" />
        </q-card>
      </div>
      <div class="col-xs-6 q-pl-md">
        <q-card flat>
          <Pareto :tab="tab" v-bind:key="tab" ref="paretoChart" />
        </q-card>
      </div>
    </div>
    <div class="row q-pa-md">
      <div class="col-6 q-pl-xs">
        <q-card flat>
          <PieChart :tab="tab" ref="pieChart" />
        </q-card>
      </div>
      <div class="col-xs-6 q-pl-md">
        <q-card flat>
          <CostInfo :tab="tab" ref="costInfo" />
        </q-card>
      </div>
    </div>
    <div class="row q-pa-md">
      <div class="col-12 q-pl-xs">
        <q-card flat>
          <CostHistoryChart :tab="tab" ref="costHistory" />
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PageIndex",
  components: {
    DataTable: () => import("../components/Dashboard/Table"),
    Pareto: () => import("../components/Dashboard/ParetoChart"),
    HistChart: () => import("../components/Dashboard/HistoryChartStacked"),
    PieChart: () => import("../components/Dashboard/CostPieChart"),
    CostInfo: () => import("../components/Dashboard/CostInfo"),
    CostHistoryChart: () => import("../components/Dashboard/CostHistory"),
  },
  computed: {
    MenuData() {
      let data = {};
      switch (this.tab) {
        case "intern":
          data = this.MenuIntern;
          break;

        case "extern":
          data = this.MenuExtern;
          break;
      }
      return data;
    },
    ActivatedData() {
      let data = [];
      switch (this.tab) {
        case "intern":
          data = this.DataIntern;
          break;
        case "extern":
          data = this.DataExtern;
          break;
        case "all":
          data = this.DataExternAll;
          break;
      }
      return data;
    },
    ...mapGetters({
      DataIntern: "dataset/getData",
      DataExtern: "dataset/getDataExtern",
      DataExternAll: "dataset/getDataAll",
      MenuTab: "states/getMenuTab",
      Tab: "states/getTab",
      History: "dataset/getHistory",
      HistoryAll: "dataset/getHistoryAll",
      HistoryExtern: "dataset/getHistoryExtern",
      Pareto: "dataset/getPareto",
      ParetoAll: "dataset/getParetoAll",
      ParetoExtern: "dataset/getParetoExtern",
      // ReportAll: "dataset/getReportAll",
      ReportIntern: "dataset/getReportIntern",
      ReportExtern: "dataset/getReportExtern",
      Report: "dataset/getReport",
      Config: "config/getCfg",
      Path: "config/getPath",
      MenuIntern: "menuData/getMenuIntern",
      MenuExtern: "menuData/getMenuExtern",
    }),
  },
  data() {
    return {
      tab: "intern",
      oldTab: "intern",
      cancelToken: null,
      source: null,
      loading: false,
      extOption: "lieferant",
      cost: {
        data: [],
        label: {
          error: [],
          machine: [],
          part: [],
          order: [],
          process: [],
        },
      },
    };
  },
  methods: {
    getExtOptions(option) {
      this.extOption = option;
    },
    onClickRefresh(value) {
      this.getData(value);
    },
    onClickReport() {
      this.saveReport();
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
      "updateDataAll",
      "updateReportAll",
      "updateReportIntern",
      "updateReportExtern",
      "updateReport",
    ]),
    setTab(tab) {
      this.tab = tab;
      this.updateTab(tab);
      if (this.source) {
        this.source.cancel("Operation canceled by the user.");
      }
    },
    getData(parameter) {
      // {
      //   cancelToken: this.source.token,
      //   params: parameter,
      // }
      this.cancelToken = this.$axios.CancelToken;
      this.source = this.cancelToken.source();
      this.loading = true;

      this.$axios
        .post("http://" + this.Path.host + ":" + this.Path.port + "/datatable/", parameter)
        .then((response) => {
          const seed = response.data;
          this.update(seed);
        })
        .catch((error) => {
          if (this.$axios.isCancel(error)) {
            console.log("Request canceled", error.message);
          }
          console.log(error);
          this.loading = false;
        });

    },
    report() {},
    update(seed) {
      const data = JSON.parse(seed.table);
      const history = seed.history;
      const pareto = JSON.parse(seed.pareto);
      const report = seed.report;
      // const images = {
      //   cost: seed.base64.Kosten,
      //   hist: seed.base64.History,
      //   pareto: seed.base64.Pareto,
      //   gradient: seed.base64.Kostenverlauf,
      //   bg: seed.bg
      // };
      switch (this.tab) {
        case "intern":
          this.updateData(data);
          this.updateHistory(history);
          this.updatePareto(pareto);
          // this.updateReportIntern(images);
          this.updateReportIntern(report);
          this.$refs.dataTableIntern.refreshDataTable();
          break;
        case "extern":
          this.updateDataExtern(data);
          this.updateHistoryExtern(history);
          this.updateParetoExtern(pareto);
          this.updateReportExtern(report);
          this.$refs.dataTableExtern.refreshDataTable();
          break;
        case "all":
          this.updateDataAll(data);
          this.updateHistoryAll(history);
          this.updateParetoAll(pareto);
          // this.updateReportAll(images);
          this.updateReportAll(report);
          this.$refs.dataTableAll.refreshDataTable();
          break;
      }
      this.$refs.histChart.fillData();
      this.$refs.paretoChart.fillPareto();
      this.$refs.pieChart.fillPie();
      this.$refs.costInfo.fillData();
      if (this.MenuData.report === true) {
        this.createReportData();
      }
      this.loading = false;
    },
    createReportData() {
      let report = null;
      const filters = {
        machines: "",
        orders: "",
        parts: "",
        customer: "",
      };
      let customer = "";
      switch (this.tab) {
        case "intern":
          report = this.ReportIntern;
          break;
        case "extern":
          report = this.ReportExtern;
          if (this.MenuTab === "kunde") {
            customer = `<p class="filter-headline">Kunde/Customer</p><p>${filters.customer}</p>`;
          }
          break;
        case "all":
          report = this.ReportAll;
          break;
      }
      if (typeof this.MenuData.machines !== "undefined") {
        filters.machines = this.MenuData.machines.join(", ");
      }
      if (typeof this.MenuData.orders !== "undefined") {
        filters.orders = this.MenuData.orders.join(", ");
      }
      if (typeof this.MenuData.parts !== "undefined") {
        filters.parts = this.MenuData.orders.join(", ");
      }
      if (typeof this.MenuData.customer !== "undefined") {
        filters.customer = this.MenuData.customer.join(", ");
      }
      // if (typeof report.pareto === "undefined") {
      //   return;
      // }
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
                            background-image: url('data:image/png;base64,${report.background_img}');
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
                              background-image: url('data:image/png;base64,${report.background_img}') !important;
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
                          .filter-headline {
                            font-weight: bold;
                          }
                        </style>

      `;
      const body = `
                  <body class="document">

                      <div class="page">
                        <img class="bg" src='data:image/png;base64,${
                          report.background_img
                        }' />
                        <div class="padded">
                          <h3>
                          ${report.date.start.split(" ")[0]}
                          -
                          ${report.date.end.split(" ")[0]}
                          </h3>
                          <h3 contenteditable="true">Dashboard Reporting</h3>
                          <h3>Pareto</h3>
                          <img style='width:100%;height:300%;' src='data:image/svg+xml;base64,${
                            report.plots.Pareto
                          }'/>
                          <p style="font-size: 1.2rem; font-weight: bold;">Filter:</p>
                          <p class="filter-headline">Maschinen/Machines</p>
                          <p>${filters.machines}</p>
                          <p class="filter-headline">Auftrags-Nr./Order-no.</p>
                          <p>${filters.orders}</p>
                          <p class="filter-headline">Material/Parts</p>
                          <p>${filters.parts}</p>
                          <div>${customer}</div>
                        </div>
                      </div>

                      <div class="page">
                        <img class="bg" src='data:image/png;base64,${
                          report.background_img
                        }' />
                        <div class="padded">
                          <h3 contenteditable="true">Histogramme (Histograms) Top 10</h3>
                          <p>
                          <h4>Material / Parts</h4>
                          <img style='width:110%;height:100%;' src='data:image/svg+xml;base64,${
                            report.plots.History.parts
                          }'/>
                          </p>
                          <p>
                          <h4>Auftrag / Orders</h4>
                          <img style='width:100%;height:100%;' src='data:image/svg+xml;base64,${
                            report.plots.History.orders
                          }'/>
                          </p>
                        </div>
                      </div>
                      <div class="page">
                        <img class="bg" src='data:image/png;base64,${
                          report.background_img
                        }' />
                        <div class="padded">
                          <p>
                          <h4>Maschine / Machine</h4>
                          <img style='width:100%;height:100%;' src='data:image/svg+xml;base64,${
                            report.plots.History.machines
                          }'/>
                          </p>
                        </div>
                      </div>

                      <div class="page">
                        <img class="bg" src='data:image/png;base64,${
                          report.background_img
                        }' />
                        <div class="padded">
                          <h3 contenteditable="true">Kosten (Costs) Top 10</h3>
                          <h4>Material / Parts</h4>
                          <p><img style='display:block;margin-left:auto;margin-right:auto;width:70%;height:70%;' src='data:image/svg+xml;base64,${
                            report.plots.Kosten.MATERIAL
                          }'/></p>
                          <h4>Auftrag / Order</h4>
                          <p><img style='display:block;margin-left:auto;margin-right:auto;width:70%;height:70%;' src='data:image/svg+xml;base64,${
                            report.plots.Kosten.ORDER_ID
                          }'/></p>
                        </div>
                      </div>
                      <div class="page">
                        <img class="bg" src='data:image/png;base64,${
                          report.background_img
                        }' />
                        <div class="padded">
                          <h4>Maschine / Machine</h4>
                          <p><img style='display:block;margin-left:auto;margin-right:auto;width:70%;height:70%;' src='data:image/svg+xml;base64,${
                            report.plots.Kosten.MACHINE_NO
                          }'/></p>
                        </div>
                      </div>

                      <div class="page">
                        <img class="bg" src='data:image/png;base64,${
                          report.background_img
                        }' />
                        <div class="padded">
                          <h4>Kostenverlauf / Cost trend</h4>
                          <p><img style='display:block;margin-left:auto;margin-right:auto;width:100%;height:100%;' src='data:image/svg+xml;base64,${
                            report.plots.Kostenverlauf
                          }'/></p>
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
    saveReport() {
      if (this.$q.platform.is.electron) {
        const { dialog, app } = require("electron").remote;
        const fs = require("fs");

        const options = {
          title: "Speichern unter...",
          defaultPath:
            app.getPath("documents") +
            "/Dashboard-Report-" +
            new Date().getTime(),
          filters: [
            { name: "All Files", extensions: ["*"] },
            { name: "Html", extensions: ["html"] },
          ],
          properties: ["openFile"],
        };

        dialog
          .showSaveDialog(null, options)
          .then((result) => {
            const filename = result.filePath;
            if (filename === undefined) {
              alert("Kein Name eingegeben.");
              return;
            }
            fs.writeFile(filename, this.Report, (err) => {
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
          .catch((err) => {
            alert(err);
          });
      } else {
        const blob = new Blob([this.Report], { type: "text/html" });
        const download = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = download;
        a.download = "Dashboard-Report-" + new Date().getTime();
        document.body.appendChild(a);
        a.click();
      }
    },
  },
  beforeDestroy() {
    if (this.source) {
      this.source.cancel("Operation canceled by the user.");
    }
  },
};
</script>
<style lang="sass"></style>
