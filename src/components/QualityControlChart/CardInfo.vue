<template>
  <q-card class="hist-card" flat>
    <q-card-section>
      <div class="row">
        <div class="col">
          <div class="text-overline text-9">Maßeinheit:</div>
          <div class="text-overline text-9">Stichproben Umfang:</div>
          <div class="text-overline text-9">Prüfintervall:</div>
          <div class="text-overline text-9">Obere Toleranzgrenze:</div>
          <div class="text-overline text-9">Obere Eingriffsgrenze:</div>
          <div class="text-overline text-9">Obere Warngrenze:</div>
          <div class="text-overline text-9">Mittelwert</div>
          <div class="text-overline text-9">Untere Warngrenze:</div>
          <div class="text-overline text-9">Untere Eingriffsgrenze:</div>
          <div class="text-overline text-9">Untere Toleranzgrenze:</div>
        </div>
        <q-separator vertical inset />

        <div class="col q-pl-md">
          <div class="text-overline text-9">
            <svg width="10" height="10">
              <rect width="10" height="10" style="fill:#ffffff;" />
            </svg>
            {{ Data.unit }}
          </div>
          <div class="text-overline text-9">
            <svg width="10" height="10">
              <rect width="10" height="10" style="fill:#ffffff;" />
            </svg>
            {{ Data.umfang }}
          </div>
          <div class="text-overline text-9">
            <svg width="10" height="10">
              <rect width="10" height="10" style="fill:#ffffff;" />
            </svg>
            {{ intervall }} {{ intervallUnit }}
          </div>
          <div class="text-overline text-9">
            <svg width="10" height="10">
              <rect width="10" height="10" style="fill:#ffffff;" />
            </svg>
            {{ Data.ot }}
          </div>
          <div class="text-overline text-9">
            <svg width="10" height="10">
              <rect width="10" height="10" style="fill:#ff4000;" />
            </svg>
            {{ Data.oeg }}
          </div>
          <div class="text-overline text-9">
            <svg width="10" height="10">
              <rect width="10" height="10" style="fill:#0080ff;" />
            </svg>
            {{ Data.owg }}
          </div>
          <div class="text-overline text-9">
            <svg width="10" height="10">
              <rect width="10" height="10" style="fill:#33cc33;" />
            </svg>
            {{ Data.mittel }}
          </div>
          <div class="text-overline text-9">
            <svg width="10" height="10">
              <rect width="10" height="10" style="fill:#0080ff;" />
            </svg>
            {{ Data.uwg }}
          </div>
          <div class="text-overline text-9">
            <svg width="10" height="10">
              <rect width="10" height="10" style="fill:#ff4000;" />
            </svg>
            {{ Data.ueg }}
          </div>
          <div class="text-overline text-9">
            <svg width="10" height="10">
              <rect width="10" height="10" style="fill:#ffffff;" />
            </svg>
            {{ Data.ut }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: ["data", "windowHeight"],
  computed: {
    Data() {
      const data = {
        mittel: 0,
        oeg: 0,
        owg: 0,
        ueg: 0,
        uwg: 0,
        ut: 0,
        ot: 0,
        unit: "mm",
        umfang: 0
      };
      if (
        typeof this.data !== "undefined" &&
        Object.keys(this.data).length > 0
      ) {
        data.mittel = this.data.Mittel;
        data.oeg = this.data.OEG;
        data.ueg = this.data.UEG;
        data.owg = this.data.OWG;
        data.uwg = this.data.UWG;
        data.ot = this.data.OT;
        data.ut = this.data.UT;
        data.unit = this.data.Einheit;
        data.umfang = Object.keys(this.data).length;
      }
      return data;
    }
  },
  data() {
    return {
      part: "",
      intervall: 0,
      intervallUnit: ""
    };
  }
};
</script>

<style lang="sass">
.hist-card
  width: 100%
</style>
