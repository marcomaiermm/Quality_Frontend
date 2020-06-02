<template>
  <div id="idx">
    <div id="bg"></div>

    <div class="content row">
      <div class="item col-4">
        <router-link to="/dashboard">
          <q-img
            src="../assets/landing-dashboard.png"
            style="width: 70%"
            native-context-menu
            class="qimg rounded-borders"
          >
            <div class="imgtext absolute-bottom text-subtitle1 text-center">Dashboard</div>
          </q-img>
        </router-link>
      </div>
      <div class="item col-4">
        <router-link to="/defectcollectioncard">
          <q-img
            src="../assets/landing-defect.png"
            style="width: 70%"
            native-context-menu
            class="qimg rounded-borders"
          >
            <div class="imgtext absolute-bottom text-subtitle1 text-center">Fehlersammelkarte</div>
          </q-img>
        </router-link>
      </div>
      <div class="item col-4">
        <router-link to="/qualitycontrolchart">
          <q-img
            src="../assets/landing-quality.png"
            style="width: 70%"
            native-context-menu
            class="qimg rounded-borders"
          >
            <div class="imgtext absolute-bottom text-subtitle1 text-center">Qualitätsregelkarte</div>
          </q-img>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Index",
  data() {
    return {
      w: {
        height: 0
      }
    };
  },
  computed: {
    ...mapGetters({
      Config: "config/getCfg",
      Path: "config/getPath"
    })
  },
  methods: {
    handleResize() {
      this.w.height = Math.round(window.innerHeight);

      const idx = document.getElementById("idx");
      // const content = document.getElementById("content");
      if (idx !== null) {
        idx.style.height = this.w.height - 54 + "px";
      }
    },
    ...mapActions("config", ["updateConfig"])
  },

  created() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);

    // Als erstes die config Daten aus der Datenbank laden (Maschinen, Aufträge, etc.)
    // und in den Store schreiben

    if (Object.keys(this.Config).length < 2) {
      const config = {};
      this.$axios
        .get("http://" + this.Path.host + ":" + this.Path.port + "/cfg")
        .then(response => {
          const seed = response.data;

          Object.keys(seed).forEach(element => {
            const set = JSON.parse(seed[element]);
            const key = Object.keys(set[0]);
            config[element] = Object.values(set)
              .map(item => item[key])
              .sort();
          });
          this.updateConfig(config);
        });
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    this.handleResize();
  }
};
</script>
<style scoped>
#idx {
  position: relative;
  width: 100%;
  align-content: center;
}
#bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: blur(5px);
  background-image: url(../assets/landing.png);
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -1;
}
.content {
  height: 100%;
  padding: 0;
  margin: 0;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item {
  text-align: center;
}

.qimg:hover {
  transform: scale(1.2);
  cursor: pointer;
}

.qimg {
  box-shadow: 2px 3px 8px 3px rgba(0, 0, 0, 0.5);
  transition: 0.1s;
}
.imgtext {
  user-select: none;
}
</style>