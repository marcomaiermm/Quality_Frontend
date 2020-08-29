<template>
  <div class="q-app">
    <transition name="fade">
      <Spinning v-if="loading" />
    </transition>

    <!--<img id="reportbg" v-show="false" src="../assets/report-bg.png" />-->
    <div class="q-pa-md q-gutter-xs">
      <div class="row q-pb-md">
        <!--<q-select
          v-model="modelTime"
          :options="months"
          dense
          square
          outlined
          style="width: 250px"
          label="Monate zurück..."
        ></q-select>-->

        <q-input
          v-model="modelPart"
          dense
          square
          outlined
          style="width: 250px"
          label="Material Nummer"
        >
          <template v-slot:append>
            <q-icon
              v-show="modelPart !== null"
              class="cursor-pointer"
              name="clear"
              @click.stop="modelPart = null"
            ></q-icon>
          </template>
        </q-input>

        <q-select
          v-model="modelFeature"
          :options="features"
          dense
          square
          outlined
          style="width: 250px"
          label="Merkmal"
        ></q-select>
        <q-btn
          dense
          flat
          :loading="loading"
          :disable="Disabled"
          class="refresh-btn q-ml-xs"
          icon="refresh"
          @click="getData()"
        >
          <q-tooltip v-if="!loading" content-class="bg-accent" anchor="top left"
            >Aktualisieren</q-tooltip
          >
        </q-btn>
      </div>

      <div class="q-pb-md">
        <q-card>
          <div class="row q-pa-md">
            <div class="col-8 q-pr-md">
              <DataTable :dataset="dataTable" :windowHeight="height * 0.4" />
            </div>
            <div class="col-4 q-pl-md">
              <CardInfo
                :data="dataInfo[modelFeature]"
                :scope="scope[modelFeature]"
                :windowHeight="height * 0.2"
              />
            </div>
          </div>
        </q-card>
      </div>
      <div class="q-pb-md">
        <q-card>
          <div class="row q-pa-md">
            <div class="col-6">
              <DataChart
                :propdata="dataTable"
                :info="dataInfo[modelFeature]"
                :subject="'m'"
              />
            </div>
            <div class="col-6">
              <DataChart
                :propdata="dataTable"
                :info="dataInfoR[modelFeature]"
                :subject="'r'"
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "QualityControlChart",
  components: {
    DataTable: () =>
      import("../components/QualityControlChart/QualityControlChartTable"),
    DataChart: () =>
      import("../components/QualityControlChart/QualityControlChartChart"),
    CardInfo: () => import("../components/QualityControlChart/CardInfo"),
    Spinning: () => import("../components/QualityControlChart/Loading")
  },
  watch: {
    modelFeature(newVal, oldVal) {
      this.dataTable = [];
      // this.dataTableR = [];
      for (const key in this.dataValues) {
        if (this.dataValues[key].PRUEFMERKMAL === newVal) {
          this.dataTable.push(this.dataValues[key]);
          // this.dataTableR.push(this.dataValuesR[key]);
        }
      }
    }
  },
  computed: {
    Disabled() {
      if (
        // (this.modelTime !== null) &
        (this.modelPart !== null) &
        (this.loading === false)
      ) {
        return false;
      } else {
        return true;
      }
    },
    ...mapGetters({
      Dataset: "qCard/getDataset",
      Path: "config/getPath"
    })
  },
  data() {
    return {
      height: 0,
      loading: false,
      // modelTime: null,
      modelPart: null,
      modelFeature: null,
      dataTable: [],
      // dataTableR: [],
      dataChartX: [],
      dataChartR: [],
      dataValues: [],
      dataValuesX: [],
      dataInfo: [],
      dataInfoR: [],
      scope: {},
      features: [],
      months: [],
      thisMonth: new Date().getMonth(),
      cancelToken: null,
      source: null
    };
  },
  methods: {
    ...mapActions("config", ["updateConfig"]),
    ...mapActions("qCard", ["updateDataset"]),
    getData() {
      this.loading = true;
      this.resetData();
      this.cancelToken = this.$axios.CancelToken;
      this.source = this.cancelToken.source();
      this.$axios
        .get(
          "http://" +
            this.Path.host +
            ":" +
            this.Path.port +
            "/qualitycontrolchart",
          {
            cancelToken: this.source.token,
            params: {
              part: this.modelPart
              // months: this.modelTime
            }
          }
        )
        .then(response => {
          const seed = response.data;
          if (seed === null) {
            this.resetData();
            this.loading = false;
            return;
          }
          this.dataValues = JSON.parse(seed.X.Werte);

          this.dataInfo = seed.X.Eingriffsgrenzen;
          this.scope = seed.Bins;
          // this.dataValuesR = JSON.parse(seed.R);
          this.dataInfoR = seed.R.Eingriffsgrenzen;

          this.features = Object.keys(this.dataInfo);
          this.modelFeature = this.features[0];
          this.loading = false;
        })
        .catch(error => {
          if (this.$axios.isCancel(error)) {
            console.log("Request canceled", error.message);
          }
          this.resetData();
          console.log(error);
          this.loading = false;
        });
    },
    handleResize() {
      this.height = Math.round(window.innerHeight);
    },
    resetData() {
      this.dataChartX = [];
      this.dataChartR = [];
      this.dataTable = [];
      this.dataValues = [];
      this.dataInfo = [];
      this.dataValuesR = [];
      this.dataInfoR = [];
      this.intervall = {};
      this.features = [];
      this.modelFeature = null;
    }
  },
  mounted() {
    for (let i = 1; i <= this.thisMonth; i++) {
      this.months.push(i);
    }
  },
  created() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style lang="sass">

.fade-enter-active
.fade-leave-active
  transition: opacity 0.5s
fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  opacity: 0
</style>
