<template>
  <q-menu>
    <div class="row no-wrap q-pa-md q-gutter-sm">
      <div class="column q-gutter-sm">
        <div class="text-h6 q-mb-md">Filtereinstellungen</div>
        <div class="q-gutter-md" v-if="tab == 'extern'">
          <q-radio
            v-model="filterOption"
            val="all_extern"
            dense
            label="Gesamt"
          ></q-radio>
          <q-radio
            v-model="filterOption"
            val="lieferant"
            dense
            label="Lieferant"
          ></q-radio>
          <q-radio
            v-model="filterOption"
            val="kunde"
            dense
            label="Kunde"
          ></q-radio>
        </div>
        <div class="q-gutter">
          <q-select
            v-model="modelMachines"
            multiple
            dense
            outlined
            use-input
            label="Maschinen"
            :options="Dataset"
          >
            <template v-slot:append>
              <q-icon
                v-if="modelMachines !== null"
                class="cursor-pointer"
                name="clear"
                @click.stop="modelMachines = null"
              >
              </q-icon>
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
      modelMachines: null,
      uniqueMachines: [],
      filterOption: "all_extern"
    };
  },
  computed: {
    Dataset: function() {
      let data = [];
      switch (this.tab) {
        case "intern":
          data = [...new Set(this.Data.map(item => item.MACHINE_NO))];
          break;
        case "extern":
          data = [...new Set(this.DataExtern.map(item => item.MACHINE_NO))];
          break;
        case "all":
          data = [...new Set(this.DataAll.map(item => item.MACHINE_NO))];
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

      this.updateFilterMachines(this.modelMachines);
    },
    ...mapActions("states", ["updateMenuTab"]),
    ...mapActions("dataset", ["updateFilterMachines"])
  },
  mounted() {
    this.filterOption = "all_extern";
    this.updateMenuTab(this.filterOption);
  }
};
</script>
