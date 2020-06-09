export function formatCost(a) {
  // Quelle: https://stackoverflow.com/questions/43208012/how-do-i-format-currencies-in-a-vue-component
  const val = (a / 1).toFixed(2).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "€";
}
