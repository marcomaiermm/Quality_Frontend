<template>
  <div class="q-pa-md">
    <q-card class="hist-card" bordered>
      <q-card-section>
        <div class="text-overline text-9">Histogramm</div>
        <!--
        <div class="text-subtitle1 q-mt-sm q-mb-xs">
          Häufung
        </div>
        <div class="text-caption text-grey"></div>
        <svg
          :height="height"
          :width="width"
        >
        </svg>
        <svg
        class="chart"
        :width="width"
        :height="height"
        >
          <g transform="translate(50,50)">
          </g>
        </svg>-->
        <!--<svg id="chart-visualisation"></svg>-->
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
import { mapGetters } from "vuex";

export default {
  name: "HistChart",
  components: {
    CommitChartBar
  },
  computed: {
    ...mapGetters({ History: "dataset/getHistory" })
  },
  data() {
    return {
      datacollection: {
        labels: [],
        datasets: []
      },
      fehler: [],
      dataset: {},
      options: {},
      h: 400,
      w: 1000
      // margin: { top: 30, right: 20, bottom: 30, left: 50 }
    };
  },
  watch: {
    History: function(newData, oldData) {
      if (newData !== oldData) {
        this.fillData();
      }
    }
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: [],
        datasets: []
      };

      Object.keys(this.History[Object.keys(this.History)[0]]).forEach(key => {
        this.datacollection.datasets.push({
          label: key,
          data: [],
          backgroundColor: ""
        });
      });

      Object.keys(this.History).forEach(key => {
        this.datacollection.labels.push(key);
        Object.keys(this.History[key]).forEach((innerKey, index) => {
          this.datacollection.datasets[index].data.push(
            this.History[key][innerKey]
          );
          this.datacollection.datasets[index].backgroundColor =
            "rgba(2, 62, 115, 0.8)";
        });
      });
      this.options = {
        legend: {
          display: false
        },
        animation: {
          duration: 2000
        },
        tooltips: {
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
                display: true
              }
            }
          ]
        },
        plugins: {
          zoom: {
            zoom: {
              enabled: true,
              mode: "xy"
            },
            pan: {
              enabled: true,
              mode: "xy"
            }
          }
        }
      };
    }
  },
  mounted() {
    if (Object.keys(this.History).length > 0) {
      this.fillData();
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
