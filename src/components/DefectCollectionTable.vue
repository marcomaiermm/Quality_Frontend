<template>
  <q-table
    class="defect-collection-table"
    title="Fehlersammelkarte"
    v-bind:style="{ height: window.height + 'px' }"
    flat
    :data="dataset"
    :columns="Columns"
    :loading="loading"
    :filter="filter"
    row-key="index"
    no-data-label="I didn't find anything for you"
    virtual-scroll
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
  >
    <template v-slot:top>
      <div
        v-show="dataset.length > 0 && table == 'features'"
        class="col q-table__title noselect"
      >Fehlersammelkarte für {{ subject }}.</div>
      <q-space></q-space>
      <q-input v-if="table == 'features'" dense v-model="filter" placeholder="Suche">
        <template v-slot:append>
          <q-icon name="search"></q-icon>
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<script>
export default {
  name: "DefectCollectionTable",
  props: ["dataset", "loading", "table", "subject"],
  data() {
    return {
      filter: "",
      window: {
        height: 0
      },
      pagination: {
        rowsPerPage: 0
      }
    };
  },
  computed: {
    Columns() {
      if (
        typeof Object.keys(this.dataset) !== "undefined" &&
        Object.keys(this.dataset).length > 0
      ) {
        const cols = [];
        const tableHead = Object.keys(this.dataset[0]);
        tableHead.forEach(element => {
          cols.push({
            name: element,
            align: "left",
            label: element,
            field: element,
            format: val => `${val}`,
            sortable: false
          });
        });
        return cols;
      } else {
        return [];
      }
    },
    data() {
      return Object.freeze(
        this.dataset.slice(0, this.pageSize * (this.nextPage - 1))
      );
    }
  },
  created() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      if (this.table === "features") {
        this.window.height = Math.round(window.innerHeight * 0.5);
      } else {
        this.window.height = Math.round(window.innerHeight * 0.28);
      }
    }
  }
};
</script>
<style lang="sass">
.q-table__top,
.q-table__bottom,
thead tr:first-child th
  background-color: #fff
thead tr th
  position: sticky
  z-index: 1
thead tr:last-child th
  top: 48px
thead tr:first-child th
  top: 0
</style>
