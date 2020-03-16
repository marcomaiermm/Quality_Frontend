import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import zoom from "chartjs-plugin-zoom";

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
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.addPlugin(zoom);
    this.renderChart(this.chartData, this.options);
  }
};
