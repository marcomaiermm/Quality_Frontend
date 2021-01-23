<template>
  <q-card class="hist-card" flat>
    <div
      class="text-overline text-12"
    >Größte Kostenverursacher Top {{ Object.keys(MaxCosts).length }}</div>
    <!-- <div class="text-overline text-12">Größte Kostenverursacher nach Kategorie</div> -->
    <q-card-section>
      <table class="costTable">
        <thead>
          <tr>
            <th>{{ SelectOption }}</th>
            <th>Kosten</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cost, i) in MaxCosts" :key="i">
            <td>{{ cost[SelectOption] }}</td>
            <td>{{ cost.Kosten }}€</td>
          </tr>
        </tbody>
      </table>
      <div
        class="alligner-item aligner-item--bottom text-overline text-9"
      >Gesamtkosten: {{ format(allCosts) }}</div>
    </q-card-section>
  </q-card>
</template>

<script>
import { getCosts } from "../js/CalcCost";
import { formatCost } from "../js/FormatCost";
import { mapGetters } from "vuex";

export default {
  props: ["tab"],
  watch: {
    tab() {
      if (this.Data.length > 0) {
        this.fillData();
      }
    },
  },
  computed: {
    MaxCosts() {
      let costs = [...this.Costs];
      costs = costs.sort((a, b) => parseFloat(b.Kosten) - parseFloat(a.Kosten));
      costs = costs.slice(0, this.SelectHead);
      if (Object.keys(costs).length > 10) {
        costs = costs.slice(0, 10);
      }

      // if (Object.keys(costs).length>10) {
      //   costs = costs.slice(0,10)
      // }
      return costs;
    },
    Data() {
      let data = [];
      switch (this.tab) {
        case "intern":
          data = this.DataIntern;
          break;
        case "extern":
          data = this.DataExtern;
          break;
        /*
        case "all":
          data = this.DataAll;
          break;
        */
      }
      return data;
    },
    ...mapGetters({
      DataIntern: "dataset/getData",
      // DataAll: "dataset/getDataAll",
      DataExtern: "dataset/getDataExtern",
      SelectOption: "costOptions/getSelect",
      SelectHead: "costOptions/getHead",
      Costs: "costOptions/getCosts",
    }),
  },
  data() {
    return {
      costData: [],
      options: [
        "Auftrags-Nr.",
        "Maschine",
        "Material",
        /*
        "Fehlermerkmal",
        "Produktgruppe",
        "Vorgangs-Nr.",
        "Werkstoff"
        */
      ],
      costs: {
        order: [],
        part: [],
        machine: [],
        /*
        process: [],
        feature: [],
        productgrp: [],
        material: []
        */
      },
      maxCosts: {
        order: {},
        part: {},
        machine: {},
        /*
        feature: {},
        process: {},
        productgrp: {},
        material: {}
        */
      },
      allCosts: "",
    };
  },
  methods: {
    fillData() {
      this.options.forEach((option, i) => {
        const key = Object.keys(this.costs)[i];
        const costObj = getCosts(this.Data, option);
        this.costs[key] = costObj;
        this.maxCosts[key] = costObj.reduce(function (prev, current) {
          return prev.Kosten > current.Kosten ? prev : current;
        });
      });

      // ES6 Funktion zum summieren der Kosten mittels Reduce
      const sum = (a, b) => Math.round((a + b + Number.EPSILON) * 100) / 100;

      // Aufsummieren der Kosten mittels reduce mit der oben definierten summenfunktion
      this.allCosts = this.Data.map((item) => {
        return item.Kosten;
      }).reduce(sum);
    },
    format(a) {
      return formatCost(a);
    },
  },
  mounted() {
    if (this.Data.length > 0) {
      this.fillData();
    }
  },
};
</script>

<style lang="sass" scoped>
.hist-card
  width: 100%

table.costTable
  border: 0px solid #1C6EA4
  width: 100%


table.costTable td, table.costTable th
  border: 0px solid #AAAAAA
  padding: .4rem .7rem

table.costTable tbody td
  font-size: .8rem
  font-weight: 500

table.costTable tr:nth-child(even)
  background: #D0E4F5

table.costTable thead
  border-bottom: 2px solid #444444

table.costTable thead th
  font-size: 15px
  font-weight: bold
  color: #FFFFFF
  text-align: left
  border-left: 2px solid #D0E4F5
  background: $primary

table.costTable thead th:first-child
  border-left: none

.aligner-item--bottom
  align-self: flex-end
</style>
