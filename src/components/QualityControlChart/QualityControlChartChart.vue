<template>
  <div>
    <div v-if="subject === 'm'" class="text-overline text-10">x&#772;</div>
    <div v-else-if="subject === 'r'" class="text-overline text-10">R</div>
    <commit-chart
      chart-id="mychart"
      :width="w"
      :height="h"
      :chartData="datacollection"
      :options="options"
    ></commit-chart>
  </div>
</template>

<script>
import CommitChart from "../js/CommitChart";

export default {
  name: "QualityControlChartChart",
  components: {
    CommitChart
  },
  props: ["propdata", "info", "subject", "height"],
  data() {
    return {
      datacollection: {
        labels: [],
        datasets: []
      },
      dataset: {},
      options: {},
      h: 330,
      w: 1000
    };
  },
  watch: {
    propdata(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fillChart();
      }
    }
  },
  computed: {
    Info() {
      const data = {
        mittel: 0,
        oeg: 0,
        owg: 0,
        ueg: 0,
        uwg: 0
      };
      if (
        typeof this.info !== "undefined" &&
        Object.keys(this.info).length > 0
      ) {
        data.mittel = this.info.Mittel;
        data.oeg = this.info.OEG;
        data.ueg = this.info.UEG;
        data.owg = this.info.OWG;
        data.uwg = this.info.UWG;
      }
      return data;
    },
    Data() {
      let data = [];
      if (this.propdata !== null && this.propdata.length > 0) {
        data = this.propdata;
      }
      return data;
    }
  },
  methods: {
    fillChart() {
      const dataSet = [];
      const dataLabel = [];
      let lab = "";
      if (this.Data.length > 0) {
        this.Data.forEach(element => {
          // delete element.PRUEFMERKMAL;
          switch (this.subject) {
            case "m":
              lab = "Messwert";
              dataSet.push(element.MESSWERT);
              break;
            case "r":
              lab = "Spanne";
              dataSet.push(element.R);
          }
          dataLabel.push(element.ZEIT_KENNUNG);
        });
      }
      this.datacollection = {
        labels: dataLabel,
        datasets: [
          {
            label: lab,
            yAxisID: "A",
            data: dataSet,
            backgroundColor: "rgba(190, 1, 74, 0.8)",
            borderColor: "rgba(190, 1, 74, 0.8)",
            fill: false,
            // type: "line",
            cubicInterpolationMode: "monotone"
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
              stacked: true,
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
              id: "A",
              position: "left"
            }
          ]
        },
        annotation: {
          annotations: [
            {
              // Mittelwert
              type: "line",
              mode: "horizontal",
              scaleID: "A",
              value: this.Info.mittel,
              borderColor: "rgb(51, 204, 51)",
              borderWidth: 1,
              borderDash: [5, 5],
              label: {
                enabled: false,
                content: "Test label"
              }
            },
            {
              // Obere Eingriffsgrenze
              type: "line",
              mode: "horizontal",
              scaleID: "A",
              value: this.Info.oeg,
              borderColor: "	rgb(255, 64, 0)",
              borderWidth: 2,
              label: {
                enabled: false,
                content: "Test label"
              }
            },
            {
              // Untere Eingriffsgrenze
              type: "line",
              mode: "horizontal",
              scaleID: "A",
              value: this.Info.ueg,
              borderColor: "	rgb(255, 64, 0)",
              borderWidth: 2,
              label: {
                enabled: false,
                content: "Test label"
              }
            },
            {
              // Untere Warngrenze
              type: "line",
              mode: "horizontal",
              scaleID: "A",
              value: this.Info.uwg,
              borderColor: "	rgb(0, 128, 255)",
              borderWidth: 1,
              label: {
                enabled: false,
                content: "Test label"
              }
            },
            {
              // Obere Warngrenze
              type: "line",
              mode: "horizontal",
              scaleID: "A",
              value: this.Info.owg,
              borderColor: "	rgb(0, 128, 255)",
              borderWidth: 1,
              label: {
                enabled: false,
                content: "Test label"
              }
            }
          ]
        }
      };
    }
  },
  mounted() {
    this.fillChart();
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
