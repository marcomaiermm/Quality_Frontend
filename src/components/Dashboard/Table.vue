<template>
  <!-- css spacing classes q-[p|m][t|r|b|l|a|x|y]-[none|auto|xs|sm|md|lg|xl]
  type direction              size-->
  <!--<div class="q-mt-sm q-mr-md q-ml-md col">-->
  <div class="row">
    <div class="col">
      <q-table
        class="my-sticky-dynamic"
        title="Treats"
        :dense="$q.screen.lt.md"
        :data="Dataset"
        :columns="columns"
        :loading="load"
        :filter="filter"
        row-key="name"
        no-data-label="Noch keine Daten angekommen..."
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :visible-columns="visibleColumns"
        :sort-method="customSort"
      >
        <template v-slot:top>
          <div class="fit row wrap justify-between content-start">
            <div class="q-pa-xs col-1" style="min-width: 150px">
              <q-input
                filled
                dense
                v-model="startDate"
                mask="date"
                :rules="['date']"
                style="height: 50px"
                label="Von:"
                stack-label
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxyStart"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="startDate"
                        today-btn
                        @input="() => $refs.qDateProxyStart.hide()"
                      ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="q-pa-xs col-1" style="min-width: 150px">
              <q-input
                filled
                dense
                v-model="endDate"
                mask="date"
                :rules="['date']"
                style="height: 50px"
                label="Bis:"
                stack-label
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxyEnd"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="endDate"
                        today-btn
                        @input="() => $refs.qDateProxyEnd.hide()"
                      ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-1">
              <q-select
                v-model="weekNumber"
                dense
                outlined
                square
                label="Kalenderwoche"
                :options="calendarWeeks"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="weekNumber !== null"
                    class="cursor-pointer"
                    name="clear"
                    @click.stop="weekNumber = null"
                  ></q-icon>
                </template>
              </q-select>
            </div>
            <div class="col-1">
              <q-btn
                dense
                flat
                class="refresh-btn q-ml-xs"
                icon="refresh"
                :loading="load"
                @click="update()"
                :disable="load"
              >
                <q-tooltip
                  v-if="!load"
                  content-class="bg-accent"
                  anchor="top left"
                  >Aktualisieren</q-tooltip
                >
              </q-btn>
              <q-btn dense flat class="settings-btn q-ml-xs" icon="settings">
                <q-tooltip content-class="bg-accent" anchor="top left"
                  >Einstellungen</q-tooltip
                >
                <FilterMenu :tab="tab" />
              </q-btn>
              <q-btn
                dense
                flat
                class="save-btn q-ml-xs"
                icon="save"
                :disable="!Save"
                @click="report()"
              >
                <q-tooltip content-class="bg-accent" anchor="top right"
                  >Report erstellen..</q-tooltip
                >
              </q-btn>
            </div>
            <div class="col-2">
              <div class="text-overline text-9" v-if="tab == 'extern'">
                {{ ExtOption }}
              </div>
            </div>
            <q-space></q-space>
            <div class="col-2 q-mx-xs">
              <q-input dense v-model="filter" placeholder="Suche">
                <template v-slot:append>
                  <q-icon name="search"></q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-1 q-mx-xs">
              <q-select
                v-model="visibleColumns"
                multiple
                outlined
                square
                dense
                options-dense
                :display-value="$q.lang.table.columns"
                emit-value
                map-options
                :options="columns"
                option-value="name"
                label="Ausblenden"
              ></q-select>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { date } from "quasar";

const pageSize = 50;
const nextPage = 2;
let begin = new Date();
begin.setMonth(begin.getMonth() - 1);
begin = date.formatDate(begin, "YYYY.MM.DD");

export default {
  components: {
    FilterMenu: () => import("../FilterMenu")
  },
  data() {
    return {
      startDate: begin,
      endDate: date.formatDate(Date.now(), "YYYY.MM.DD"),
      startDateCopy: "",
      endDateCopy: "",
      calendarWeeks: [],
      weekNumber: null,
      lastPage: 0,
      pageSize,
      nextPage,
      loading: false,
      filter: "",
      uniqueMachines: [],
      errors: [],
      toggles: [],
      seed: [],
      tableHead: [],
      dataset: [],
      pagination: {
        sortBy: "name",
        descending: true,
        page: 0,
        rowsPerPage: 20
      },
      visibleColumns: [],
      vCols: [],
      columns: []
    };
  },
  props: ["tab", "load", "extOption"],
  computed: {
    Save() {
      if (
        typeof this.Filter.report !== "undefined" &&
        this.Filter.report === true &&
        this.load === false &&
        this.Dataset.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    ExtOption() {
      let opt = "Lieferantenreklamationen";
      if (this.MenuTab === "kunde") {
        opt = "Kundenreklamationen";
      }
      return opt;
    },
    data() {
      return Object.freeze(
        this.tableData.slice(0, pageSize * (this.nextPage - 1))
      );
    },
    ...mapGetters({
      MenuTab: "states/getMenuTab",
      History: "dataset/getHistory",
      Data: "dataset/getData",
      // DataAll: "dataset/getDataAll",
      DataExtern: "dataset/getDataExtern",
      Filter: "dataset/getFilter"
    }),
    Dataset() {
      let data = [];
      switch (this.tab) {
        case "intern":
          data = this.Data;
          break;
        case "extern":
          data = this.DataExtern;
          break;
        /*
        case "all":
          data = this.DataAll;
          break;
        */
      }
      return data;
    }
  },

  watch: {
    weekNumber: function(newWeek, oldWeek) {
      if (this.weekNumber) {
        const startDate = this.getDateOfWeek(
          this.weekNumber,
          new Date().getFullYear()
        );
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        this.startDate = date.formatDate(startDate, "YYYY.MM.DD");
        this.endDate = date.formatDate(endDate, "YYYY.MM.DD");
      }
    },
    startDate: function(newDate, oldDate) {
      this.startDateCopy = this.stringDate(newDate);
    },
    endDate: function(newDate, oldDate) {
      this.endDateCopy = this.stringDate(newDate);
    },
    errors: function() {
      if (this.errors.length > 0) {
        this.loadingButton = false;
      }
    }
  },

  methods: {
    update(event) {
      // this.loading = true;
      let report = false;
      if (typeof this.Filter.report !== "undefined") {
        report = this.Filter.report;
      }
      const args = {
        start: this.stringDate(this.startDate),
        end: this.stringDate(this.endDate),
        machines: this.Filter.machines,
        orders: this.Filter.orders,
        parts: this.Filter.parts,
        process: this.Filter.process,
        productgrp: this.Filter.productgrp,
        material: this.Filter.material,
        customer: this.Filter.customer,
        tab: this.tab,
        table: this.MenuTab,
        report: report,
        lang: this.Filter.lang
      };
      this.$emit("refreshEmmit", args);
    },
    report(event) {
      this.$emit("reportEmit");
    },
    onScroll({ to, ref }) {
      const lastIndex = this.data.length - 1;

      if (
        this.load !== true &&
        this.nextPage < this.lastPage &&
        to === lastIndex
      ) {
        this.load = true;

        setTimeout(() => {
          this.nextPage++;
          this.$nextTick(() => {
            ref.refresh();
            // this.loading = false;
          });
        }, 500);
      }
    },
    stringDate(newDate) {
      let copyOfDate = newDate.valueOf();
      copyOfDate = date.formatDate(copyOfDate, "DD.MM.YYYY");
      return copyOfDate;
    },
    // Funktion zum Aktualisieren der Daten. Hier wird ein asynchroner Axios get call zum Backend getätigt.
    // Die daraus resultierenden Daten werden im store gespeichert
    refreshDataTable() {
      this.calls = 0;
      this.vCols = [];
      this.visibleColumns = [];
      this.columns = [];

      this.drawTable();
    },
    uniques() {},
    storeData(data) {
      switch (this.tab) {
        case "intern":
          this.updateData(data);
          break;
        case "extern":
          this.updateDataExtern(data);
          break;
        /*
        case "all":
          this.updateDataAll(data);
          break;
        */
      }
    },
    drawTable() {
      this.tableHead = Object.keys(this.Dataset[0]);
      this.tableHead.forEach(element => {
        // this.visibleColumns.push(element);
        if (element === "Datum") {
          this.columns.push({
            name: element,
            align: "left",
            label: element,
            type: "date",
            field: element,
            format: val => `${val}`,
            sortable: true
          });
        } else {
          this.columns.push({
            name: element,
            align: "left",
            label: element,
            field: element,
            format: val => `${val}`,
            sortable: true
          });
        }
        this.vCols.push({
          val: element,
          label: element
        });
        this.visibleColumns = [
          "Datum",
          "Auftrags-Nr.",
          "Maschine",
          "Material-Nr.",
          "Material",
          "Reklamierte Menge",
          "Kosten pro Einheit",
          "Kosten"
        ];
        // console.log(this.tableHead.map(d => d))
      });
      // this.loading = false;
    },
    formatData() {
      for (let i = 0; i < this.seed.length; i++) {
        this.seed[i].Datum = Date.extractDate(this.seed[i].Datum, "DD.MM.YYYY");
      }
    },
    filterText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().indexOf(search) !== -1
      );
    },
    customSort(rows, sortBy, descending) {
      const data = [...rows];

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a;
          const y = descending ? a : b;

          if (sortBy === "Datum") {
            const xx = x[sortBy]
              .split(".")
              .reverse()
              .join("");
            const yy = y[sortBy]
              .split(".")
              .reverse()
              .join("");
            return xx < yy ? -1 : xx > yy ? 1 : 0;
          } else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy]);
          }
        });
      }
      return data;
    },
    getDateOfWeek(w, y) {
      const date = new Date(y, 0, 1 + (w - 1) * 7);
      date.setDate(date.getDate() + (1 - date.getDay())); // 0 - Sonntag, 1 - Montag etc
      return date;
    },
    getWeekNumber(d) {
      // Copy date so don't modify original
      d = new Date(+d);
      d.setHours(0, 0, 0);
      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      // Get first day of year
      var yearStart = new Date(d.getFullYear(), 0, 1);
      // Calculate full weeks to nearest Thursday
      var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      // Return array of year and week number
      return [d.getFullYear(), weekNo];
    },
    weeksInYear(year) {
      var d = new Date(year, 11, 31);
      var week = this.getWeekNumber(d)[1];
      return week === 1 ? this.getWeekNumber(d.setDate(24))[1] : week;
    },
    ...mapActions("dataset", [
      "updateHistory",
      "updateData",
      "updateDataExtern"
      // "updateDataAll"
    ])
  },
  mounted() {
    // IN WELCHEM TAB BIN ICH
    // IM STORE NACH DATEN FÜR DEN TAB PRÜFEN
    // WENN DATEN DA -> GLÜCKLICH SEIN
    // WENN NICHT this.refreshDataTable()
    switch (this.tab) {
      case "intern":
        if (this.Data.length > 0) {
          this.drawTable();
        } else {
          // this.update();
        }
        break;
      case "extern":
        if (this.DataExtern.length > 0) {
          this.drawTable();
        } else {
          // this.update();
        }
        break;
      /*
      case "all":
        if (this.DataAll.length > 0) {
          this.drawTable();
        } else {
          // this.update();
        }
        break;
      */
    }
  },
  created() {
    const currentYear = new Date().getFullYear();
    const weeks = [];
    for (let i = 1; i <= this.weeksInYear(currentYear); i++) {
      weeks.push(i);
    }
    this.calendarWeeks = weeks;
  }
};

/*
      const dateBegin = this.stringDate(this.startDate);
      const dateEnd = this.stringDate(this.endDate);
      let axiosUrl = "";

      axiosUrl = "http://192.168.8.218:5000/datatable/" + this.tab;
      this.cancelToken = this.$axios.CancelToken;
      this.source = this.cancelToken.source();
      this.$axios
        .get(axiosUrl, {
          cancelToken: this.source.token,
          params: {
            start: dateBegin,
            end: dateEnd,
            machines: JSON.stringify(this.Filter.machines),
            orders: JSON.stringify(this.Filter.orders),
            parts: JSON.stringify(this.Filter.parts),
            process: JSON.stringify(this.Filter.process),
            table: this.MenuTab
          }
        })
        .then(response => {
          if (response.data !== "[]") {
            this.seed = JSON.parse(response.data);
          } else {
            this.seed = [];
          }

          this.storeData(this.seed);
          this.loadingButton = false;
          this.disabledRefresh = false;
          if (this.seed) {
            this.$emit("dataChanged");
          }
          this.drawTable();
        })
        .catch(error => {
          if (this.$axios.isCancel(error)) {
            console.log("Request canceled", error.message);
          } else {
            // handle error
            this.errors.push(error);
          }
        });
        */
</script>

<style lang="sass">
.my-sticky-dynamic
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff
  thead tr th
    position: sticky
    z-index: 1
  thead tr:last-child th
    top: 48px
  thead tr:first-child th
    top: 0
</style>
