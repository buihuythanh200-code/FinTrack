const buildWeeklyCashFlow = (rows, startDate) => {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const map = new Map(
    rows.map((row) => [
      new Date(row.date).toISOString().split("T")[0],
      {
        income: Number(row.income),
        expense: Number(row.expense),
      },
    ]),
  );

  const results = [];
  const start = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const key = `${current.getFullYear()}-${String(
      current.getMonth() + 1,
    ).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
  }
};
