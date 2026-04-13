const transactionRepository = require("../repositories/transactionRepository");
const transactionController = {
  createTransaction: async (req, res) => {
    try {
      const {
        type,
        amount,
        categoryId,
        walletId,
        dateTime,
        isTemplate,
        note,
        payer,
        paymentType,
        paymentStatus,
      } = req.body;

      const userId = req.user.id;

      // 1. Validation (Kiểm tra tính hợp lệ)
      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Số tiền phải lớn hơn 0",
        });
      }
      if (!categoryId || !walletId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin bắt buộc (Danh mục/Ví)",
        });
      }

      // 2. Prepare data send to Repository
      const transactionData = {
        userId,
        type,
        amount: Number(amount),
        categoryId,
        walletId,
        dateTime,
        note,
        payer,
        paymentType,
        paymentStatus,
        isTemplate,
      };

      // 3. Call the Repository to execute the operation in the database
      const newTransactionId =
        await transactionRepository.addTransactionAndUpdateWallet(
          transactionData,
        );
      // 4. Return a successful result to the frontend
      return res.status(201).json({
        success: true,
        message: "Thêm giao dịch thành công!",
        data: { transactionId: newTransactionId },
      });
    } catch (error) {
      // 5. Bắt lỗi nếu Repository ném ra (ví dụ: mất mạng, sai cú pháp SQL)
      console.error("Lỗi tại createTransaction Controller:", error.message);
      return res.status(500).json({
        success: false,
        message: "Không thể thêm giao dịch lúc này, vui lòng thử lại.",
      });
    }
  },

  // getTransactions
  getTransactions: async (req, res) => {
    try {
      // Giả lập user (sau này bạn lấy từ token đăng nhập: req.user.id)
      const userId = req.user.id;

      const transactions =
        await transactionRepository.getAllTransactions(userId);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách giao dịch thành công",
        data: transactions, // Trả mảng dữ liệu về cho Frontend
      });
    } catch (error) {
      console.error("Lỗi tại getTransactions Controller:", error.message);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ, không thể lấy dữ liệu",
      });
    }
  },
};
module.exports = transactionController;
