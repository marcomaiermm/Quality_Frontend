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
        style="width: 100px"
      ></q-select>
    </div>
    <commit-chart-pie :width="w" :height="h" :chartData="datacollection" :options="options"></commit-chart-pie>
  </div>
</template>

<script>
import CommitChartPie from "../js/CommitChartPie";

export default {
  name: "ParetoChart",
  props: ["dataset"],
  components: {
    CommitChartPie
  },
  watch: {
    model() {
      this.fillPie();
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
      collection = this.calc_cost(this.dataset, this.model);

      const steps = Object.keys(collection).length;
      const s1 = Math.floor(steps / 2);
      const s2 = steps - s1;

      colorOne = this.interpolateColors(c1, c2, s1);
      colorTwo = this.interpolateColors(cm, c2, s2);
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
          /*
          "rgba(" +
            colors[i][0] +
            "," +
            colors[i][1] +
            "," +
            colors[i][2] +
            ",0.8)"
          */
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
    },
    calc_cost(data, option) {
      const grouped = data.reduce(
        (all, { [option]: c, Kosten: a }) => ({
          ...all,
          [c]: (all[c] || 0) + a
        }),
        {}
      );
      const result = Object.keys(grouped).map(k => ({
        [option]: k,
        Kosten: grouped[k]
      }));
      return result;
    },
    interpolateColor(color1, color2, factor) {
      if (arguments.length < 3) {
        factor = 0.5;
      }
      const result = color1.slice();
      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
      }
      return result;
    },

    interpolateColors(color1, color2, steps) {
      const stepFactor = 1 / (steps - 1);
      const interpolatedColorArray = [];

      // \d => einfache Stelle (56 => 5,6) \d+ => zwei Stellen (56=>56)
      // Number Konstruktor stellt Konvertierung in eine Zahl sicher
      color1 = color1.match(/\d+/g).map(Number);
      color2 = color2.match(/\d+/g).map(Number);

      for (let i = 0; i < steps; i++) {
        interpolatedColorArray.push(
          this.interpolateColor(color1, color2, stepFactor * i)
        );
      }
      return interpolatedColorArray;
    }
  }
};
</script>

<style lang="sass">
.small
  max-width: 600px
  margin: 15px auto
</style>
