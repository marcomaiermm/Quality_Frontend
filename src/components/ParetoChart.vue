<template>
  <div class="q-pa-md">
    <q-card class="hist-card" bordered>
      <q-card-section>
        <div class="text-overline text-9">Pareto Diagramm</div>
        <commit-chart-bar
          :width="w"
          :height="h"
          :chartData="datacollection"
          :options="options"
        >
        </commit-chart-bar>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import CommitChartBar from "./js/CommitChartBar.js";
// import { select } from 'd3-selection'
// import * as d3 from 'd3'
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ParetoChart",
  components: {
    CommitChartBar
  },
  computed: {
    ...mapGetters({
      Pareto: "dataset/getPareto",
      Data: "dataset/getData"
    })
  },
  data() {
    return {
      datacollection: {
        labels: [],
        datasets: []
      },
      dataset: {},
      options: {},
      h: 370,
      w: 1000
    };
  },
  watch: {
    Data: function(newData, oldData) {
      if (newData !== oldData) {
        this.refresh();
      }
      this.fillData();
    }
  },
  methods: {
    refresh() {
      this.$axios.get("http://192.168.8.218:5000/pareto").then(response => {
        this.seed = JSON.parse(response.data);
        this.updatePareto(this.seed);
        this.fillData();
      });
    },
    fillData() {
      const dataSet = [];
      const kumSet = [];
      Object.keys(this.Pareto).forEach(element => {
        dataSet.push(this.Pareto[element].Fehler);
        kumSet.push(this.Pareto[element].Kummuliert);
      });

      this.datacollection = {
        labels: Object.keys(this.Pareto),
        datasets: [
          {
            label: "Kummuliert",
            yAxisID: "P",
            data: kumSet,
            backgroundColor: "rgba(190, 1, 74, 0.8)",
            borderColor: "rgba(190, 1, 74, 0.8)",
            fill: false,
            type: "line"
          },
          {
            label: "Fehler",
            yAxisID: "H",
            data: dataSet,
            backgroundColor: "rgba(2, 62, 115, 0.8)"
          }
        ]
      };

      this.options = {
        legend: {
          display: false
        },
        animation: {
          duration: 2000
        },
        tooltips: {
          mode: "index",
          callbacks: {
            afterBody: function(tooltipItem, data) {
              return "";
            }
          }
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                autoSkip: true,
                maxTicksLimit: 20.1,
                fontSize: 11
              },
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              id: "H",
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              }
            },
            {
              id: "P",
              position: "right",
              ticks: {
                max: 1,
                min: 0
              }
            }
          ]
        }
      };
    },
    ...mapActions("dataset", ["updatePareto"])
  },
  mounted() {
    if (this.Data.length > 0) {
      this.refresh();
    }
  }
};
</script>

<style lang="sass">
.bar-card
  width: 100%
  max-width: 1000px
.line
  fill: none
  stroke: steelblue
  stroke-width: 2px
.small
  max-width: 600px
  margin: 15px auto
</style>
