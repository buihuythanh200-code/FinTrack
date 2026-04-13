const {
  getSummaryRows,
  getTotalInitialBalanceRows,
  getLastMonthBalanceRows,
  getMonthlySummaryRows,
  getTopCategoryRows,
  getBudgetUsedPercentRows,
  getBudgetProgress,
  getExpenseRows,
  getRecentRows,
  getCashFlowByWeeksRows,
  getCashFlowByMonthRows,
  getCashFlowByYearRows,
  getParentCategories,
  getSubCategories,
} = require("../repositories/dashboardRepository");

const {
  buildWeeklyCashFlow,
  buildMonthlyCashFlow,
  buildYearlyCashFlow,
} = require("../utils/cashFlowUtils");

const {
  toNumber,
  calcPercentChange,
  calcBudgetGrowthPercent,
} = require("../utils/dashboardCalc");

const { getCurrentAndPreviousMonthInfo } = require("../utils/dashboardDate");

const getDashboardData = async (req, res) => {
  try {
    // THAY ĐỔI Ở ĐÂY: Lấy ID từ token đã giải mã
    const userId = req.user.id;

    console.log(">>> Đang lấy dữ liệu cho User ID:", userId);

    const { filter, startDate, endDate, month, year } = req.query;

    const { currentMonth, currentYear, previousMonth, previousYear } =
      getCurrentAndPreviousMonthInfo();

    // 11. Filter CashFlow by Week

    // 12. Filter CashFlow by Month

    // 13. Filter CashFlow by Year

    let cashFlow = [];

    if (filter === "week") {
      const cashFlowRows = await getCashFlowByWeeksRows(
        userId,
        startDate,
        endDate,
      );
      cashFlow = buildWeeklyCashFlow(cashFlowRows, startDate);
    }

    if (filter === "month") {
      const cashFlowRows = await getCashFlowByMonthRows(userId, month, year);
      cashFlow = buildMonthlyCashFlow(cashFlowRows);
    }

    if (filter === "year") {
      const cashFlowRows = await getCashFlowByYearRows(userId, year);
      cashFlow = buildYearlyCashFlow(cashFlowRows);
    }

    // 1. Summary
    const summaryRows = await getSummaryRows(userId);
    const totalInitialRows = await getTotalInitialBalanceRows(userId);

    const totalIncome = toNumber(summaryRows[0]?.total_income);
    const totalExpense = toNumber(summaryRows[0]?.total_expense);
    const totalInitial = toNumber(totalInitialRows[0]?.total_initial);

    const totalBalance = totalInitial + totalIncome - totalExpense;

    // 2. Total balance tháng trước

    const lastMonthBalanceRows = await getLastMonthBalanceRows(userId);
    const lastMonthBalance =
      totalInitial + toNumber(lastMonthBalanceRows[0]?.amount);
    const percentChangeBalance = calcPercentChange(
      totalBalance,
      lastMonthBalance,
    );

    // 3. Tổng income, expense tháng này
    const monthlySummaryRows = await getMonthlySummaryRows(
      userId,
      currentMonth,
      currentYear,
    );
    const monthlyIncome = toNumber(monthlySummaryRows[0]?.monthly_income);
    const monthlyExpense = toNumber(monthlySummaryRows[0]?.monthly_expense);
    const transactionsCount = toNumber(
      monthlySummaryRows[0]?.transactions_count,
    );
    const savings = monthlyIncome - monthlyExpense;

    // 4. Tổng Income, Expense, % change của tháng trước
    const lastMonthSummaryRows = await getMonthlySummaryRows(
      userId,
      previousMonth,
      previousYear,
    );

    const lastMonthIncome = toNumber(lastMonthSummaryRows[0]?.monthly_income);
    const lastMonthExpense = toNumber(lastMonthSummaryRows[0]?.monthly_expense);
    const lastMonthSavings = lastMonthIncome - lastMonthExpense;

    const percentChangeIncome = calcPercentChange(
      monthlyIncome,
      lastMonthIncome,
    );

    const percentChangeExpense = calcPercentChange(
      monthlyExpense,
      lastMonthExpense,
    );

    const percentChangeSavings = calcPercentChange(savings, lastMonthSavings);

    // 5. Danh mục chi tiêu nhiều nhất tháng
    const topCategoryRows = await getTopCategoryRows(
      userId,
      currentMonth,
      currentYear,
    );

    const topCategory =
      topCategoryRows.length > 0 ? topCategoryRows[0].name : "No data";
    const topCategoryTransactions =
      topCategoryRows.length > 0
        ? toNumber(topCategoryRows[0].transaction_count_top)
        : 0;

    // 6. Budget Used tháng
    const budgetUsedPercentRows = await getBudgetUsedPercentRows(
      userId,
      currentMonth,
      currentYear,
    );
    const budgetUsedPercent = toNumber(
      budgetUsedPercentRows[0]?.budgetUsedPercent,
    );

    // 7. Budget Used tháng trước
    const lastMonthBudgetUsedRows = await getBudgetUsedPercentRows(
      userId,
      previousMonth,
      previousYear,
    );

    const lastMonthBudgetUsed = toNumber(
      lastMonthBudgetUsedRows[0]?.budgetUsedPercent,
    );

    const budgetUsedGrowthPercent = calcBudgetGrowthPercent(
      budgetUsedPercent,
      lastMonthBudgetUsed,
    );

    // 8. Budget Progress tháng
    const budgetProgress = await getBudgetProgress(
      userId,
      currentMonth,
      currentYear,
    );

    // 9. Expense Breakdown
    const expenseRows = await getExpenseRows(userId, currentMonth, currentYear);

    const totalExpenseThisMonth = expenseRows.reduce((sum, item) => {
      return sum + toNumber(item.total_spent);
    }, 0);

    const expenseBreakdown = expenseRows.map((row) => {
      return {
        name: row.name,
        value:
          totalExpenseThisMonth > 0
            ? Math.round(
                (toNumber(row.total_spent) / totalExpenseThisMonth) * 100,
              )
            : 0,
      };
    });

    // 10. Recent Transactions
    const recentRows = await getRecentRows(userId);

    const recentTransactions = recentRows.map((row) => {
      return {
        id: row.id,
        title: row.title,
        category: row.category,
        amount:
          row.type === "expense" ? -toNumber(row.amount) : toNumber(row.amount),
        date: row.transaction_date,
        icon: row.icon || "fa-solid fa-wallet",
        iconBg: row.bg_color || "bg-gray-100",
        iconColor: row.color || "text-gray-600",
        type: row.type,
      };
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalBalance,
          monthlyIncome,
          monthlyExpense,
          savings,
          budgetUsedPercent,
          topCategoryTransactions,
          topCategory,
        },
        cashFlow,
        budgetProgress,
        expenseBreakdown,
        recentTransactions,

        dataLastMonth: {
          percentChangeBalance,
          percentChangeIncome,
          percentChangeExpense,
          percentChangeSavings,
          budgetUsedGrowthPercent,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary",
      error: error.message,
    });
  }
};
module.exports = {
  getDashboardData,
};
