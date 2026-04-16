const goalRepository = require("../repositories/goalRepository");

// API 1: Lấy danh sách mục tiêu (từ bảng budgets)
exports.getGoals = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy dữ liệu trực tiếp từ bảng goals
    const goals = await goalRepository.getAllGoals(userId);

    // Làm giàu dữ liệu: Ánh xạ màu Tailwind sang Hex và Gradient cho Chart & Progress Bar
    const enrichedGoals = goals.map((g) => {
      let gradient = "from-indigo-400 to-indigo-600";
      let hex = "#6366f1"; // Mặc định (Indigo)

      if (g.color && (g.color.includes("red") || g.color.includes("rose"))) {
        gradient = "from-red-400 to-red-600";
        hex = "#ef4444";
      } else if (g.color && g.color.includes("blue")) {
        gradient = "from-blue-400 to-blue-600";
        hex = "#3b82f6";
      } else if (g.color && g.color.includes("gray")) {
        gradient = "from-slate-500 to-slate-700";
        hex = "#64748b";
      } else if (g.color && g.color.includes("emerald")) {
        gradient = "from-emerald-400 to-emerald-600";
        hex = "#10b981";
      } else if (g.color && g.color.includes("yellow")) {
        gradient = "from-yellow-400 to-yellow-600";
        hex = "#eab308";
      }

      return { ...g, gradient, hex };
    });

    // Tính tổng tiền đang có trong tất cả các mục tiêu
    const totalBalance = enrichedGoals.reduce(
      (acc, curr) => acc + Number(curr.current_amount),
      0,
    );

    res.json({ success: true, data: enrichedGoals, totalBalance });
  } catch (error) {
    console.error("Lỗi Controller getGoals:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi Server khi tải mục tiêu" });
  }
};
// Hàm xử lý khi user bấm "Mô phỏng nạp" (Giữ nguyên)
exports.addFunds = async (req, res) => {
  try {
    res.json({ success: true, message: "Mô phỏng nạp tiền thành công!" });
  } catch (error) {
    console.error("Lỗi Controller addFunds:", error);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};
