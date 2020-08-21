<template>
  <q-menu>
    <div class="row no-wrap q-pa-md q-gutter-xs">
      <div class="column q-gutter-md">
        <div class="text-h6 q-mb-md">Einstellungen</div>
        <q-toggle
          v-model="report"
          dense
          checked-icon="check"
          color="primary"
          label="Report erstellen"
          unchecked-icon="clear"
        ></q-toggle>
        <div class="q-gutter-xs" v-if="tab == 'extern'">
          <!--<q-radio v-model="filterOption" val="all_extern" dense label="Gesamt"></q-radio>-->
          <q-radio v-model="filterOption" val="lieferant" dense label="Lieferant"></q-radio>
          <q-radio v-model="filterOption" val="kunde" dense label="Kunde"></q-radio>
        </div>
        <div class="q-gutter-xs">
          <FilterSelect
            :stringOptions="Dataset.parts"
            :type="'Material'"
            :savedModel="MenuData.parts"
            :multipleselect="true"
            @onClickUpdate="updateOption"
            ref="selectParts"
          />
          <FilterSelect
            :stringOptions="Dataset.orders"
            :type="'Auftrag'"
            :savedModel="MenuData.orders"
            :multipleselect="true"
            @onClickUpdate="updateOption"
            ref="selectOrders"
          />
          <FilterSelect
            :stringOptions="Dataset.machines"
            :type="'Maschine'"
            :savedModel="MenuData.machines"
            :multipleselect="true"
            @onClickUpdate="updateOption"
            ref="selectMachines"
          />
          <!--
          <FilterSelect
            :stringOptions="Dataset.process"
            :type="'Vorgang'"
            :multipleselect="true"
            @onClickUpdate="updateOption"
            ref="selectProcess"
          />
          <FilterSelect
            :stringOptions="Dataset.productgrp"
            :type="'Produktgruppe'"
            :multipleselect="true"
            @onClickUpdate="updateOption"
            ref="selectGroup"
          />
          
          <FilterSelect
            :stringOptions="Dataset.material"
            :type="'Werkstoff'"
            :multipleselect="true"
            @onClickUpdate="updateOption"
            ref="selectMaterial"
          />
          -->
        </div>
        <q-btn
          color="primary"
          label="Anwenden"
          push
          size="sm"
          @click="updateOption()"
          v-close-popup
        ></q-btn>
      </div>
    </div>
  </q-menu>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["tab"],
  components: {
    FilterSelect: () => import("../components/FilterSelect")
  },
  data() {
    return {
      report: false,
      modelMachines: [],
      modelOrders: [],
      modelParts: [],
      uniqueMachines: [],
      filterOption: "lieferant"
      // modelProcess: [],
      // modelGroup: [],
      // modelMaterial: [],
    };
  },
  computed: {
    MenuData() {
      // let data = {
      //   machines: [],
      //   orders: [],
      //   parts: []
      // };
      // switch (this.tab) {
      //   case "intern":
      //     data = this.MenuIntern;
      //     break;

      //   case "extern":
      //     data = this.MenuExtern;
      //     break;
      // }
      return [];
    },
    Dataset() {
      const data = {
        machines: [],
        orders: [],
        parts: []
        // process: [],
        // productgrp: [],
        // material: []
      };
      if (this.Config) {
        data.machines = this.Config.machines;
        data.orders = this.Config.orders;
        data.parts = this.Config.parts;
        // data.process = this.Config.process;
        // data.productgrp = this.Config.productgrp;
        // data.material = this.Config.material;
      }
      return data;
    },
    ...mapGetters({
      Data: "dataset/getData",
      DataExtern: "dataset/getDataExtern",
      // DataAll: "dataset/getDataAll",
      Config: "config/getCfg",
      MenuIntern: "menuData/getMenuIntern",
      MenuExtern: "menuData/getMenuExtern"
    })
  },
  methods: {
    updateMenuData() {
      // const data = {
      //   machins: this.Dataset.machines,
      //   orders: this.Dataset.orders,
      //   parts: this.Dataset.parts
      // };
      switch (this.tab) {
        case "intern":
          this.updateMenuDashboardIntern(this.MenuData);
          break;
        case "extern":
          this.updateMenuDashboardExtern(this.MenuData);
          break;
      }
    },
    onClickUpdate() {
      this.updateOption();
    },
    updateOption() {
      switch (this.tab) {
        case "intern":
          this.updateMenuTab("intern");
          break;
        case "extern":
          this.updateMenuTab(this.filterOption);
          break;
        /*
        case "all":
          this.updateMenuTab("all");
          break;
        */
      }
      const filter = {
        report: this.report,
        machines: this.$refs.selectMachines.emitModel(),
        orders: this.$refs.selectOrders.emitModel(),
        parts: this.$refs.selectParts.emitModel()
        // process: this.$refs.selectProcess.emitModel(),
        // productgrp: this.$refs.selectGroup.emitModel(),
        // material: this.$refs.selectMaterial.emitModel(),
      };
      this.updateFilter(filter);
      this.updateMenuData();
    },
    ...mapActions("states", ["updateMenuTab"]),
    ...mapActions("dataset", ["updateFilter"]),
    ...mapActions("menuData", [
      "updateMenuDashboardIntern",
      "updateMenuDashboardExtern"
    ])
  },
  mounted() {
    this.filterOption = "lieferant";
    this.updateMenuTab(this.filterOption);
  }
};
</script>
