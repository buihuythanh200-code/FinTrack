import Header from "../../components/Header.jsx";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PIE_COLORS = [
  "#0da45d",
  "#f59e0b",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

function Transactions() {
  // Đổi từ useState(MOCK_TRANSACTIONS) thành mảng rỗng
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States cho Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterWallet, setFilterWallet] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // GỌI API LẤY DỮ LIỆU KHI VÀO TRANG
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Lấy token từ kho lưu trữ
        const token = localStorage.getItem("token");
        // Kiểm tra nếu không có token thì báo lỗi luôn, khỏi gọi API tốn công
        if (!token) {
          console.error("Không tìm thấy Token! Vui lòng đăng nhập lại.");
          return;
        }
        const response = await axios.get(
          "http://localhost:5000/api/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data.success) {
          // Ép kiểu amount thành số (phòng trường hợp MySQL trả về chuỗi Decimal)
          const formattedData = response.data.data.map((item) => ({
            ...item,
            amount: Number(item.amount),
          }));
          setTransactions(formattedData);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu giao dịch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // 1. Logic Lọc dữ liệu
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Các logic lọc cũ giữ nguyên
      const matchSearch =
        tx.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === "all" || tx.type === filterType;
      const matchWallet = filterWallet === "all" || tx.wallet === filterWallet;

      // 2. Logic lọc thời gian mới: So sánh chuỗi YYYY-MM-DD
      const txDateOnly = tx.date.split("T")[0]; // Lấy phần "2026-03-01" từ "2026-03-01T07:30"

      // Nếu không chọn ngày thì mặc định là đúng (true)
      const matchStartDate = startDate ? txDateOnly >= startDate : true;
      const matchEndDate = endDate ? txDateOnly <= endDate : true;

      return (
        matchSearch &&
        matchType &&
        matchWallet &&
        matchStartDate &&
        matchEndDate
      );
    });
  }, [transactions, searchTerm, filterType, filterWallet, startDate, endDate]);

  // 2. Logic Tính toán 3 thẻ Thống kê (Giữ nguyên logic Dashboard)
  const totalIncome = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((acc, curr) => acc + curr.amount, 0),
    [filteredTransactions],
  );

  const totalExpense = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((acc, curr) => acc + curr.amount, 0),
    [filteredTransactions],
  );

  const netFlow = totalIncome - totalExpense;

  // 3. Logic Biểu đồ Tròn
  const pieChartData = useMemo(() => {
    const expenses = filteredTransactions.filter((t) => t.type === "expense");
    const grouped = expenses.reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);
    return grouped.sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // 4. Logic Biểu đồ Cột
  const barChartData = useMemo(() => {
    const grouped = filteredTransactions.reduce((acc, curr) => {
      const dateStr = formatDate(curr.date).substring(0, 5);
      const existing = acc.find((item) => item.date === dateStr);

      if (existing) {
        if (curr.type === "income") existing.income += curr.amount;
        else existing.expense += curr.amount;
      } else {
        acc.push({
          date: dateStr,
          income: curr.type === "income" ? curr.amount : 0,
          expense: curr.type === "expense" ? curr.amount : 0,
        });
      }
      return acc;
    }, []);
    return grouped.slice(-7);
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans text-gray-800 flex flex-col">
      <Header />

      <main className="max-w-[1600px] w-full mx-auto px-4 py-4 sm:px-6 lg:px-8 flex gap-6 mt-2">
        {/* ================= CỘT 1: FILTERS (CAO 85VH) ================= */}
        <aside className="w-[300px] h-[85vh] shrink-0 flex flex-col">
          <div className="w-full h-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
            <h2 className="text-[1.6rem] font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <i className="fa-solid fa-sliders text-[#0da45d]"></i> Filters
            </h2>

            <div className="mb-6">
              <label className="block text-[1.2rem] font-semibold text-gray-700 mb-2">
                Time Range
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#0da45d] text-gray-600"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#0da45d] text-gray-600"
                />
              </div>
            </div>

            <hr className="my-5 border-gray-100" />

            <div className="mb-6 relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#0da45d]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[1.2rem] font-semibold text-gray-700 mb-2">
                Type
              </label>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {["all", "income", "expense"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`flex-1 text-sm font-medium py-1.5 rounded-lg capitalize transition ${filterType === type ? "bg-white shadow-sm text-[#0da45d]" : "text-gray-500"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[1.2rem] font-semibold text-gray-700 mb-2">
                Wallet
              </label>
              <select
                value={filterWallet}
                onChange={(e) => setFilterWallet(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0da45d] cursor-pointer"
              >
                <option value="all">All Wallets</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="MB Bank">MB Bank</option>
                <option value="MoMo">MoMo</option>
              </select>
            </div>
          </div>
        </aside>

        {/* ================= CỘT 2: SUMMARY & TABLE (CAO 85VH) ================= */}
        <section className="flex-1 h-[85vh] flex flex-col gap-6">
          {/* 3 Thẻ Summary (Giữ nguyên từ Dashboard) */}
          <div className="grid grid-cols-3 gap-6 shrink-0">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-[1.4rem] font-medium mb-1">
                  Total Income
                </p>
                <h3 className="text-2xl font-bold text-green-600">
                  +{formatCurrency(totalIncome)}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-xl">
                <i className="fa-solid fa-arrow-trend-up"></i>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-[1.4rem] font-medium mb-1">
                  Total Expense
                </p>
                <h3 className="text-2xl font-bold text-red-500">
                  -{formatCurrency(totalExpense)}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl">
                <i className="fa-solid fa-arrow-trend-down"></i>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-[1.4rem] font-medium mb-1">
                  Net Cash Flow
                </p>
                <h3
                  className={`text-2xl font-bold ${netFlow >= 0 ? "text-gray-800" : "text-red-500"}`}
                >
                  {netFlow > 0 ? "+" : ""}
                  {formatCurrency(netFlow)}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xl">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
            </div>
          </div>

          {/* Data Table (Tự cuộn bên trong phần diện tích còn lại) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse relative">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr className="text-gray-500 text-[1.4rem] border-b border-gray-100">
                    <th className="py-4 px-6 font-semibold w-[20%]">Date</th>
                    <th className="py-4 px-6 font-semibold w-[40%]">
                      Note & Category
                    </th>
                    <th className="py-4 px-6 font-semibold w-[20%]">Account</th>
                    <th className="py-4 px-6 font-semibold w-[20%] text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 transition group"
                    >
                      <td className="py-4 px-6 text-gray-500 text-[1.2rem]">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 text-[1.2rem]">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === "income" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-500"}`}
                          >
                            <i className={tx.categoryIcon}></i>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 line-clamp-1">
                              {tx.note}
                            </p>
                            <p className="text-[1rem] text-gray-400">
                              {tx.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-600 text-[1.2rem]">
                        {tx.wallet}
                      </td>
                      <td
                        className={`py-4 px-6 font-bold text-right text-[1.2rem] ${tx.type === "income" ? "text-green-600" : "text-gray-800"}`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination chân bảng */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 shrink-0 text-[1.2rem] text-gray-500">
              <span>Showing {filteredTransactions.length} entries</span>
              <div className="flex gap-1">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white"
                  disabled
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0da45d] text-white font-medium shadow-sm">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CỘT 3: CHARTS (CAO 85VH) ================= */}
        <aside className="w-[350px] h-[85vh] shrink-0 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 shrink-0">
            <h3 className="font-semibold text-gray-800 mb-4 text-[1.4rem]">
              Cơ cấu chi tiêu
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {pieChartData.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-[1rem]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                      }}
                    ></span>
                    <span className="text-gray-600 truncate max-w-[100px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
            <h3 className="font-semibold text-gray-800 mb-4 text-[1.4rem]">
              Phân tích Dòng tiền
            </h3>
            <div className="flex-1 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                  />
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "10px" }}
                  />
                  <Bar
                    dataKey="income"
                    name="Thu nhập"
                    fill="#0da45d"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Chi tiêu"
                    fill="#f87171"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Transactions;
