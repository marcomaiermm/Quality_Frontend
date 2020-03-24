<template>
  <div id="q-app">
    <!-- css spacing classes q-[p|m][t|r|b|l|a|x|y]-[none|auto|xs|sm|md|lg|xl]
                                    type direction              size                      -->
    <q-card class="q-mt-sm q-mr-md q-ml-md">
      <q-card-section class="q-pb-sm">
        <code-tabs :tagParts="tagParts"></code-tabs>
      </q-card-section>
      <q-card-section>
        <div class="text-h5 text-9">Stock Price</div>
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
        <q-grid :data="Data" :columns="columns" :columns_filter="true" flat>
        </q-grid>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { date } from "quasar";
// import * as d3 from "d3";
// import LineChart from './LineChart.vue'
const pageSize = 50;
const nextPage = 2;
export default {
  data() {
    return {
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
        rowsPerPage: 5
      },
      visibleColumns: [],
      vCols: [],
      columns: []
    };
  },
  props: {
    tagParts: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    data() {
      return Object.freeze(
        this.tableData.slice(0, pageSize * (this.nextPage - 1))
      );
    },
    ...mapGetters({ Data: "dataset/getData", History: "dataset/getHistory" })
  },

  watch: {
    Data: function(newData, oldData) {
      this.dataset = [];
      newData.forEach(element => {
        this.dataset.push({ ...element });
      });
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
            this.loading = false;
          });
        }, 500);
      }
    },
    refreshData() {
      this.disabledRefresh = true;
      this.loadingButton = true;
      this.vCols = [];
      this.visibleColumns = [];
      this.columns = [];
      this.$axios
        .get("http://127.0.0.1:5000/data")
        .then(response => {
          this.seed = JSON.parse(response.data);
          // this.formatData();
          this.updateData(this.seed);
          this.pushData();
          this.drawTable();
          this.loadingButton = false;
          this.disabledRefresh = false;
        })
        .catch(error => {
          this.disabledRefresh = false;
          this.loadingButton = false;
          this.errors = error;
        });

      this.$axios
        .get("http://127.0.0.1:5000/histogram")
        .then(response => {
          this.seed = JSON.parse(response.data);
          this.updateHistory(this.seed);
        })
        .catch(error => {
          this.disabledRefresh = false;
          this.loadingButton = false;
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

        let parseTime = d3.timeParse("%d.%m.%Y");
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
            const xx = x[sortBy]
              .split(".")
              .reverse()
              .join("");
            const yy = y[sortBy]
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
    ...mapActions("dataset", ["updateData", "updateHistory"])
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
