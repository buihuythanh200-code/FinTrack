const db = require("../db");
// 1. Summary
const getSummaryRows = async (userId) => {
  const [summaryRows] = await db.query(
    `
                SELECT
                    COALESCE(SUM(CASE WHEN c.type = "income" THEN t.amount ELSE 0 END),0) AS total_income,
                    COALESCE(SUM(CASE WHEN c.type = "expense" THEN t.amount ELSE 0 END), 0) AS total_expense
                FROM transactions t
                JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = ?
            `,
    [userId],
  );

  return summaryRows;
};

// 2. Total balance tháng trước
const getLastMonthBalanceRows = async (userId) => {
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

  return lastMonthBalanceRows;
};

// 3. Tổng income, expense tháng này / tháng bất kỳ
const getMonthlySummaryRows = async (userId, currentMonth, currentYear) => {
  const [monthlySummaryRows] = await db.query(
    `
                SELECT
                    COALESCE(SUM (CASE WHEN c.type = "income" THEN t.amount ELSE 0 END), 0) AS monthly_income,
                    COALESCE(SUM (CASE WHEN c.type = "expense" THEN t.amount ELSE 0 END), 0) AS monthly_expense,
                    COUNT(t.id) AS transactions_count
                FROM transactions t
                JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = ?
                    AND MONTH(t.transaction_date) = ?
                    AND YEAR(t.transaction_date) = ?
            `,
    [userId, currentMonth, currentYear],
  );

  return monthlySummaryRows;
};

// 4. Danh mục chi tiêu nhiều nhất tháng
const getTopCategoryRows = async (userId, currentMonth, currentYear) => {
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

  return topCategoryRows;
};

// 5. Budget Used tháng / tháng bất kỳ
const getBudgetUsedPercentRows = async (userId, currentMonth, currentYear) => {
  const [budgetUsedPercentRows] = await db.query(
    `
    SELECT 
      ROUND(
        COALESCE(SUM(x.spent), 0) * 100 / NULLIF(SUM(x.limit_amount), 0),
        0
      ) AS budgetUsedPercent
    FROM (
      SELECT
        b.category_id,
        b.limit_amount,
        COALESCE(SUM(t.amount), 0) AS spent
      FROM budgets b
      JOIN categories c ON c.id = b.category_id
      LEFT JOIN transactions t
        ON t.category_id = b.category_id
        AND t.user_id = ?
        AND MONTH(t.transaction_date) = ?
        AND YEAR(t.transaction_date) = ?
      WHERE b.user_id = ?
        AND c.type = 'expense'
      GROUP BY b.category_id, b.limit_amount
    ) x
  `,
    [userId, currentMonth, currentYear, userId],
  );

  return budgetUsedPercentRows;
};

// 6. Budget Progress tháng / tháng bất kỳ
const getBudgetProgress = async (userId, currentMonth, currentYear) => {
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
            WHERE c.type = 'expense' AND b.user_id = ?
            GROUP BY c.id, c.name, b.limit_amount, c.bg_color
            ORDER BY budget_used_percent DESC
        `,
    [userId, currentMonth, currentYear, userId],
  );

  return budgetProgress;
};

// 7. Expense Breakdown
const getExpenseRows = async (userId, currentMonth, currentYear) => {
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

  return expenseRows;
};

// 8. Recent Transactions
const getRecentRows = async (userId) => {
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

  return recentRows;
};

//9. Cash Flow Week
const getCashFlowByWeeksRows = async (userId, startDate, endDate) => {
  const [rows] = await db.query(
    `
      SELECT 
        DATE(t.transaction_date) AS date,
        COALESCE(SUM(CASE WHEN c.type = "income" THEN t.amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN c.type = "expense" THEN t.amount ELSE 0 END), 0) AS expense
      FROM transactions t
      JOIN categories c ON c.id = t.category_id
      WHERE t.user_id=? AND DATE(t.transaction_date) BETWEEN ? AND ?
      GROUP BY DATE(t.transaction_date)
      ORDER BY DATE(t.transaction_date)
    `,
    [userId, startDate, endDate],
  );
  return rows;
};

//10. Cash Flow Month
const getCashFlowByMonthRows = async (userId, month, year) => {
  const [rows] = await db.query(
    `
      SELECT 
        CASE 
          WHEN DAY(t.transaction_date) BETWEEN 1 AND 7 THEN 'week 1'
          WHEN DAY(t.transaction_date) BETWEEN 8 AND 14 THEN 'week 2'
          WHEN DAY(t.transaction_date) BETWEEN 15 AND 21 THEN 'week 3'
          ELSE 'Week 5'
        END AS week_name,
        CASE
          WHEN DAY(t.transaction_date) BETWEEN 1 AND 7 THEN 1
          WHEN DAY(t.transaction_date) BETWEEN 8 AND 14 THEN 
          WHEN DAY(t.transaction_date) BETWEEN 15 AND 21 THEN 3
          ELSE 4
        END AS week_order
        COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) AS expense,
      FROM transactions t
      JOIN categories c ON c.id = t.category_id
      WHERE t.user_id = ?
        AND MONTH(t.transaction_date)=?
        AND YEAR(t.transaction_date)=?
      GROUP BY week_name, week_order
      ORDER BY week_order  
    `,
    [userId, month, year],
  );

  return rows;
};

const getCashFlowByYearRows = async (userId, month, year) => {
  const [rows] = await db.query(
    `
      SELECT
        MONTH(t.transaction_date) AS month_number,
        COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) AS expense,
      FROM transactions t
      JOIN categories c ON c.id = t.category_id
      WHERE t.user_id = ?
          AND YEAR(t.transaction_date) = ?
      GROUP BY MONTH(t.transaction_date)
      ORDER BY month_number
    `,
    [userId, year],
  );

  return rows;
};

module.exports = {
  getSummaryRows,
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
};
