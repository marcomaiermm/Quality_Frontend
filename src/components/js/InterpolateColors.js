export default {
  methods: {
    interpolateColor(color1, color2, factor) {
      if (arguments.length < 3) {
        factor = 0.5;
      }
      const result = color1.slice();
      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
      }
      return result;
    },

    interpolateColors(color1, color2, steps) {
      const stepFactor = 1 / (steps - 1);
      const interpolatedColorArray = [];

      // \d => einfache Stelle (56 => 5,6) \d+ => zwei Stellen (56=>56)
      // Number Konstruktor stellt Konvertierung in eine Zahl sicher
      color1 = color1.match(/\d+/g).map(Number);
      color2 = color2.match(/\d+/g).map(Number);

      for (let i = 0; i < steps; i++) {
        interpolatedColorArray.push(
          this.interpolateColor(color1, color2, stepFactor * i)
        );
      }
      return interpolatedColorArray;
    }
  }
};
