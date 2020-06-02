<template>
  <div>
    <div class="row">
      <div class="text-overline text-9 q-pl-xs">Kostenverlauf</div>
      <div class="q-pl-md">
        <q-select
          borderless
          v-model="model"
          dense
          :options="selectOption"
          map-options
          emit-value
          label="Auswahl"
          style="width: 120px"
        ></q-select>
      </div>
      <div class="q-pl-md">
        <q-input v-model="search" :label="model" dense style="width: 250px">
          <template v-slot:append>
            <q-icon
              v-if="search !== null"
              class="cursor-pointer"
              name="clear"
              @click.stop="search = null"
            ></q-icon>
          </template>
          <template v-slot:after>
            <q-btn dense flat icon="send" class="send-btn" @click="checkRefresh()"></q-btn>
          </template>
        </q-input>
      </div>
    </div>
    <commit-chart :width="w" :height="h" :chartData="datacollection" :options="options"></commit-chart>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CommitChart from "../js/CommitChart.js";

export default {
  name: "CostHistory",
  components: {
    CommitChart
  },
  props: ["tab"],
  data() {
    return {
      model: "Material",
      search: "",
      selectOption: [
        "Auftrags-Nr.",
        "Vorgangs-Nr.",
        "Fehlermerkmal",
        "Material",
        "Maschine"
      ],
      datacollection: {
        labels: [],
        datasets: []
      },
      dataset: {},
      options: {},
      h: 250,
      w: 1080
    };
  },
  computed: {
    Data() {
      let data = [];
      switch (this.tab) {
        case "intern":
          data = this.DataIntern;
          break;
        case "extern":
          data = this.DataExtern;
          break;
        case "all":
          data = this.DataAll;
          break;
      }
      return data;
    },
    ...mapGetters({
      DataIntern: "dataset/getData",
      DataAll: "dataset/getDataAll",
      DataExtern: "dataset/getDataExtern"
    })
  },
  watch: {
    model() {
      this.search = null;
    }
  },
  methods: {
    checkRefresh() {
      if (typeof this.Data === "object" && Object.keys(this.Data).length > 0) {
        this.fillChart();
      }
    },
    fillChart() {
      this.datacollection = {
        labels: [],
        datasets: []
      };
      const filter = this.Data.filter(obj => {
        return obj[this.model] === this.search;
      });
      const cost = filter.map(c => ({
        Datum: c.Datum,
        Kosten: c.Kosten
      }));

      this.datacollection = {
        labels: cost.map(c => c.Datum),
        datasets: [
          {
            label: "Kosten " + this.search,
            data: cost.map(c => c.Kosten),
            backgroundColor: "#dd0333",
            borderColor: "#dd0333",
            fill: false,
            lineTension: 0
          }
        ]
      };
      this.setOptions();
    },
    setOptions() {
      this.options = {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                fontSize: 11
              },
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ]
        }
      };
    }
  }
};
</script>

<style lang="sass">
.line
  fill: none
  stroke: steelblue
  stroke-width: 2px
.small
  max-width: 600px
  margin: 15px auto
.send-btn
  color: $primary
</style>
