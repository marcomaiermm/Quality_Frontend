<template>
  <!--<q-page class="flex flex-center">-->
  <div class="q-app">
    <div class="q-pa-md">
      <div class="row q-col-gutter-md justify-between">
        <div class="col-xs-12 col flex">
          <DataTable />
        </div>
        <div class="col-6">
          <LineChart />
        </div>
        <div class="col-6">
          <HistChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PageIndex",
  components: {
    DataTable: () => import("../components/Table"),
    LineChart: () => import("../components/LineChart"),
    HistChart: () => import("../components/HistChart")
  },
  computed: {
    ...mapGetters({ Data: "dataset/getData" })
  }
};
</script>
