<template>
  <q-card class="hist-card" flat>
    <q-card-section>
      <div class="row">
        <div class="col">
          <div class="text-overline text-9">Maschine:</div>
          <div class="text-overline text-9">Auftrag:</div>
          <div class="text-overline text-9">Vorgang:</div>
          <div class="text-overline text-9">Material:</div>
          <div class="text-overline text-9">Fehlermerkmal:</div>
        </div>
        <q-separator vertical inset />
        <div class="col q-pl-md">
          <div class="text-overline text-9">{{maxCosts.machine.Maschine}}</div>
          <div class="text-overline text-9">{{maxCosts.order["Auftrags-Nr."]}}</div>
          <div class="text-overline text-9">{{maxCosts.process["Vorgangs-Nr."]}}</div>
          <div class="text-overline text-9">{{maxCosts.part.Material}}</div>
          <div class="text-overline text-9">{{maxCosts.feature.Fehlermerkmal}}</div>
        </div>
        <q-separator vertical inset />
        <div class="col q-pl-md">
          <div class="text-overline text-9">{{maxCosts.machine.Kosten}}</div>
          <div class="text-overline text-9">{{maxCosts.order.Kosten}}</div>
          <div class="text-overline text-9">{{maxCosts.process.Kosten}}</div>
          <div class="text-overline text-9">{{maxCosts.part.Kosten}}</div>
          <div class="text-overline text-9">{{maxCosts.feature.Kosten}}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { getCosts } from "../js/CalcCost";
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
        "Maschine"
      ],
      costs: {
        order: [],
        process: [],
        feature: [],
        part: [],
        machine: []
      },
      maxCosts: {
        order: {},
        process: {},
        feature: {},
        part: {},
        machine: {}
      }
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
