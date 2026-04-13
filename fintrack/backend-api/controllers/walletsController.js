const walletsRepo = require("../repositories/dashboardRepository");
const getWalletsForForm = async (req, res) => {
  try {
    // 1. Gọi Repo lấy data thô (Chạy song song bằng Promise.all cho tốc độ nhanh hơn)
    const [walletsDB] = await Promise.all([walletsRepo.getWallets()]);

    // 2. Logic lồng ghép (Mapping)
    const wallets = walletsDB.map((wallet) => {
      return {
        id: wallet.id,
        name: wallet.name,
        type: wallet.type,
        icon: wallet.icon,
      };
    });

    // 3. Trả về cho Frontend
    return res.status(200).json({
      success: true,
      message: "Lấy wallet thành công",
      data: wallets,
    });
  } catch (error) {
    console.error("Lỗi getWalletsforForm", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};
module.exports = {
  getWalletsForForm,
};
