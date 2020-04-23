<template>
  <q-menu>
    <div class="row no-wrap q-pa-md q-gutter-sm">
      <div class="column q-gutter-sm">
        <div class="text-h6 q-mb-md">Filtereinstellungen</div>
        <div class="q-gutter-md" v-if="tab == 'extern'">
          <q-radio v-model="filterOption" val="all_extern" dense label="Gesamt"></q-radio>
          <q-radio v-model="filterOption" val="lieferant" dense label="Lieferant"></q-radio>
          <q-radio v-model="filterOption" val="kunde" dense label="Kunde"></q-radio>
        </div>
        <div class="q-gutter-xs">
          <q-select
            v-model="modelMachines"
            multiple
            dense
            outlined
            use-input
            label="Maschinen"
            :options="Dataset.machines"
          >
            <template v-slot:append>
              <q-icon
                v-if="modelMachines !== null"
                class="cursor-pointer"
                name="clear"
                @click.stop="modelMachines = null"
              ></q-icon>
            </template>
          </q-select>
          <q-select
            v-model="modelOrders"
            multiple
            dense
            outlined
            use-input
            label="Auftrag"
            :options="Dataset.orders"
          >
            <template v-slot:append>
              <q-icon
                v-if="modelOrders !== null"
                class="cursor-pointer"
                name="clear"
                @click.stop="modelOrders = null"
              ></q-icon>
            </template>
          </q-select>
          <q-select
            v-model="modelParts"
            multiple
            dense
            outlined
            use-input
            label="Teil"
            :options="Dataset.parts"
          >
            <template v-slot:append>
              <q-icon
                v-if="modelParts !== null"
                class="cursor-pointer"
                name="clear"
                @click.stop="modelParts = null"
              ></q-icon>
            </template>
          </q-select>
          <q-select
            v-model="modelProcess"
            multiple
            dense
            outlined
            use-input
            label="Vorgang"
            :options="Dataset.process"
          >
            <template v-slot:append>
              <q-icon
                v-if="modelProcess !== null"
                class="cursor-pointer"
                name="clear"
                @click.stop="modelProcess = null"
              ></q-icon>
            </template>
          </q-select>
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
  data() {
    return {
      modelMachines: [],
      modelOrders: [],
      modelProcess: [],
      modelParts: [],
      uniqueMachines: [],
      filterOption: "all_extern"
    };
  },
  computed: {
    Dataset: function() {
      const data = {
        machines: [],
        orders: [],
        process: [],
        parts: []
      };
      switch (this.tab) {
        case "intern":
          data.machines = [...new Set(this.Data.map(item => item.MACHINE_NO))];
          data.orders = [...new Set(this.Data.map(item => item.ORDER_ID))];
          data.process = [...new Set(this.Data.map(item => item.PROCESS_ID))];
          data.parts = [...new Set(this.Data.map(item => item.TEILE_NR))];
          break;
        case "extern":
          data.machines = [
            ...new Set(this.DataExtern.map(item => item.MACHINE_NO))
          ];
          data.orders = [
            ...new Set(this.DataExtern.map(item => item.ORDER_ID))
          ];
          data.process = [
            ...new Set(this.DataExtern.map(item => item.PROCESS_ID))
          ];
          data.parts = [...new Set(this.DataExtern.map(item => item.TEILE_NR))];
          break;
        case "all":
          data.machines = [
            ...new Set(this.DataAll.map(item => item.MACHINE_NO))
          ];
          data.orders = [...new Set(this.DataAll.map(item => item.ORDER_ID))];
          data.process = [
            ...new Set(this.DataAll.map(item => item.PROCESS_ID))
          ];
          data.parts = [...new Set(this.DataAll.map(item => item.TEILE_NR))];
          break;
      }
      return data;
    },

    ...mapGetters({
      Data: "dataset/getData",
      DataExtern: "dataset/getDataExtern",
      DataAll: "dataset/getDataAll"
    })
  },
  methods: {
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
        machines: this.modelMachines,
        orders: this.modelOrders,
        process: this.modelProcess,
        parts: this.modelParts
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
