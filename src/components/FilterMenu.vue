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
          <q-radio v-model="filterOption" val="all_extern" dense label="Gesamt"></q-radio>
          <q-radio v-model="filterOption" val="lieferant" dense label="Lieferant"></q-radio>
          <q-radio v-model="filterOption" val="kunde" dense label="Kunde"></q-radio>
        </div>
        <div class="q-gutter-xs">
          <FilterSelect
            :stringOptions="Dataset.parts"
            :type="'Material'"
            :multipleselect="true"
            @onClickUpdate="updateOption"
            ref="selectParts"
          />
          <FilterSelect
            :stringOptions="Dataset.orders"
            :type="'Auftrag'"
            :multipleselect="true"
            @onClickUpdate="updateOption"
            ref="selectOrders"
          />
          <FilterSelect
            :stringOptions="Dataset.process"
            :type="'Vorgang'"
            :multipleselect="true"
            @onClickUpdate="updateOption"
            ref="selectProcess"
          />
          <FilterSelect
            :stringOptions="Dataset.machines"
            :type="'Maschine'"
            :multipleselect="true"
            @onClickUpdate="updateOption"
            ref="selectMachines"
          />
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
  name: "FilterMenu",
  props: ["tab"],
  components: {
    FilterSelect: () => import("../components/FilterSelect")
  },
  data() {
    return {
      report: false,
      modelMachines: [],
      modelOrders: [],
      modelProcess: [],
      modelParts: [],
      uniqueMachines: [],
      filterOption: "all_extern"
    };
  },
  computed: {
    Dataset() {
      const data = {
        machines: [],
        orders: [],
        process: [],
        parts: []
      };
      if (this.Config) {
        data.machines = this.Config.machines;
        data.orders = this.Config.orders;
        data.process = this.Config.process;
        data.parts = this.Config.parts;
      }
      return data;
    },
    ...mapGetters({
      Data: "dataset/getData",
      DataExtern: "dataset/getDataExtern",
      DataAll: "dataset/getDataAll",
      Config: "config/getCfg"
    })
  },
  methods: {
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
        case "all":
          this.updateMenuTab("all");
          break;
      }
      const filter = {
        machines: this.$refs.selectMachines.emitModel(),
        orders: this.$refs.selectOrders.emitModel(),
        process: this.$refs.selectProcess.emitModel(),
        parts: this.$refs.selectParts.emitModel(),
        report: this.report
      };
      this.updateFilter(filter);
    },
    ...mapActions("states", ["updateMenuTab"]),
    ...mapActions("dataset", ["updateFilter"])
  },
  mounted() {
    this.filterOption = "all_extern";
    this.updateMenuTab(this.filterOption);
  }
};
</script>
