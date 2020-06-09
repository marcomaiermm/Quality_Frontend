<template>
  <div class="q-pa-md">
    <q-card class="hist-card" bordered>
      <q-card-section>
        <div class="text-overline text-9">Pareto Merkmale</div>
        <commit-chart-bar
          chart-id="canvas-pareto"
          :width="w"
          :height="h"
          :chartData="datacollection"
          :options="options"
        ></commit-chart-bar>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import CommitChartBar from "../js/CommitChartBar.js";
import { mapGetters } from "vuex";
export default {
  name: "DefectCollectionPareto",
  components: {
    CommitChartBar
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
  computed: {
    ...mapGetters({
      Pareto: "defectCollection/getPareto"
    })
  },
  methods: {
    printChart() {
      const canvasEle = document.getElementById("canvas-pareto");
      const htmlString =
        "<br><img src='" + canvasEle.toDataURL("image/jpg") + "' />";
      return htmlString;
    },
    fillPareto() {
      let dataPareto = [];
      dataPareto = this.Pareto;
      const dataSet = [];
      const kumSet = [];
      Object.keys(dataPareto).forEach(element => {
        dataSet.push(dataPareto[element].Gesamt);
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
          position: "nearest",
          callbacks: {
            label: function(tooltipItem, data) {
              if (tooltipItem.datasetIndex === 0) {
                return "Kummuliert: " + tooltipItem.yLabel + "%";
              } else {
                return "Reklamationen: " + tooltipItem.yLabel;
              }
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
                /*
                max: 100,
                min: 0,
                */
                callback: function(value) {
                  return value + "%";
                }
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
