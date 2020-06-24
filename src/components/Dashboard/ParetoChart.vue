<template>
  <div>
    <div class="row">
    <div class="text-overline text-9 col-5">Reklamations Pareto Diagramm</div>
    <div class="col-6"><TopSlider :maxValue="Object.keys(Data).length" @sliderRefreshEmit="slicedPareto"/></div>
    </div>
    <commit-chart-bar
      :width="w"
      :height="h"
      :chartData="datacollection"
      :options="options"
    ></commit-chart-bar>
  </div>
</template>

<script>
import CommitChartBar from "../js/CommitChartBar";
import TopSlider from "../TopSlider";
import { mapGetters } from "vuex";

export default {
  name: "ParetoChart",
  components: {
    CommitChartBar,
    TopSlider
  },
  computed: {
    Data() {
      // arr.slice(begin, end)
      // Object.entries(obj).slice(begin, end)
      let data = {}
        switch (this.tab) {
        case "intern":
          data = this.Pareto;
          break;
        case "extern":
          data = this.ParetoExtern;
          break;
        case "all":
          data = this.ParetoAll;
          break;
      }
      return data
    },
    MaxValues() {
      let len = 0
      if (Object.keys(this.Data).length > 0) {
        len = Object.keys(this.Data).length;
      }
      return len
    },
    SlicedData(){
      const data = this.Data
      const sliced = Object.keys(data).slice(0, this.plotLength).reduce((result, key) => {
                          result[key] = data[key];
                          return result;
                      }, {});
      let result = {}
      if(Object.keys(sliced).length>0){
        result = sliced
      } else {
        result = data
      }
      return result
    },
    ...mapGetters({
      Pareto: "dataset/getPareto",
      ParetoAll: "dataset/getParetoAll",
      ParetoExtern: "dataset/getParetoExtern"
    })
  },
  props: ["tab"],
  data() {
    return {
      plotLength: this.MaxValues,
      datacollection: {
        labels: [],
        datasets: []
      },
      dataset: {},
      options: {},
      h: 370,
      w: 1000,
      pointHoverRadiusVal: 4,
      pointRadiusVal: 3
    };
  },
  methods: {
    slicedPareto(value) {
      this.plotLength = value;
      this.fillPareto();
    },
    fillPareto() {
      const dataPareto = this.SlicedData;
      const dataSet = [];
      const kumSet = [];
      Object.keys(dataPareto).forEach(element => {
        dataSet.push(dataPareto[element].Fehler);
        kumSet.push(dataPareto[element].Kummuliert);
      });

      // Kummulierte Datenpunkte bei zuvielen Datenpunkten kleiner machen
      if (kumSet.length >= 40) {
        this.pointHoverRadiusVal = 0;
        this.pointRadiusVal = 0;
      }

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
            type: "line",
            pointRadius: this.pointRadiusVal,
            pointHoverRadius: this.pointHoverRadiusVal
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
                return "Teile: " + tooltipItem.yLabel;
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
