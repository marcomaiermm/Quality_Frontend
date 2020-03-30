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
import { mapGetters } from "vuex";

export default {
  name: "ParetoChart",
  components: {
    CommitChartBar
  },
  computed: {
    ...mapGetters({
      Pareto: "dataset/getPareto",
      ParetoAll: "dataset/getParetoAll",
      ParetoExtern: "dataset/getParetoExtern"
    })
  },
  props: ["tab"],
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
  methods: {
    fillPareto() {
      let dataPareto = [];
      switch (this.tab) {
        case "intern":
          dataPareto = this.Pareto;
          break;
        case "extern":
          dataPareto = this.ParetoExtern;
          break;
        case "all":
          dataPareto = this.ParetoAll;
          break;
      }
      const dataSet = [];
      const kumSet = [];
      Object.keys(dataPareto).forEach(element => {
        dataSet.push(dataPareto[element].Fehler);
        kumSet.push(dataPareto[element].Kummuliert);
      });

      this.datacollection = {
        labels: Object.keys(dataPareto),
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
    }
  },
  mounted() {
    this.fillPareto();
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
