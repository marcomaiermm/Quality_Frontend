<template>
  <q-card style="width: 300px">
    <q-card-section>
      <div class="row no-wrap q-pa-md q-gutter-xs">
        <div class="column q-gutter-md">
          <div class="row">
            <div class="col text-h6">Auswahl</div>
            <div class="col">
              <q-toggle
                :label="lanModel"
                icon="g_translate"
                color="primary"
                false-value="de"
                true-value="en"
                v-model="lanModel"
                keep-color
              ></q-toggle>
            </div>
          </div>
          <div class="q-gutter-xs col">
            <q-btn-toggle
              v-model="model"
              toggle-color="primary"
              unelevated
              spread
              :options="[
                { label: 'Intern', value: 'intern' },
                { label: 'Extern', value: 'extern' }
              ]"
            ></q-btn-toggle>

            <div class="row">
              <q-select
                v-model="textYear"
                :options="yearOptions"
                dense
                square
                outlined
                maxlength="4"
                style="width: 250px"
                label="Jahr"
              >
                <template v-slot:append>
                  <q-icon
                    v-show="textYear !== ''"
                    class="cursor-pointer"
                    name="clear"
                    @click.stop="textYear = ''"
                  ></q-icon>
                </template>
              </q-select>

              <q-input
                v-model="textFromWeek"
                dense
                square
                outlined
                maxlength="2"
                size="2"
                label="Von KW"
                style="width: 125px"
                @keyup="numericFromWeek"
              >
                <template v-slot:append>
                  <q-icon
                    v-show="textFromWeek !== ''"
                    class="cursor-pointer"
                    name="clear"
                    @click.stop="textFromWeek = ''"
                  ></q-icon>
                </template>
              </q-input>

              <q-input
                v-model="textToWeek"
                dense
                square
                outlined
                maxlength="2"
                size="2"
                label="Bis KW"
                style="width: 125px"
                @keyup="numericToWeek"
              >
                <template v-slot:append>
                  <q-icon
                    v-show="textToWeek !== ''"
                    class="cursor-pointer"
                    name="clear"
                    @click.stop="textToWeek = ''"
                  ></q-icon>
                </template>
              </q-input>
            </div>
            <FilterSelect
              :stringOptions="Config.parts"
              :multipleselect="true"
              :type="'Material'"
              ref="selectParts"
            />
            <FilterSelect
              :stringOptions="Config.orders"
              :multipleselect="true"
              :type="'Auftrag'"
              ref="selectOrders"
            />
            <FilterSelect
              :stringOptions="Config.process"
              :multipleselect="true"
              :type="'Vorgang'"
              ref="selectProcess"
            />
            <FilterSelect
              :stringOptions="Config.machines"
              :multipleselect="true"
              :type="'Maschine'"
              ref="selectMachines"
            />
            <FilterSelect
              v-show="model === 'extern'"
              :stringOptions="Config.customer"
              :multipleselect="false"
              :type="'Kunde'"
              ref="selectCustomer"
            />
          </div>
          <q-card-actions align="center">
            <q-btn
              label="OK"
              color="primary"
              class="full-width"
              v-close-popup
              @click="emitOptions"
              :disabled="disabled"
            ></q-btn>
          </q-card-actions>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FilterMenuDDC",
  props: ["tab"],
  components: {
    FilterSelect: () => import("../FilterSelect")
  },
  data() {
    return {
      model: "intern",
      disabled: true,
      lanModel: "de",
      modelYearWeek: "year",
      yearOptions: [],
      textYear: "",
      textFromWeek: "",
      textToWeek: ""
    };
  },
  watch: {
    textYear(newVal, oldVal) {
      if (this.textYear === "") {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    }
  },

  computed: {
    ...mapGetters({
      Config: "config/getCfg"
    })
  },
  methods: {
    emitOptions() {
      const options = {
        tab: this.model,
        year: this.textYear,
        weeks: [this.textFromWeek, this.textToWeek],
        parts: this.$refs.selectParts.emitModel(),
        orders: this.$refs.selectOrders.emitModel(),
        process: this.$refs.selectProcess.emitModel(),
        machines: this.$refs.selectMachines.emitModel(),
        customer: this.$refs.selectCustomer.emitModel(),
        lang: this.lanModel
      };
      this.$emit("saveConfigEmit", options);
    },
    formatWeeks(week) {
      if (week === "") {
        return;
      }
      let year = "";
      if (this.textYear.length === 2) {
        const y = new Date();
        const fullYear = y.getFullYear();
        year = fullYear.toString().charAt(0) + "0" + this.textYear;
      } else {
        year = this.year;
      }
      const fweek = year + "W" + week;
      console.log(fweek);
      return fweek;
    },
    numericFromWeek() {
      this.textFromWeek = this.textFromWeek.replace(/\D/g, "");
    },
    numericToWeek() {
      this.textToWeek = this.textToWeek.replace(/\D/g, "");
    },
    ...mapActions("states", ["updateMenuTab"])
  },
  mounted() {
    const startYear = new Date("01, 01, 2014").getFullYear();
    const currentYear = new Date().getFullYear();
    for (let index = startYear; index <= currentYear; index++) {
      this.yearOptions.push(index);
    }
  }
};
</script>
