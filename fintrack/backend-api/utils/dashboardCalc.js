const toNumber = (value) => Number(value ?? 0);
const calcPercentChange = (current, previous) => {
  if (previous === 0) return 0;
  return +(((current - previous) / previous) * 100).toFixed(2);
};
const calcBudgetGrowthPercent = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return +(((current - previous) / previous) * 100).toFixed(2);
};
module.exports = {
  toNumber,
  calcPercentChange,
  calcBudgetGrowthPercent,
};
