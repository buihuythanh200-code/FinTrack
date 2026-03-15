import Header from "../../components/Header.jsx";
import CashFlowChart from "../../components/CashFlowChart.jsx";
import StatCard from "../../components/Cards/StatCard.jsx";
import BudgetProgressCard from "../../components/Cards/BudgetProgressCard.jsx";
import ExpenseBreakdownCard from "../../components/Cards/ExpenseBreakdownCard.jsx";
import OverviewMiniCard from "../../components/Cards/OverviewMiniCard.jsx";
import TransactionList from "../../components/Transactions/TransactionList.jsx";
import HeroCard from "../../components/Cards/HeroCard.jsx";
import {
  formatCurrency,
  parseLocalDate,
  formatDateInput,
  formatMonthInput,
  formatTransactionDate,
  parseDateInput,
} from "../../utils/format.js";
import { useState, useRef, useMemo, useEffect } from "react";
import { Wallet, PieChart, ShoppingBag } from "lucide-react";

function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dateRef = useRef(null);
  const calendarRef = useRef(null);

  const chartData = dashboardData?.cashFlow || [];

  // --- Logic Helpers (Giữ nguyên của bạn) ---
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
  };
  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  };

  const formatDateForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  const { startYear, endYear } = useMemo(() => {
    const start = selectedYear - (selectedYear % 10);
    return { startYear: start, endYear: start + 9 };
  }, [selectedYear]);

  const years = Array.from({ length: 10 }, (_, i) => startYear + i);
  const today = useMemo(() => new Date(), []);

  const getTimeLabel = () => {
    if (timeFilter === "week") {
      const start = getStartOfWeek(today);
      const end = getEndOfWeek(today);
      if (selectedDate >= start && selectedDate <= end) return "This Week";
      return `${formatDate(getStartOfWeek(selectedDate))} - ${formatDate(getEndOfWeek(selectedDate))}`;
    }
    if (timeFilter === "month") {
      const [year, month] = selectedMonth.split("-");
      if (
        Number(year) === today.getFullYear() &&
        Number(month) === today.getMonth() + 1
      )
        return "This Month";
      return `${month} / ${year}`;
    }
    if (timeFilter === "year") {
      if (selectedYear === today.getFullYear()) return "This Year";
      return selectedYear;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target))
        setShowCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        let queryString = "";

        if (timeFilter === "week") {
          const startDate = formatDateForApi(getStartOfWeek(selectedDate));
          const endDate = formatDateForApi(getEndOfWeek(selectedDate));

          queryString = `filter=week&startDate=${startDate}&endDate=${endDate}`;
        }

        if (timeFilter === "month") {
          const [year, month] = selectedMonth.split("-");
          queryString = `filter=month&month=${month}&year=${year}`;
        }

        if (timeFilter === "year") {
          queryString = `filter=year&year=${selectedYear}`;
        }

        const response = await fetch(
          `http://localhost:5000/api/dashboard?${queryString}`,
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load dashboard data.");
        }

        await new Promise((resolve) => setTimeout(resolve, 800));

        if (result.success) {
          setDashboardData({
            summary: {
              totalBalance: result.data.summary.totalBalance,
              monthlyIncome: result.data.summary.monthlyIncome,
              monthlyExpense: result.data.summary.monthlyExpense,
              savings: result.data.summary.savings,
              budgetUsedPercent: result.data.summary.budgetUsedPercent,
              topCategoryTransactions:
                result.data.summary.topCategoryTransactions,
              topCategory: result.data.summary.topCategory,
            },
            cashFlow: result.data.cashFlow,
            budgetProgress: result.data.budgetProgress.map((item) => {
              return {
                id: item.id,
                category: item.name,
                spent: Number(item.spent),
                limit: Number(item.limit_amount),
                color: item.bg_color,
              };
            }),
            expenseBreakdown: result.data.expenseBreakdown,
            recentTransactions: result.data.recentTransactions,

            dataLastMonth: {
              percentBalance: result.data.dataLastMonth.percentChangeBalance,
              percentIncome: result.data.dataLastMonth.percentChangeIncome,
              percentExpense: result.data.dataLastMonth.percentChangeExpense,
              percentSavings: result.data.dataLastMonth.percentChangeSavings,
              percentBudget: result.data.dataLastMonth.budgetUsedGrowthPercent,
            },
          });
        }
      } catch (err) {
        console.error("Fetch dashboard error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeFilter, selectedDate, selectedMonth, selectedYear]);
  const percentBalance = dashboardData?.dataLastMonth?.percentBalance ?? 0;
  const percentIncome = dashboardData?.dataLastMonth?.percentIncome ?? 0;
  const percentExpense = dashboardData?.dataLastMonth?.percentExpense ?? 0;
  const percentSavings = dashboardData?.dataLastMonth?.percentSavings ?? 0;
  const percentBudget = dashboardData?.dataLastMonth?.percentBudget ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-52 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 h-40 bg-gray-200 rounded-2xl"></div>
              <div className="lg:col-span-3 h-40 bg-gray-200 rounded-2xl"></div>
              <div className="lg:col-span-3 h-40 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
              <div className="lg:col-span-1 h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
        <div className="mt-[2rem]">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Track your balance, transactions, and spending performance.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-[1rem]">
        {/* 1. Hero Card */}
        <HeroCard
          title="Total Balance"
          amount={formatCurrency(dashboardData.summary.totalBalance)}
          trend={
            percentBalance > 0 ? `+${percentBalance}%` : `${percentBalance}%`
          }
          iconColor={percentBalance > 0 ? "text-[#009360]" : "text-red-500"}
          icon={
            percentBalance > 0
              ? "fa-solid fa-arrow-trend-up"
              : "fa-solid fa-arrow-trend-down"
          }
        />

        {/* 2 & 3. Stats Cards */}
        <StatCard
          title="Monthly Income"
          amount={dashboardData.summary.monthlyIncome}
          trend={percentIncome > 0 ? `+${percentIncome}%` : `${percentIncome}%`}
          icon={
            percentIncome > 0
              ? `fa-solid fa-arrow-up`
              : `fa-solid fa-arrow-down`
          }
          trendColor={
            percentIncome > 0
              ? `bg-[#009360]/10 text-[#009360]`
              : `bg-red-50 text-red-600`
          }
          iconBg={percentIncome > 0 ? `bg-[#009360]/10` : `bg-red-50`}
          iconColor={percentIncome > 0 ? `text-[#009360]` : `text-red-500`}
        />
        <StatCard
          title="Monthly Expense"
          amount={dashboardData.summary.monthlyExpense}
          trend={
            percentExpense > 0 ? `+${percentExpense}%` : `${percentExpense}%`
          }
          icon={
            percentExpense > 0
              ? `fa-solid fa-arrow-up`
              : `fa-solid fa-arrow-down`
          }
          trendColor={
            percentExpense <= 0
              ? `bg-[#009360]/10 text-[#009360]`
              : `bg-red-50 text-red-600`
          }
          iconBg={percentExpense <= 0 ? `bg-[#009360]/10` : `bg-red-50`}
          iconColor={percentExpense <= 0 ? `text-[#009360]` : `text-red-500`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <OverviewMiniCard
          title="Savings"
          value={formatCurrency(dashboardData.summary.savings)}
          subtitle="So với tháng trước"
          icon={Wallet}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={percentSavings >= 0 ? "up" : "down"}
          trendValue={`${percentSavings}%`}
        />
        <OverviewMiniCard
          title="Budget Used"
          value={`${dashboardData.summary.budgetUsedPercent}%`}
          subtitle="Trên tất cả các ngân sách"
          icon={PieChart}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          trend={percentBudget < 0 ? "down" : "up"}
          trendValue={`${Math.abs(percentBudget)}%`}
        />
        <OverviewMiniCard
          title="Top Spending"
          value={dashboardData.summary.topCategory}
          subtitle={`${dashboardData.summary.topCategoryTransactions} giao dịch`}
          icon={ShoppingBag}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Cash Flow Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2 relative">
            <h3 className="text-xl font-semibold text-gray-800 tracking-wide">
              Cash Flow
            </h3>
            <div
              className="font-semibold text-gray-700 w-[25rem] p-[1rem] bg-[#F1F3F5] text-center border border-white rounded-[1rem] hover:border-[#009360] cursor-pointer transition-all duration-[400ms] ease-in-out"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {getTimeLabel()}
            </div>

            {showCalendar && (
              <div
                className="absolute right-0 top-[110%] w-[30rem] bg-white border border-gray-200 shadow-lg rounded-xl z-20 p-4 transition-all duration-300"
                ref={calendarRef}
              >
                <div className="h-[100%] flex justify-center gap-6 items-center">
                  {["week", "month", "year"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTimeFilter(type)}
                      className={`text-sm font-semibold capitalize cursor-pointer px-5 py-2 flex items-center justify-center rounded-lg transition-all duration-300 ${
                        timeFilter === type
                          ? "bg-[#009360] text-white shadow"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {timeFilter === "week" && (
                    <div className="relative w-full">
                      <input
                        ref={dateRef}
                        type="date"
                        className="absolute opacity-0 pointer-events-none bottom-[0]"
                        value={formatDateInput(selectedDate)}
                        onChange={(e) =>
                          setSelectedDate(parseDateInput(e.target.value))
                        }
                      />
                      <input
                        readOnly
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-[#009360]"
                        value={`${formatDate(getStartOfWeek(selectedDate))} - ${formatDate(getEndOfWeek(selectedDate))}`}
                        onClick={() => dateRef.current.showPicker()}
                      />
                    </div>
                  )}
                  {timeFilter === "month" && (
                    <input
                      type="month"
                      className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#009360]"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                  )}
                  {timeFilter === "year" && (
                    <div className="border border-gray-200 rounded-xl p-4 w-[100%] bg-white shadow-sm">
                      <div className="flex justify-between items-center font-semibold mb-3 text-gray-700">
                        <div
                          className="cursor-pointer hover:text-[#009360]"
                          onClick={() => setSelectedYear((prev) => prev - 10)}
                        >
                          <i className="fa-solid fa-chevron-left"></i>
                        </div>
                        {startYear} - {endYear}
                        <div
                          className="cursor-pointer hover:text-[#009360]"
                          onClick={() => setSelectedYear((prev) => prev + 10)}
                        >
                          <i className="fa-solid fa-chevron-right"></i>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {years.map((year) => (
                          <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`py-1 rounded cursor-pointer ${selectedYear === year ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <CashFlowChart data={chartData} />
        </div>

        {/* Recent Transactions Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[1.8rem] font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <a
              href="/transactions"
              className="text-xl text-[#009360] hover:text-[#007a50] font-semibold transition-colors"
            >
              View All
            </a>
          </div>

          <TransactionList transactions={dashboardData.recentTransactions} />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <BudgetProgressCard
            budgets={dashboardData.budgetProgress}
            formatCurrency={formatCurrency}
          />

          <ExpenseBreakdownCard data={dashboardData.expenseBreakdown} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
