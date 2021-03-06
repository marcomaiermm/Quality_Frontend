export function getCosts(data, option) {
  const grouped = data.reduce(
    (all, { [option]: c, Kosten: a }) => ({
      ...all,
      [c]: (all[c] || 0) + a
    }),
    {}
  );
  const result = Object.keys(grouped).map(k => ({
    [option]: k,
    Kosten: Math.round((grouped[k] + Number.EPSILON) * 100) / 100
  }));
  return result;
}
