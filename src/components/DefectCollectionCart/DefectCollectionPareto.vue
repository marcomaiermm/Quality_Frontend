<template>
  <div class="q-pa-md">
    <q-card class="hist-card" bordered>
      <q-card-section>
        <div class="row">
          <div class="text-overline text-9 col-6">Pareto Merkmale</div>
          <div class="col-6">
            <TopSlider :maxValue="Object.keys(Pareto).length" @sliderRefreshEmit="slicedPareto" />
          </div>
        </div>
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
import TopSlider from "../TopSlider";
import { mapGetters } from "vuex";
export default {
  name: "DefectCollectionPareto",
  components: {
    CommitChartBar,
    TopSlider
  },
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
      w: 1000
    };
  },
  computed: {
      MaxValues() {
        let len = 0
        if (Object.keys(this.Pareto).length > 0) {
          len = Object.keys(this.Pareto).length;
        }
        return len
      },
      SlicedData(){
        const data = this.Pareto
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
      Pareto: "defectCollection/getPareto",
      MenuData: "menuData/getMenuDefectCollection"
    })
  },
  methods: {
    slicedPareto(value) {
      this.plotLength = value;
      this.fillPareto();
    },
    /*
    printChart() {
      const canvasEle = document.getElementById("canvas-pareto");
      const htmlString =
        "<br><img src='" + canvasEle.toDataURL("image/jpg") + "' />";
      return htmlString;
    },
    */
    fillPareto() {
      let dataPareto = [];
      dataPareto = this.SlicedData;
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
