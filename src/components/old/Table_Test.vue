<template>
  <!-- css spacing classes q-[p|m][t|r|b|l|a|x|y]-[none|auto|xs|sm|md|lg|xl]
                                    type direction              size                      -->
  <div class="q-mt-sm q-mr-md q-ml-md col">
    <q-table
      class="my-sticky-dynamic"
      title="Treats"
      :dense="$q.screen.lt.md"
      :data="dataset"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      row-key="index"
      no-data-label="I didn't find anything for you"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      :visible-columns="visibleColumns"
      :sort-method="customSort"
    >
      <template v-slot:top="">
        <div class="fit row wrap justify-between  content-start">
          <div class="text-h6 col">Stock</div>
          <div class="q-pa-xs col" style="min-width: 150px">
            <q-input
              filled
              v-model="startDate"
              mask="date"
              :rules="['date']"
              style="height: 50px"
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
              v-model="endDate"
              mask="date"
              :rules="['date']"
              style="height: 50px"
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
              class="q-ml-md"
              icon="refresh"
              :loading="loadingButton"
              @click="refreshData()"
              :disable="disabledRefresh"
            >
              <q-tooltip content-class="bg-accent" anchor="top left"
                >Aktualisieren</q-tooltip
              >
            </q-btn>
          </div>
          <div class="col"></div>
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
              options-cover
              style="min-width: 150px"
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
var begin = new Date();
begin.setMonth(begin.getMonth() - 1);
begin = date.formatDate(begin, "YYYY.MM.DD");

// var moment = require("moment");
export default {
  data() {
    return {
      calls: 0,
      startDate: begin,
      endDate: date.formatDate(Date.now(), "YYYY.MM.DD"),
      startDateCopy: "",
      endDateCopy: "",
      lastPage: 0,
      pageSize,
      nextPage,
      loading: false,
      filter: "",
      loadingButton: false,
      disabledRefresh: false,
      errors: null,
      toggles: [],
      seed: [],
      tableHead: [],
      dataset: [],
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 0,
        rowsPerPage: 10
      },
      visibleColumns: [],
      vCols: [],
      columns: []
    };
  },

  computed: {
    data() {
      return Object.freeze(
        this.tableData.slice(0, pageSize * (this.nextPage - 1))
      );
    },
    ...mapGetters({
      Data: "dataset/getData",
      History: "dataset/getHistory",
      Query: "dataset/getQuery"
    })
  },

  watch: {
    Data: function(newData, oldData) {
      this.dataset = [];
      newData.forEach(element => {
        this.dataset.push({ ...element });
      });
    },
    startDate: function(newDate, oldDate) {
      this.startDateCopy = this.stringDate(newDate);
    },
    endDate: function(newDate, oldDate) {
      this.endDateCopy = this.stringDate(newDate);
    },
    Query: function(newData, oldData) {
      console.log(this.Query);
    },
    calls: function() {
      if (this.calls === 3) {
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
      var copyOfDate = newDate.valueOf();
      copyOfDate = date.formatDate(copyOfDate, "DD.MM.YYYY");
      return copyOfDate;
    },
    // Funktion zum Aktualisieren der Daten. Hier wird ein asynchroner Axios get call zum Backend getätigt.
    // Die daraus resultierenden Daten werden im store gespeichert
    refreshData() {
      this.calls = 0;
      this.disabledRefresh = true;
      this.loadingButton = true;
      this.vCols = [];
      this.visibleColumns = [];
      this.columns = [];
      const dateBegin = this.stringDate(this.startDate);
      const dateEnd = this.stringDate(this.endDate);
      this.$axios
        .get("http://192.168.8.218:5000/data", {
          params: {
            start: this.stringDate(this.startDate),
            end: this.stringDate(this.endDate)
          }
        })
        .then(response => {
          this.seed = JSON.parse(response.data);
          // this.formatData();
          this.updateData(this.seed);
          this.pushData();
          this.drawTable();
          this.calls += 1;
        })
        .catch(error => {
          this.errors = error;
        });
      this.$axios
        .get("http://192.168.8.218:5000/histogram", {
          params: {
            start: dateBegin,
            end: dateEnd
          }
        })
        .then(response => {
          this.seed = JSON.parse(response.data);
          this.updateHistory(this.seed);
          this.calls += 1;
        })
        .catch(error => {
          this.errors = error;
        });
      // TEST
      this.$axios
        .get("http://192.168.8.218:5000/q", {
          params: {
            start: dateBegin,
            end: dateEnd
          }
        })
        .then(response => {
          this.updateQuery(JSON.parse(response.data));
          this.calls += 1;
        })
        .catch(error => {
          this.errors = error;
        });
    },
    pushData() {
      this.dataset = [];
      this.Data.forEach(element => {
        this.dataset.push({ ...element });
      });
    },
    drawTable() {
      this.pushData();
      this.tableHead = Object.keys(this.dataset[0]);
      this.tableHead.forEach(element => {
        this.visibleColumns.push(element);
        if (element === "Date") {
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
        this.seed[i].Date = date.extractDate(this.seed[i].Date, "DD.MM.YYYY");
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

          if (sortBy === "Date") {
            var xx = x[sortBy]
              .split(".")
              .reverse()
              .join("");
            var yy = y[sortBy]
              .split(".")
              .reverse()
              .join("");
            // string sort date
            // return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0;
            // return x[sortBy].localeCompare(y[sortBy]);
            return xx < yy ? -1 : xx > yy ? 1 : 0;
          } else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy]);
          }
        });
      }
      return data;
    },
    ...mapActions("dataset", ["updateData", "updateHistory", "updateQuery"])
  },
  mounted() {
    if (this.Data.length > 0) {
      this.drawTable();
    } else {
      this.refreshData();
    }
  }
};
</script>

<style lang="sass">
.my-sticky-dynamic
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff
  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
