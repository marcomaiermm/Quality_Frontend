<template>
  <div id="q-app">
    <!-- css spacing classes q-[p|m][t|r|b|l|a|x|y]-[none|auto|xs|sm|md|lg|xl]
                                    type direction              size                      -->
    <div class="q-mt-sm q-mr-md q-ml-md">
      <q-table
        class="my-sticky-dynamic"
        title="Treats"
        dense
        :data="Data"
        :columns="columns"
        :loading="loading"
        row-key="index"
        no-data-label="I didn't find anything for you"
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :visible-columns="visibleColumns"
      >
        <template v-slot:top="">
          <div class="col-2 q-table__title">Stock</div>

          <q-space></q-space>

          <div v-if="$q.screen.gt.xs" class="col full-width">
            <q-toggle
              v-model="visibleColumns"
              v-for="(cols, idx) in vCols"
              :key="idx"
              :val="cols.val"
              :label="cols.label"
            ></q-toggle>
          </div>
          <q-select
            v-else
            v-model="visibleColumns"
            multiple
            borderless
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            style="min-width: 150px"
          ></q-select>

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
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as d3 from "d3";
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
      loadingButton: false,
      disabledRefresh: false,
      errors: null,
      toggles: [],
      seed: [],
      tableHead: [],
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
    ...mapGetters({ Data: "dataset/getData" })
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
          this.drawTable();
          this.loadingButton = false;
          this.disabledRefresh = false;
        })
        .catch(error => {
          this.disabledRefresh = false;
          this.loadingButton = false;
          this.errors = error;
        });
    },
    drawTable() {
      this.tableHead = Object.keys(this.Data[0]);
      this.tableHead.forEach(element => {
        this.visibleColumns.push(element);
        this.columns.push({
          name: element,
          align: "left",
          label: element,
          field: element,
          sortable: true
        });
        this.vCols.push({
          val: element,
          label: element
        });
      });
      // LineChart.methods.testMethod(this.Data)
    },
    formatData() {
      var parseTime = d3.timeParse("%d.%m.%Y");
      this.seed.forEach(function(d) {
        d.Date = parseTime(d.Date);
        d.Close = +d.Close;
      });
    },
    ...mapActions("dataset", ["updateData"])
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
