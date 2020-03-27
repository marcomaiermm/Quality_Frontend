<template>
  <div class="q-pa-md">
    <q-card class="hist-card" bordered>
      <q-card-section>
        <div class="text-overline text-9">Histogramm</div>
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
  name: "HistChart",
  components: {
    CommitChartBar
  },
  computed: {
    ...mapGetters({
      History: "dataset/getHistory",
      HistoryCustomer: "dataset/getHistoryCustomer",
      HistorySupplier: "dataset/getHistorySupplier"
    })
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
      h: 370,
      w: 1000
      // margin: { top: 30, right: 20, bottom: 30, left: 50 }
    };
  },
  props: ["tab"],

  methods: {
    fillData() {
      this.datacollection = {
        labels: [],
        datasets: []
      };
      let dataHistory = [];
      switch (this.tab) {
        case "intern":
          dataHistory = this.History;
          break;
        case "lieferant":
          dataHistory = this.HistorySupplier;
          break;
        case "kunde":
          dataHistory = this.HistoryCustomer;
          break;
      }

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
      case "lieferant":
        data = this.HistorySupplier;
        break;
      case "kunde":
        data = this.HistoryCustomer;
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
