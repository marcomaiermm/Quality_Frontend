<template>
  <!-- css spacing classes q-[p|m][t|r|b|l|a|x|y]-[none|auto|xs|sm|md|lg|xl]
  type direction              size-->
  <!--<div class="q-mt-sm q-mr-md q-ml-md col">-->
  <div class="col">
    <q-table
      class="my-sticky-dynamic"
      title="Treats"
      :dense="$q.screen.lt.md"
      :data="Dataset"
      :columns="columns"
      :loading="loadingButton"
      :filter="filter"
      row-key="name"
      no-data-label="I didn't find anything for you"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :visible-columns="visibleColumns"
      :sort-method="customSort"
    >
      <template v-slot:top>
        <div class="fit row wrap justify-between content-start">
          <div class="q-pa-xs col" style="min-width: 150px">
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
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="startDate"
                      today-btn
                      @input="() => $refs.qDateProxy.hide()"
                    ></q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="q-pa-xs col" style="min-width: 150px">
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
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="endDate"
                      today-btn
                      @input="() => $refs.qDateProxy.hide()"
                    ></q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col">
            <q-select
              v-model="weekNumber"
              dense
              outlined
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
          <!--
          <div v-if="$q.screen.gt.xs" class="col full-width">
            <q-toggle
              v-model="visibleColumns"
              v-for="(cols, idx) in vCols"
              :key="idx"
              :val="cols.val"
              :label="cols.label"
            ></q-toggle>
          </div>
          v-else
          -->
          <div class="col">
            <q-btn
              dense
              flat
              class="q-ml-xs"
              icon="refresh"
              :loading="loadingButton"
              @click="refreshDataTable()"
              :disable="disabledRefresh"
            >
              <q-tooltip
                v-if="!disabledRefresh"
                content-class="bg-accent"
                anchor="top left"
                >Aktualisieren</q-tooltip
              >
            </q-btn>
            <q-btn dense flat class="q-ml-xs" icon="filter_list">
              <q-tooltip content-class="bg-accent" anchor="top left"
                >Filter</q-tooltip
              >
              <FilterMenu :tab="tab" />
            </q-btn>
          </div>
          <div class="col"></div>
          <div class="col">
            <q-input dense v-model="filter" placeholder="Suche">
              <template v-slot:append>
                <q-icon name="search"></q-icon>
              </template>
            </q-input>
          </div>
          <div class="col"></div>
          <div class="col"></div>
          <div class="col">
            <q-select
              v-model="visibleColumns"
              multiple
              outlined
              dense
              options-dense
              :display-value="$q.lang.table.columns"
              emit-value
              map-options
              :options="columns"
              option-value="name"
              style="min-width: 150px"
              label="Ausblenden"
            ></q-select>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { date } from "quasar";
// import * as d3 from "d3";
// import LineChart from './LineChart.vue'
const pageSize = 50;
const nextPage = 2;
// var today = date.formatDate((Date.now(), "YYYY.MM.DD"));
let begin = new Date();
begin.setMonth(begin.getMonth() - 1);
begin = date.formatDate(begin, "YYYY.MM.DD");

// var moment = require("moment");
export default {
  components: {
    FilterMenu: () => import("../components/FilterMenu")
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
      loadingButton: false,
      disabledRefresh: false,
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
      columns: [],
      cancelToken: null,
      source: null
    };
  },
  props: ["tab"],
  computed: {
    data() {
      return Object.freeze(
        this.tableData.slice(0, pageSize * (this.nextPage - 1))
      );
    },
    ...mapGetters({
      MenuTab: "states/getMenuTab",
      History: "dataset/getHistory",
      Data: "dataset/getData",
      DataAll: "dataset/getDataAll",
      DataExtern: "dataset/getDataExtern",
      FilterMaschine: "dataset/getFilterMachines"
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
        case "all":
          data = this.DataAll;
          break;
      }
      return data;
    }
  },

  watch: {
    /*
    Data: function(newData, oldData) {
      this.dataset = [];
      newData.forEach(element => {
        this.dataset.push({ ...element });
      });
    },
    */
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
        this.disabledRefresh = false;
      }
    }
  },

  methods: {
    onScroll({ to, ref }) {
      const lastIndex = this.data.length - 1;

      if (
        this.loading !== true &&
        this.nextPage < this.lastPage &&
        to === lastIndex
      ) {
        this.loading = true;

        setTimeout(() => {
          this.nextPage++;
          this.$nextTick(() => {
            ref.refresh();
            this.disabledRefresh = false;
            this.loadingButton = false;
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
      this.disabledRefresh = true;
      this.loadingButton = true;
      this.vCols = [];
      this.visibleColumns = [];
      this.columns = [];
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
            machines: JSON.stringify(this.FilterMaschine),
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
        case "all":
          this.updateDataAll(data);
          break;
      }
    },
    drawTable() {
      // this.pushData();
      this.tableHead = Object.keys(this.Dataset[0]);
      this.tableHead.forEach(element => {
        this.visibleColumns.push(element);
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
      });
      // LineChart.methods.testMethod(this.Data)
    },
    formatData() {
      for (let i = 0; i < this.seed.length; i++) {
        this.seed[i].Datum = Date.extractDate(this.seed[i].Datum, "DD.MM.YYYY");
      } /*
      this.seed.map(function(d) {
        return moment(d.Date, "DD-MM-YYYY");

        var parseTime = d3.timeParse("%d.%m.%Y");
         this.seed.forEach(function(d) {
        d.Date = parseTime(d.Date);
        d.Close = +d.Close;

      }); */
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
      "updateDataExtern",
      "updateDataAll"
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
          this.refreshDataTable();
        }
        break;
      case "extern":
        if (this.DataExtern.length > 0) {
          this.drawTable();
        } else {
          this.refreshDataTable();
        }
        break;
      case "all":
        if (this.DataAll.length > 0) {
          this.drawTable();
        } else {
          this.refreshDataTable();
        }
        break;
    }
  },
  created() {
    const currentYear = new Date().getFullYear();
    const weeks = [];
    for (let i = 1; i <= this.weeksInYear(currentYear); i++) {
      weeks.push(i);
    }
    this.calendarWeeks = weeks;
  },
  beforeDestroy() {
    console.log("OnB4Destroy");
    if (this.source) {
      this.source.cancel("Operation canceled by the user.");
    }
  }
};
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
