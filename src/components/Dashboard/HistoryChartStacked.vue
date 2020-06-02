<template>
  <div>
    <div class="row">
      <div class="text-overline text-9">Histogramm</div>
      <q-space></q-space>
      <q-select
        borderless
        v-model="model"
        dense
        :options="selects"
        map-options
        emit-value
        label="Auswahl"
        style="width: 120px"
      ></q-select>
    </div>
    <commit-chart-bar :width="w" :height="h" :chartData="datacollection" :options="options"></commit-chart-bar>
  </div>
</template>

<script>
import CommitChartBar from "../js/CommitChartBar.js";
import { mapGetters } from "vuex";
import { interpolateColors } from "../js/InterpolateColors";

export default {
  name: "HistChart",
  components: {
    CommitChartBar
  },
  data() {
    return {
      model: "parts",
      selects: [
        {
          label: "Material",
          value: "parts"
        },
        {
          label: "Auftrag",
          value: "orders"
        },
        {
          label: "Vorgang",
          value: "process"
        },
        {
          label: "Maschine",
          value: "machines"
        },
        {
          label: "Produktgruppe",
          value: "productgrp"
        },
        {
          label: "Werkstoff",
          value: "material"
        }
      ],
      datacollection: {
        labels: [],
        datasets: []
      },
      fehler: [],
      dataset: {},
      options: {},
      h: 370,
      w: 1000
      // margin: { top: 30, right: 20, bottom: 30, left: 50 }
    };
  },
  props: ["tab"],
  computed: {
    Data() {
      let data = [];
      switch (this.tab) {
        case "intern":
          data = this.History;
          break;
        case "extern":
          data = this.HistoryExtern;
          break;
        case "all":
          data = this.HistoryAll;
          break;
      }
      return data;
    },
    ...mapGetters({
      History: "dataset/getHistory",
      HistoryAll: "dataset/getHistoryAll",
      HistoryExtern: "dataset/getHistoryExtern"
    })
  },
  watch: {
    model() {
      if (typeof this.Data === "object" && Object.keys(this.Data).length > 0) {
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

      let colors = [];
      let colorOne = [];
      let colorTwo = [];
      const c1 = "rgb(0, 56, 113)";
      const cm = "rgb(217, 221, 3)";
      const c2 = "rgb(221, 3, 51)";

      const dataHistory = JSON.parse(this.Data[this.model]);

      if (Object.keys(dataHistory).length === 0) {
        return;
      }

      const steps = Object.keys(dataHistory[Object.keys(dataHistory)[0]])
        .length;
      const s1 = Math.floor(steps / 2);
      const s2 = steps - s1;

      colorOne = interpolateColors(c1, cm, s1);

      colorTwo = interpolateColors(cm, c2, s2);

      colors = colorOne.concat(colorTwo);

      Object.keys(dataHistory[Object.keys(dataHistory)[0]]).forEach(key => {
        this.datacollection.datasets.push({
          label: key,
          data: [],
          backgroundColor: ""
        });
      });

      Object.keys(dataHistory).forEach(key => {
        this.datacollection.labels.push(key);
        Object.keys(dataHistory[key]).forEach((innerKey, index) => {
          this.datacollection.datasets[index].data.push(
            dataHistory[key][innerKey]
          );

          // this.datacollection.datasets[index].backgroundColor =
          //  "rgba(2, 62, 115, 0.8)";
          this.datacollection.datasets[index].backgroundColor =
            "rgba(" +
            colors[index][0] +
            ", " +
            colors[index][1] +
            ", " +
            colors[index][2] +
            ", 0.8)";
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
            footer: (tooltipItem, data) => {
              let total = 0;
              for (let i = 0; i < data.datasets.length; i++) {
                total += data.datasets[i].data[tooltipItem[0].index];
              }
              return "Gesamt: " + total;
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
    let data = [];
    switch (this.tab) {
      case "intern":
        data = this.History;
        break;
      case "extern":
        data = this.HistoryExtern;
        break;
      case "all":
        data = this.HistoryAll;
        break;
    }

    if (
      typeof Object.keys(data) !== "undefined" &&
      Object.keys(data).length > 0
    ) {
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
