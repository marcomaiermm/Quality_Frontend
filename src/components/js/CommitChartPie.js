import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
/* 
  Wiederverwendbarer Konstruktor für ein Säulendiagramm
  Daten und Optionen werden als Props exportiert. Nachdem das Diagramm gerenderd wird, 
  hat jedes Diagramm seine eigene Instanz mit befüllten Daten
*/
export default {
  extends: Doughnut,
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
  // Wird ausgeführt sobald das Diagramm aufgerufen wird.
  mounted() {
    // this.chartData wird im MixIn erstellt.
    this.renderChart(this.chartData, this.options);
  }
};
