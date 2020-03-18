<template>
  <div class="q-pa-md">
    <q-card class="hist-card" bordered>
      <q-card-section>
        <div class="text-overline text-9">Histogramm</div>
        <div class="text-subtitle1 q-mt-sm q-mb-xs">
          Häufung
        </div>
        <!--<div class="text-caption text-grey"></div>
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
      datacollection: null,
      dataset: {},
      options: {},
      h: 400,
      w: 1000
      // margin: { top: 30, right: 20, bottom: 30, left: 50 }
    };
  },
  watch: {
    History: function(newData, oldData) {
      this.dataset = [];
      newData.forEach(element => {
        this.dataset.push({ ...element });
      });
      this.fillData();
    }
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: this.History.map(function(d) {
          return d.Klassengrenzen;
        }),
        datasets: [
          {
            label: "Gesamt",
            pointHoverBackgroundColor: "rgba(0, 119, 220, 0.6)",
            backgroundColor: "rgba(2, 62, 115, 0.8)",
            hoverBackgroundColor: "rgba(2, 62, 115, 0.6)",
            data: this.History.map(function(d) {
              return d.Gesamt;
            })
          }
        ]
      };
      this.options = {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              ticks: {
                // autoSkip: true,
                maxTicksLimit: 10.1
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
