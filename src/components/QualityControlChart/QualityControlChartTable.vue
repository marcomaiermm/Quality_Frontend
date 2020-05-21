<template>
  <q-table
    class="defect-collection-table"
    v-bind:style="{ height: windowHeight + 'px' }"
    flat
    dense
    :data="dataset"
    :columns="Columns"
    row-key="index"
    virtual-scroll
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
    no-data-label="Keine Daten gefunden. Merkmal ausgewählt?"
  ></q-table>
</template>

<script>
export default {
  name: "DefectCollectionTable",
  props: ["dataset", "windowHeight"],
  data() {
    return {
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
