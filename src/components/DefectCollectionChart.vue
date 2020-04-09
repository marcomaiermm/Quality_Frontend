<template>
  <div class="q-pa-md">
    <q-card class="hist-card" bordered>
      <q-card-section>
        <div class="text-overline text-9">Reklamationen ppm</div>
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
  name: "DefectCollectionChart",
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
      Chart: "defectCollection/getChart"
    })
  },
  methods: {
    fillData() {
      let chartData = [];
      const dataset = [];
      chartData = this.Chart;
      Object.keys(chartData).forEach(element => {
        dataset.push(chartData[element]);
      });
      this.datacollection = {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: "ppm",
            yAxisID: "R",
            data: dataset,
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
          position: "nearest"
        },
        scales: {
          xAxes: [
            {
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
              id: "R",
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
  },
  mounted() {
    this.fillData();
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
