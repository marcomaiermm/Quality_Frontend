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
      <div class="q-pl-md" v-if="model !== 'Gesamt'">
        <q-select
          v-model="search"
          :label="model"
          :options="selectOptionHistory"
          dense
          style="width: 250px"
        ></q-select>
      </div>
      <q-btn dense flat icon="send" class="send-btn" @click="checkRefresh()"></q-btn>
      <q-space></q-space>
      <div
        class="text-overline text-9 q-pl-xs row"
        v-if="Object.keys(this.regressionData).length > 0"
      >
        <div>Steigung der Trendlinie:</div>
        <div
          :style="[
            regressionData.equation[0] <= 0
              ? { color: '#009130' }
              : { color: '#be0138' }
          ]"
        >{{ DOMCost(regressionData.equation[0]) }}</div>
      </div>
    </div>
    <commit-chart :width="w" :height="h" :chartData="datacollection" :options="options"></commit-chart>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatCost } from "../js/FormatCost";
import CommitChart from "../js/CommitChart.js";
import regression from "regression";

export default {
  name: "CostHistory",
  components: {
    CommitChart
  },
  props: ["tab"],
  data() {
    return {
      model: "Gesamt",
      search: "",
      selectOption: [
        "Gesamt",
        "Auftrags-Nr.",
        "Maschine",
        "Material"
        /*
        "Fehlermerkmal",
        "Produktgruppe",
        "Vorgangs-Nr.",
        "Werkstoff"
        */
      ],
      selectOptionHistory: [],
      datacollection: {
        labels: [],
        datasets: []
      },
      regressionData: {},
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
      if (this.model !== "Gesamt") {
        this.selectOptionHistory = this.Data.map(c => c[this.model]).filter(
          this.uniqueArrayValues
        );
      }

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
      let cost = [];
      if (this.model === "Gesamt") {
        cost = this.Data.map(c => ({
          Datum: c.Datum,
          Kosten: c.Kosten
        }))
        // .reverse();
      } else {
        cost = this.costs();
      }

      cost = [
        ...cost
          .reduce((map, item) => {
            const { Datum: key, Kosten } = item;
            const prev = map.get(key);

            if (prev) {
              prev.Kosten += Kosten;
            } else {
              map.set(key, Object.assign({}, item));
            }

            return map;
          }, new Map())
          .values()
      ];
      this.regressionData = this.lineRegress(cost);
      this.datacollection = {
        labels: cost.map(c => c.Datum),
        datasets: [
          {
            label: "Kosten " + this.search,
            data: cost.map(c => this.formatDigitsCost(c.Kosten)),
            backgroundColor: "#dd0333",
            borderColor: "#dd0333",
            fill: false,
            lineTension: 0
          },
          {
            label: "Trendlinie",
            data: this.regressionData.points.map(r =>
              this.formatDigitsCost(r[1])
            ),
            backgroundColor: "#003871",
            borderColor: "#003871",
            fill: false,
            lineTension: 0
          }
        ]
      };

      this.setOptions();
    },
    lineRegress(data) {
      // [x,y]
      const f = data.map((d, i) => [i + 1, d.Kosten]);
      const result = regression.linear(f);
      return result;
    },
    formatDigitsCost(a) {
      return Math.round((a + Number.EPSILON) * 100) / 100;
    },
    uniqueArrayValues(value, index, self) {
      return self.indexOf(value) === index;
    },
    DOMCost(value) {
      return formatCost(value);
    },
    costs() {
      const filter = this.Data.filter(obj => {
        return obj[this.model] === this.search;
      });
      const cost = filter
        .map(c => ({
          Datum: c.Datum,
          Kosten: c.Kosten
        }))
        // .reverse();
      return cost;
    },

    setOptions() {
      this.options = {
        legend: {
          display: true
        },
        tooltips: {
          mode: "index",
          position: "nearest",
          callbacks: {
            label: function(tooltipItem, data) {
              const indice = tooltipItem.index;
              if (tooltipItem.datasetIndex === 0) {
                return "Kosten: " + formatCost(data.datasets[0].data[indice]);
              } else {
                return (
                  "Trendwert: " + formatCost(data.datasets[1].data[indice])
                );
              }
            }
          }
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
