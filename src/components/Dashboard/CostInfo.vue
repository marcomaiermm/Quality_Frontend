<template>
  <q-card class="hist-card" flat>
    <div class="text-overline text-12">Größte Kostenverursacher nach Kategorie</div>
    <q-card-section>
      <div class="row">
        <div class="col">
          <div class="text-overline text-9">Maschine:</div>
          <div class="text-overline text-9">Auftrag:</div>
          <div class="text-overline text-9">Vorgang:</div>
          <div class="text-overline text-9">Material:</div>
          <div class="text-overline text-9">Fehlermerkmal:</div>
          <div class="text-overline text-9">Produktgruppe:</div>
          <div class="text-overline text-9">Werkstoff:</div>
        </div>
        <q-separator vertical inset />
        <div class="col q-pl-md">
          <div class="text-overline text-9">{{ maxCosts.machine.Maschine }}</div>
          <div class="text-overline text-9">{{ maxCosts.order["Auftrags-Nr."] }}</div>
          <div class="text-overline text-9">{{ maxCosts.process["Vorgangs-Nr."] }}</div>
          <div class="text-overline text-9">{{ maxCosts.part.Material }}</div>
          <div class="text-overline text-9">{{ maxCosts.feature.Fehlermerkmal }}</div>
          <div class="text-overline text-9">{{ maxCosts.productgrp.Produktgruppe }}</div>
          <div class="text-overline text-9">{{ maxCosts.material.Werkstoff }}</div>
        </div>
        <q-separator vertical inset />
        <div class="col q-pl-md">
          <div class="text-overline text-9">{{ format(maxCosts.machine.Kosten) }}</div>
          <div class="text-overline text-9">{{ format(maxCosts.order.Kosten) }}</div>
          <div class="text-overline text-9">{{ format(maxCosts.process.Kosten) }}</div>
          <div class="text-overline text-9">{{ format(maxCosts.part.Kosten) }}</div>
          <div class="text-overline text-9">{{ format(maxCosts.feature.Kosten) }}</div>
          <div class="text-overline text-9">{{ format(maxCosts.productgrp.Kosten) }}</div>
          <div class="text-overline text-9">{{ format(maxCosts.material.Kosten) }}</div>
        </div>
      </div>
      <q-separator horizontal inset />
      <div class="row">
        <div class="col">
          <div class="text-overline text-9">Gesamt:</div>
        </div>
        <div class="col q-pl-md">
          <div class="text-overline text-9"></div>
        </div>
        <q-separator vertical inset />
        <div class="col q-pl-md">
          <div class="text-overline text-9">{{format(allCosts)}}</div>
        </div>
      </div>
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
    }
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
  data() {
    return {
      costData: [],
      options: [
        "Auftrags-Nr.",
        "Vorgangs-Nr.",
        "Fehlermerkmal",
        "Material",
        "Maschine",
        "Produktgruppe",
        "Werkstoff"
      ],
      costs: {
        order: [],
        process: [],
        feature: [],
        part: [],
        machine: [],
        productgrp: [],
        material: []
      },
      maxCosts: {
        order: {},
        process: {},
        feature: {},
        part: {},
        machine: {},
        productgrp: {},
        material: {}
      },
      allCosts: ""
    };
  },
  methods: {
    fillData() {
      this.options.forEach((option, i) => {
        const key = Object.keys(this.costs)[i];
        const costObj = getCosts(this.Data, option);
        this.costs[key] = costObj;
        this.maxCosts[key] = costObj.reduce(function(prev, current) {
          return prev.Kosten > current.Kosten ? prev : current;
        });
      });
      // ES6 Funktion zum summieren der Kosten mittels Reduce
      const sum = (a, b) => Math.round((a + b + Number.EPSILON) * 100) / 100;

      // Aufsummieren der Kosten mittels reduce mit der oben definierten summenfunktion
      this.allCosts = this.Data.map(item => {
        return item.Kosten;
      }).reduce(sum);
    },
    format(a) {
      return formatCost(a);
    }
  },
  mounted() {
    if (this.Data.length > 0) {
      this.fillData();
    }
  }
};
</script>

<style lang="sass">
.hist-card
  width: 100%
</style>
