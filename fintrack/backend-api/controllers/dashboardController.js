const db = require("../db");

const getDashboardData = async (req, res) => {
  try {
    const userId = 1;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // 1. Summary
    const [summaryRows] = await db.query(
      `
                SELECT
                    COALESCE(SUM(CASE WHEN type = "income" THEN amount ELSE 0 END),0) AS total_income,
                    COALESCE(SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END), 0) AS total_expense
                FROM transactions t
                JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = ?
            `,
      [userId],
    );

    const totalIncome = Number(summaryRows[0].total_income ?? 0);
    const totalExpense = Number(summaryRows[0].total_expense ?? 0);
    const totalBalance = totalIncome - totalExpense;

    // 2. Total balance tháng trước
    const [lastMonthBalanceRows] = await db.query(
      `
        SELECT  
          COALESCE(SUM(CASE
                          WHEN c.type = 'income' THEN t.amount
                          ELSE -t.amount
                        END),0) AS amount
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
        AND transaction_date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
      `,
      [userId],
    );
    const lastMonthBalance = Number(lastMonthBalanceRows[0]?.amount ?? 0);
    const percentChangeBalance =
      lastMonthBalance !== 0
        ? +(
            ((totalBalance - lastMonthBalance) / lastMonthBalance) *
            100
          ).toFixed(2)
        : 0;

    // 3. Tổng income, expense tháng này
    const [monthlySummaryRows] = await db.query(
      `
                SELECT
                    COALESCE(SUM (CASE WHEN type = "income" THEN amount ELSE 0 END), 0) AS monthly_income,
                    COALESCE(SUM (CASE WHEN type = "expense" THEN amount ELSE 0 END), 0) AS monthly_expense,
                    COUNT(t.id) AS transactions_count
                FROM transactions t
                JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = ?
                    AND MONTH(t.transaction_date) = ?
                    AND YEAR(t.transaction_date) = ?
            `,
      [userId, currentMonth, currentYear],
    );

    const monthlyIncome = Number(monthlySummaryRows[0].monthly_income || 0);
    const monthlyExpense = Number(monthlySummaryRows[0].monthly_expense || 0);
    const transactionsCount = Number(
      monthlySummaryRows[0].transactions_count || 0,
    ); // Tổng số giao dịch
    const savings = monthlyIncome - monthlyExpense; // Tiết kiệm

    // 4. Tổng Income, Expense, % change của tháng trước
    const [lastMonthSummaryRows] = await db.query(
      `
        SELECT
            COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) AS last_month_income,
            COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) AS last_month_expense,
            COUNT(t.id) AS transactions_count
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND MONTH(t.transaction_date) = MONTH(CURDATE() - INTERVAL 1 MONTH)
          AND YEAR(t.transaction_date) = YEAR(CURDATE() - INTERVAL 1 MONTH)
      `,
      [userId],
    );

    const lastMonthIncome = Number(
      lastMonthSummaryRows[0]?.last_month_income ?? 0,
    );
    const lastMonthExpense = Number(
      lastMonthSummaryRows[0]?.last_month_expense ?? 0,
    );

    const percentChangeIncome =
      lastMonthIncome !== 0
        ? +(
            ((monthlyIncome - lastMonthIncome) / lastMonthIncome) *
            100
          ).toFixed(2)
        : 0;
    const percentChangeExpense =
      lastMonthExpense !== 0
        ? +(
            ((monthlyExpense - lastMonthExpense) / lastMonthExpense) *
            100
          ).toFixed(2)
        : 0;
    //Danh mục chi tiêu nhiều nhất tháng
    const [topCategoryRows] = await db.query(
      `
                SELECT c.name, SUM(t.amount) AS total_spent, COUNT(t.id) AS transaction_count_top
                FROM transactions t
                JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = ?
                    AND MONTH(t.transaction_date) = ?
                    AND YEAR(t.transaction_date) = ?
                    AND c.type = 'expense'
                GROUP BY c.id, c.name
                ORDER BY total_spent DESC
                LIMIT 1
            `,
      [userId, currentMonth, currentYear],
    );

    // Tên danh mục chi nhiều nhất tháng
    const topCategory =
      topCategoryRows.length > 0 ? topCategoryRows[0].name : "No data";
    const topCategoryTransactions =
      topCategoryRows.length > 0 ? topCategoryRows[0].transaction_count_top : 0;

    //Budget Used tháng
    const [budgetUsedPercentRows] = await db.query(
      `
    SELECT 
      ROUND(
        COALESCE(SUM(t.amount), 0) * 100 / NULLIF(SUM(b.limit_amount), 0),
        0
      ) AS budgetUsedPercent
    FROM budgets b
    JOIN categories c ON c.id = b.category_id
    LEFT JOIN transactions t
      ON c.id = t.category_id
      AND t.user_id = ?
      AND MONTH(t.transaction_date) = ?
      AND YEAR(t.transaction_date) = ?
    WHERE c.type = 'expense'
      AND b.user_id = ?
  `,
      [userId, currentMonth, currentYear, userId],
    );
    const budgetUsedPercent = budgetUsedPercentRows[0]?.budgetUsedPercent ?? 0;

    // Budget Progress tháng
    const [budgetProgress] = await db.query(
      `
            SELECT 
                c.id, 
                c.name, 
                COALESCE(SUM(t.amount), 0) AS spent, 
                b.limit_amount, 
                c.bg_color, 
                CASE
                    WHEN b.limit_amount > 0
                    THEN ROUND((COALESCE(SUM(t.amount), 0) / b.limit_amount) * 100, 0)
                    ELSE 0
                END AS budget_used_percent 

            FROM categories c
            JOIN budgets b ON c.id = b.category_id
            LEFT JOIN transactions t
                ON c.id = t.category_id
                AND t.user_id = ? 
                AND MONTH(t.transaction_date) = ?
                AND YEAR(t.transaction_date) = ?
            WHERE c.type = 'expense'
            GROUP BY c.id, c.name, b.limit_amount, c.bg_color
            ORDER BY budget_used_percent DESC
        `,
      [userId, currentMonth, currentYear],
    );

    // 6. Expense Breakdown
    const [expenseRows] = await db.query(
      `
      SELECT
        c.name,
        SUM(t.amount) AS total_spent
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
        AND c.type = 'expense'
        AND MONTH(t.transaction_date) = ?
        AND YEAR(t.transaction_date) = ?
      GROUP BY c.id, c.name
      ORDER BY total_spent DESC
      LIMIT 5
      `,
      [userId, currentMonth, currentYear],
    );

    const totalExpenseThisMonth = expenseRows.reduce((sum, item) => {
      return sum + Number(item.total_spent);
    }, 0);

    const expenseBreakdown = expenseRows.map((row) => {
      return {
        name: row.name,
        value:
          totalExpenseThisMonth > 0
            ? Math.round(
                (Number(row.total_spent) / totalExpenseThisMonth) * 100,
              )
            : 0,
      };
    });

    // 7 Recent Transactions

    const [recentRows] = await db.query(
      `
        SELECT t.id, COALESCE(t.description, c.name) AS title, c.name AS category, t.amount,t.transaction_date, t.created_at, c.icon,c.bg_color ,c.color, c.type
        FROM categories c
        JOIN transactions t ON t.category_id = c.id
        WHERE t.user_id = ?
        ORDER BY t.transaction_date DESC, t.created_at DESC
        LIMIT 5
        `,
      [userId],
    );

    const recentTransactions = recentRows.map((row) => {
      return {
        id: row.id,
        title: row.title,
        category: row.category,
        amount:
          row.type === "expense" ? -Number(row.amount) : Number(row.amount),
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

        budgetProgress,
        expenseBreakdown,
        recentTransactions,

        dataLastMonth: {
          percentChangeBalance,
          percentChangeIncome,
          percentChangeExpense,
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
