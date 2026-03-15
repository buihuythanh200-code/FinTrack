const parseLocalDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// 1. Fill data weekly
const buildWeeklyCashFlow = (rows, startDate) => {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const map = new Map(
    rows.map((row) => [
      row.date,
      {
        income: Number(row.income),
        expense: Number(row.expense),
      },
    ]),
  );

  const results = [];
  const start = parseLocalDate(startDate);
  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const key = `${current.getFullYear()}-${String(
      current.getMonth() + 1,
    ).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

    const values = map.get(key) || { income: 0, expense: 0 };
    results.push({
      name: dayNames[i],
      income: values.income,
      expense: values.expense,
    });
  }

  return results;
};

// 2. Fill data Monthly
const buildMonthlyCashFlow = (rows) => {
  const weekNames = ["week 1", "week 2", "week 3", "week 4"];

  const map = new Map(
    rows.map((row) => [
      row.week_name,
      {
        income: Number(row.income),
        expense: Number(row.expense),
      },
    ]),
  );

  return weekNames.map((week) => {
    const values = map.get(week) || { income: 0, expense: 0 };

    return {
      name: week,
      income: values.income,
      expense: values.expense,
    };
  });
};

// 3. build data yearly
const buildYearlyCashFlow = (rows) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const map = new Map(
    rows.map((row) => [
      row.month_number,
      {
        income: Number(row.income),
        expense: Number(row.expense),
      },
    ]),
  );

  return monthNames.map((month, index) => {
    const monthNumber = index + 1;
    const values = map.get(monthNumber) || { income: 0, expense: 0 };

    return {
      name: month,
      income: values.income,
      expense: values.expense,
    };
  });
};

module.exports = {
  buildWeeklyCashFlow,
  buildMonthlyCashFlow,
  buildYearlyCashFlow,
};
