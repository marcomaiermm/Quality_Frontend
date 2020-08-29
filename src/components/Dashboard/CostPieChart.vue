<template>
  <div>
    <div class="row">
      <div class="col text-overline text-9">Kostenaufschlüsselung in EUR</div>
      <div class="col-6">
        <TopSlider :maxValue="Object.keys(Data).length" @sliderRefreshEmit="slicedPie" />
      </div>
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
import TopSlider from "../TopSlider";
import { getCosts } from "../js/CalcCost";
import { formatCost } from "../js/FormatCost";
import { interpolateColors } from "../js/InterpolateColors";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CostPieChart",
  props: ["tab"],
  components: {
    CommitChartPie,
    TopSlider
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
    MaxValues() {
      let len = 0
      if (Object.keys(this.Data).length > 0) {
        len = Object.keys(this.Data).length;
      }
      return len
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
      this.updateSelect(this.model)
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
        "Maschine",
        "Material"
        /*
        "Fehlermerkmal",
        "Produktgruppe",
        "Vorgangs-Nr.",
        "Werkstoff"
        */
      ],
      datacollection: {
        labels: [],
        datasets: []
      },
      plotLength: 5,
      options: {},
      h: 370,
      w: 1000
    };
  },
  methods: {
    slicedPie(value) {
      this.plotLength = value;
      this.updateSelect(this.model)
      this.updateHead(this.plotLength)
      this.fillPie();
    },
    sliceData(data){
      let cost = data
      cost = cost.slice(0,this.plotLength)
      return cost
    },
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
      this.updateCosts(collection)
      collection = this.sliceData(collection)
      
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
        },
        tooltips: {
          mode: "label",
          callbacks: {
            label: function(tooltipItem, data) {
              const indice = tooltipItem.index;
              return (
                data.labels[indice] +
                ": " +
                formatCost(data.datasets[0].data[indice])
              );
            }
          }
        }
      };
    },
    ...mapActions("costOptions", ["updateSelect","updateHead","updateCosts"]),
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
