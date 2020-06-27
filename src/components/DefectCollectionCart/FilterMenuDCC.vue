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
            <q-btn-toggle 
            v-show="model === 'extern'"
            v-model="modelExtern"
            toggle-color="primary"
            unelevated
            spread
            :options="[{label:'Kunde', value:'kunde'},{label:'Lieferant',value:'lieferant'}]"
            ></q-btn-toggle>
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
            <div class="col">
              <q-btn-toggle
                v-model="timeModel"
                toggle-color="primary"
                unelevated
                spread
                :options="[
                { label: 'Kalenderwoche', value: 'kw' },
                { label: 'Monat', value: 'month' }
              ]"
              ></q-btn-toggle>
            </div>

            <div class="row" v-if="timeModel==='kw'">
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

            <div class="row" v-if="timeModel==='month'">
              <q-select
                v-model="modelMonthFrom"
                :options="timeOptions"
                dense
                square
                outlined
                maxlength="2"
                size="2"
                label="Von Monat"
                style="width: 100%"
              >
                <template v-slot:append>
                  <q-icon
                    v-show="modelMonthFrom !== ''"
                    class="cursor-pointer"
                    name="clear"
                    @click.stop="modelMonthFrom = ''"
                  ></q-icon>
                </template>
              </q-select>
              <q-select
                v-model="modelMonthTo"
                :options="OptionsMonthTo"
                dense
                square
                outlined
                maxlength="2"
                size="2"
                label="Bis Monat"
                style="width: 100%"
              >
                <template v-slot:append>
                  <q-icon
                    v-show="modelMonthTo !== ''"
                    class="cursor-pointer"
                    name="clear"
                    @click.stop="modelMonthTo = ''"
                  ></q-icon>
                </template>
              </q-select>
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
              :stringOptions="Config.machines"
              :multipleselect="true"
              :type="'Maschine'"
              ref="selectMachines"
            />
            <FilterSelect
              v-show="model === 'extern' && modelExtern=='kunde'"
              :stringOptions="Config.customer"
              :multipleselect="true"
              :type="'Kunde'"
              ref="selectCustomer"
            />
            <!--
              <FilterSelect
              :stringOptions="Config.process"
              :multipleselect="true"
              :type="'Vorgang'"
              ref="selectProcess"
            />
            -->
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
      modelExtern: "kunde",
      timeModel: "kw",
      timeOptions: [
        { label: "Januar", value: 1 },
        { label: "Februar", value: 2 },
        { label: "März", value: 3 },
        { label: "April", value: 4 },
        { label: "Mai", value: 5 },
        { label: "Juni", value: 6 },
        { label: "Juli", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "Oktober", value: 10 },
        { label: "November", value: 11 },
        { label: "Dezember", value: 12 }
      ],
      modelMonthFrom: "",
      modelMonthTo: "",
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
    Option() {
      let option='intern'
      if (this.model !== 'intern') {
        option = this.modelExtern
      }
      return option
    },
    OptionsMonthTo() {
      let options = this.timeOptions;
      if (Object.keys(this.modelMonthFrom).length > 0) {
        options = this.timeOptions.filter(
          d => d.value >= this.modelMonthFrom.value
        );
      }
      return options;
    },
    ...mapGetters({
      Config: "config/getCfg"
    })
  },
  methods: {
    emitOptions() {
      if (this.modelMonthFrom === "") {
        this.modelMonthFrom = this.modelMonthTo;
      }

      if (this.modelMonthTo === "") {
        this.modelMonthTo = this.modelMonthFrom;
      }
      const options = {
        tab: this.model,
        option: this.Option,
        year: this.textYear,
        timeOption: this.timeModel,
        weeks: [this.textFromWeek, this.textToWeek],
        months: [this.modelMonthFrom.value, this.modelMonthTo.value],
        parts: this.$refs.selectParts.emitModel(),
        orders: this.$refs.selectOrders.emitModel(),
        machines: this.$refs.selectMachines.emitModel(),
        customer: this.$refs.selectCustomer.emitModel(),
        lang: this.lanModel
        // process: this.$refs.selectProcess.emitModel(),
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
