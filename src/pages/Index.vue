<template>
  <!--<q-page class="flex flex-center">-->
  <q-page>
    <DataTable />
    <LineChart />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PageIndex",
  components: {
    DataTable: () => import("../components/Table"),
    LineChart: () => import("../components/LineChart")
  },
  computed: {
    ...mapGetters({ Data: "dataset/getData" })
  }
};
</script>
