<template>
  <div>
    <div class="row">
      <div class="text-overline text-9">Kosten</div>
      <q-space></q-space>
      <q-select
        borderless
        v-model="model"
        dense
        :options="selectOption"
        map-options
        emit-value
        label="Auswahl"
        style="width: 120px"
      ></q-select>
    </div>
    <commit-chart-pie :width="w" :height="h" :chartData="datacollection" :options="options"></commit-chart-pie>
  </div>
</template>

<script>
import CommitChartPie from "../js/CommitChartPie";
import { getCosts } from "../js/CalcCost";
import { interpolateColors } from "../js/InterpolateColors";
import { mapGetters } from "vuex";

export default {
  name: "CostPieChart",
  props: ["tab"],
  components: {
    CommitChartPie
  },
  computed: {
    Data() {
      let data = [];
      switch (this.tab) {
        case "intern":
          data = this.DataIntern;
          break;
        case "extern":
          data = this.DataExtern;
          break;
        case "all":
          data = this.DataAll;
          break;
      }
      return data;
    },
    ...mapGetters({
      DataIntern: "dataset/getData",
      DataAll: "dataset/getDataAll",
      DataExtern: "dataset/getDataExtern"
    })
  },
  watch: {
    model() {
      this.fillPie();
    },
    tab() {
      if (this.Data.length > 0) {
        this.fillPie();
      }
    }
  },
  data() {
    return {
      model: "Material",
      selectOption: [
        "Auftrags-Nr.",
        "Vorgangs-Nr.",
        "Fehlermerkmal",
        "Material",
        "Maschine"
      ],
      datacollection: {
        labels: [],
        datasets: []
      },
      options: {},
      h: 370,
      w: 1000
    };
  },
  methods: {
    fillPie() {
      let colors = [];
      let colorOne = [];
      let colorTwo = [];
      let collection = null;
      const c1 = "rgb(221, 3, 51)";
      const cm = "rgb(217, 221, 3)";
      const c2 = "rgb(0, 56, 113)";
      this.datacollection = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: []
          }
        ]
      };
      collection = getCosts(this.Data, this.model);
      const steps = Object.keys(collection).length;
      const s1 = Math.floor(steps / 2);
      const s2 = steps - s1;

      colorOne = interpolateColors(c1, c2, s1);
      colorTwo = interpolateColors(cm, c2, s2);
      colors = colorOne.concat(colorTwo);

      collection.sort((a, b) => parseFloat(a.Kosten) - parseFloat(b.Kosten));
      collection = collection.map(item => {
        return {
          label: item[this.model],
          data: item.Kosten
        };
      });
      collection.forEach((element, i) => {
        const ridx = Math.random();
        const color = [
          colors[Math.floor(ridx * colors.length)][0],
          colors[Math.floor(ridx * colors.length)][1],
          colors[Math.floor(ridx * colors.length)][2]
        ];
        colors = colors.filter(item => !color.includes(item));
        this.datacollection.datasets[0].data.push(element.data);
        this.datacollection.datasets[0].backgroundColor.push(
          "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.8)"
        );
        this.datacollection.labels.push(element.label);
      });
      this.setOptions();
    },
    setOptions() {
      this.options = {
        responsive: true,
        legend: {
          display: false
        },
        animation: {
          duration: 2000
        }
      };
    }
  },
  mounted() {
    if (this.Data.length > 0) {
      this.fillPie();
    }
  }
};
</script>

<style lang="sass">
.small
  max-width: 600px
  margin: 15px auto
</style>
