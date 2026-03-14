const getCurrentAndPreviousMonthInfo = () => {
  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const previousDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = previousDate.getMonth() + 1;
  const previousYear = previousDate.getFullYear();

  return {
    now,
    currentMonth,
    currentYear,
    previousMonth,
    previousYear,
  };
};

module.exports = {
  getCurrentAndPreviousMonthInfo,
};
