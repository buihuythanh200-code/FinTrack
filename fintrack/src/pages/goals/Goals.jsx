import React, { useState, useMemo, useEffect } from "react";
import Header from "../../components/Header.jsx";
import confetti from "canvas-confetti";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import axios from "axios";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function Goals() {
  const [goals, setGoals] = useState([]);
  const [originalGoals, setOriginalGoals] = useState([]); // Dùng để lưu dữ liệu thật phục vụ nút Reset
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [monthlyAddition, setMonthlyAddition] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [openLayout, setOpenLayout] = useState(false);
  const handleClickOpen = () => {
    setOpenLayout(true);
  };
  const handleClose = () => {
    setOpenLayout(false);
  };

  // Kéo dữ liệu từ Backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Lưu ý đường dẫn API của bạn ở đây (api/goal hoặc api/goals)
        const response = await axios.get("http://localhost:5000/api/goal", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const formattedData = response.data.data.map((g) => ({
            ...g,
            target_amount: Number(g.target_amount),
            current_amount: Number(g.current_amount),
          }));

          setGoals(formattedData);
          setOriginalGoals(formattedData); // Lưu lại bản gốc

          if (formattedData.length > 0) {
            setSelectedGoalId(formattedData[0].id);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải mục tiêu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const totalBalance = useMemo(
    () => goals.reduce((acc, curr) => acc + curr.current_amount, 0),
    [goals],
  );

  const activeGoal = useMemo(
    () => goals.find((g) => g.id === selectedGoalId),
    [goals, selectedGoalId],
  );
  // Biến số thành chuỗi có dấu chấm: 1000000 -> "1.000.000"
  const formatInputNumber = (val) => {
    if (val === undefined || val === null || val === "") return "";
    // Chuyển về chuỗi, xóa mọi thứ không phải số, rồi thêm dấu chấm
    let str = val.toString().replace(/\D/g, "");
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Biến chuỗi có dấu chấm thành số thuần túy: "1.000.000" -> "1000000"
  const parseNumber = (val) => {
    return val.replace(/\./g, "");
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const projectedDate = useMemo(() => {
    if (
      !activeGoal ||
      !monthlyAddition ||
      isNaN(monthlyAddition) ||
      monthlyAddition <= 0
    )
      return null;

    const remaining = activeGoal.target_amount - activeGoal.current_amount;
    if (remaining <= 0) return "Ngay lập tức!";

    const monthsNeeded = Math.ceil(remaining / Number(monthlyAddition));
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + monthsNeeded);

    return futureDate.toLocaleDateString("vi-VN", {
      month: "2-digit",
      year: "numeric",
    });
  }, [activeGoal, monthlyAddition]);

  const handleReset = () => {
    setGoals(MOCK_GOALS); // Trả về dữ liệu gốc ban đầu
    setMonthlyAddition("");
  };

  const handleAddFunds = () => {
    if (!activeGoal || !monthlyAddition) return;

    const amountToAdd = Number(monthlyAddition);
    let isCompleted = false;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === activeGoal.id) {
          const newAmount = g.current_amount + amountToAdd;
          if (newAmount >= g.target_amount) isCompleted = true;
          return { ...g, current_amount: Math.min(newAmount, g.target_amount) };
        }
        return g;
      }),
    );

    setMonthlyAddition("");

    if (isCompleted) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <main className="max-w-[1500px] w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* ================= CỘT TRÁI (COL-SPAN-5) ================= */}
        <section className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          {/* Thẻ Tổng Số dư - Styled like a premium card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10">
              <p className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-[1.2rem]">
                Tổng tài sản tích lũy
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight">
                {formatCurrency(totalBalance)}
              </h2>
            </div>
            <>
              <Button variant="outlined" onClick={handleClickOpen}>
                Add Goal
              </Button>
              <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={openLayout}
              >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                  Modal title
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={(theme) => ({
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                  })}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                  <Typography gutterBottom>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo
                    odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                    risus, porta ac consectetur ac, vestibulum at eros.
                  </Typography>
                  <Typography gutterBottom>
                    Praesent commodo cursus magna, vel scelerisque nisl
                    consectetur et. Vivamus sagittis lacus vel augue laoreet
                    rutrum faucibus dolor auctor.
                  </Typography>
                  <Typography gutterBottom>
                    Aenean lacinia bibendum nulla sed consectetur. Praesent
                    commodo cursus magna, vel scelerisque nisl consectetur et.
                    Donec sed odio dui. Donec ullamcorper nulla non metus auctor
                    fringilla.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose}>
                    Save changes
                  </Button>
                </DialogActions>
              </BootstrapDialog>
            </>
          </div>

          {/* Biểu đồ & Danh sách (Gộp chung vào một block cho gọn) */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 flex flex-col overflow-hidden">
            {/* Header Biểu đồ */}
            <div className="p-6 border-b border-slate-50">
              <h3 className="text-[1.4rem] font-semibold text-slate-800">
                Cơ cấu mục tiêu
              </h3>
            </div>

            {/* Vùng Biểu đồ */}
            <div className="h-[220px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goals}
                    dataKey="current_amount"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={6}
                    stroke="none"
                  >
                    {goals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hex} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Danh sách Mục tiêu */}
            <div className="p-4 flex flex-col gap-2 bg-slate-50/50">
              {goals.map((goal) => {
                const percentage = Math.min(
                  (goal.current_amount / goal.target_amount) * 100,
                  100,
                );
                const isActive = goal.id === selectedGoalId;

                return (
                  <div
                    key={goal.id}
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      setMonthlyAddition("");
                    }}
                    className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                      isActive
                        ? `bg-white border-[${goal.hex}] shadow-md scale-[1.02]`
                        : "bg-transparent border-transparent hover:bg-white hover:shadow-sm"
                    }`}
                    style={{ borderColor: isActive ? goal.hex : "transparent" }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${goal.bg_color} ${goal.color}`}
                      >
                        <i className={`fa-solid ${goal.icon}`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 mb-1">
                          {goal.title}
                        </h4>
                        {/* Thanh Mini Progress */}
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-1">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${goal.gradient}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-[1.2rem] font-medium text-slate-500 flex justify-between">
                          <span>{formatCurrency(goal.current_amount)}</span>
                          <span className={goal.color}>
                            {percentage.toFixed(0)}%
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= CỘT PHẢI (COL-SPAN-7) ================= */}
        <section className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          {!activeGoal ? (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-bullseye text-4xl text-slate-300"></i>
              </div>
              <p className="text-lg font-medium">
                Chọn một mục tiêu để xem phân tích
              </p>
            </div>
          ) : (
            <>
              {/* Thẻ Chi tiết Mục tiêu (Hero Card) */}
              <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 relative overflow-hidden">
                {/* Background Decor */}
                <div
                  className={`absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-3xl ${activeGoal.bg_color}`}
                ></div>

                {/* Header Card */}
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner ${activeGoal.bg_color} ${activeGoal.color}`}
                    >
                      <i className={`fa-solid ${activeGoal.icon}`}></i>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800 mb-1">
                        {activeGoal.title}
                      </h2>
                      <p className="text-slate-500 font-medium flex items-center gap-2">
                        <i className="fa-regular fa-flag"></i> Đích đến:{" "}
                        <span className="text-slate-800 font-bold">
                          {formatCurrency(activeGoal.target_amount)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition">
                    <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
                  </button>
                </div>

                {/* Main Progress Area */}
                <div className="mb-10 relative z-10">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-[1.2rem] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Đã tích lũy
                      </p>
                      <p className="text-4xl font-black text-slate-900 tracking-tight">
                        {formatCurrency(activeGoal.current_amount)}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-xl text-lg font-bold bg-slate-50 border border-slate-100 ${activeGoal.color}`}
                    >
                      {Math.min(
                        (activeGoal.current_amount / activeGoal.target_amount) *
                          100,
                        100,
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                  {/* Big Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden shadow-inner p-1">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${activeGoal.gradient} transition-all duration-1000 ease-out relative`}
                      style={{
                        width: `${Math.min((activeGoal.current_amount / activeGoal.target_amount) * 100, 100)}%`,
                      }}
                    >
                      {/* Shimmer effect inside progress bar */}
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-20 w-full h-full rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <i className="fa-solid fa-coins"></i>
                      <span className="text-[1.2rem] font-semibold uppercase tracking-wider">
                        Cần thêm
                      </span>
                    </div>
                    <p className="font-extrabold text-2xl text-slate-700">
                      {formatCurrency(
                        Math.max(
                          activeGoal.target_amount - activeGoal.current_amount,
                          0,
                        ),
                      )}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <i className="fa-regular fa-calendar"></i>
                      <span className="text-[1.2rem] font-semibold uppercase tracking-wider">
                        Mục tiêu gốc
                      </span>
                    </div>
                    <p className="font-extrabold text-2xl text-slate-700">
                      {new Date(activeGoal.target_date).toLocaleDateString(
                        "vi-VN",
                        { month: "2-digit", year: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thẻ Công cụ Dự toán (Smart Calculator) - Modern Glassmorphism */}
              <div className="bg-slate-900 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                {/* Neon Glow Effects */}
                <div
                  className={`absolute -top-20 -left-20 w-64 h-64 opacity-20 blur-[80px] rounded-full transition-colors duration-700 ${activeGoal.bg_color.replace("bg-", "bg-").replace("100", "500")}`}
                ></div>
                <div
                  className={`absolute -bottom-20 -right-20 w-64 h-64 opacity-20 blur-[80px] rounded-full transition-colors duration-700 ${activeGoal.bg_color.replace("bg-", "bg-").replace("100", "500")}`}
                ></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5">
                      <i className="fa-solid fa-bolt text-yellow-400 text-lg"></i>
                    </div>
                    <h3 className="text-[1.8rem] font-bold text-white">
                      Chạm đích sớm hơn
                    </h3>
                  </div>
                  <p className="text-slate-400 text-[1.4rem] mb-8 font-medium">
                    Giả lập hành trình: Bạn định nạp thêm bao nhiêu mỗi tháng?
                  </p>

                  <div className="bg-white/5 p-6 sm:p-8 rounded-[1.5rem] border border-white/10 backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                          ₫
                        </span>
                        <input
                          type="text" // KHÔNG ĐƯỢC để là "number"
                          value={formatInputNumber(monthlyAddition)}
                          onChange={(e) => {
                            // 1. Lấy giá trị thô người dùng vừa gõ
                            const inputValue = e.target.value;
                            // 2. Loại bỏ dấu chấm để lấy số thuần túy
                            const rawNumber = parseNumber(inputValue);
                            // 3. Chỉ cập nhật nếu đó là số (để tránh người dùng gõ chữ)
                            if (!isNaN(rawNumber) || rawNumber === "") {
                              setMonthlyAddition(rawNumber);
                            }
                          }}
                          placeholder="Nhập số tiền..."
                          className="w-full bg-slate-950/50 text-white pl-10 pr-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-lg border border-white/5 transition-all"
                        />
                      </div>
                      <button
                        onClick={handleAddFunds}
                        disabled={
                          !monthlyAddition ||
                          activeGoal.current_amount >= activeGoal.target_amount
                        }
                        className={`px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${
                          !monthlyAddition ||
                          activeGoal.current_amount >= activeGoal.target_amount
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
                            : `bg-gradient-to-r ${activeGoal.gradient} hover:scale-105 hover:shadow-${activeGoal.color.split("-")[1]}-500/25`
                        }`}
                      >
                        Mô phỏng nạp
                      </button>
                      {/* NÚT RESET MỚI THÊM VÀO */}
                      <button
                        onClick={handleReset}
                        className="px-4 py-4 rounded-xl font-bold text-slate-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                        title="Đặt lại dữ liệu thực"
                      >
                        <i className="fa-solid fa-rotate-left"></i>
                      </button>
                    </div>

                    {/* Animation Box cho Kết quả */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${projectedDate ? "max-h-40 mt-8 opacity-100" : "max-h-0 mt-0 opacity-0"}`}
                    >
                      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Dự kiến hoàn thành mới
                          </p>
                          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            {projectedDate}
                          </p>
                        </div>
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5 backdrop-blur-md">
                          <i className="fa-solid fa-flag-checkered text-2xl text-white"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default Goals;
