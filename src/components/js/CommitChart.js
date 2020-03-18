import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import zoom from "chartjs-plugin-zoom";
/*
Wiederverwendbarer Konstruktor für ein Liniendiagramm
Daten und Optionen werden als Props exportiert. Nachdem das Diagramm gerenderd wird,
hat jedes Diagramm seine eigene Instanz mit befüllten Daten
*/
export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  /*  Watcher der die übergebenen Daten beobachtet. Bei einer Änderung wird der Code ausgeführt.
      Das Diagramm wird aktualisiert.
  */
  watch: {
    chartData() {
      this.$data._chart.update();
    }
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.addPlugin(zoom);
    this.renderChart(this.chartData, this.options);
  }
};
