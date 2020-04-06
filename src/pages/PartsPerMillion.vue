<template>
  <!--<q-page class="flex flex-center">-->
  <div class="q-app">
    <div class="q-pa-md">
      <div class="col-12">
        <PPMTable :dataset="PPM" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "PartsPerMillion",
  components: {
    PPMTable: () => import("../components/PPMTable")
  },
  data() {
    return {
      dummy: [{ Status: "Warte auf Daten..." }],
      seed: [],
      columns: [],
      loading: false
    };
  },
  computed: {
    ...mapGetters({ PPM: "dataset/getPPM" })
  },
  methods: {
    parsePPM() {
      this.loading = true;
      this.$axios.get("http://192.168.8.218:5000/ppm").then(response => {
        const seed = JSON.parse(response.data);
        this.updatePPM(seed);
        this.loading = false;
      });
    },
    ...mapActions("dataset", ["updatePPM"])
  },
  mounted() {
    if (Object.keys(this.PPM).length === 0) {
      this.parsePPM();
    }
  }
};
</script>
