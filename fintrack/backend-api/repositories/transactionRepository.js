const db = require("../db");
const transactionRepository = {
  addTransactionAndUpdateWallet: async (transactionData) => {
    const {
      userId,
      type,
      categoryId,
      walletId,
      amount,
      dateTime,
      note,
      payer,
      paymentType,
      paymentStatus,
      isTemplate,
    } = transactionData;
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Thêm giao dịch
      const insertSql = `
       INSERT INTO transactions 
        (user_id, type, category_id, wallet_id, amount, transaction_date, description, payer, payment_type, payment_status, is_template) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
    `;
      const [txResult] = await connection.execute(insertSql, [
        userId,
        type,
        categoryId,
        walletId,
        amount,
        dateTime,
        note,
        payer,
        paymentType,
        paymentStatus,
        isTemplate ? 1 : 0,
      ]);

      // 2. Cập nhật ví nếu trạng thái là cleared
      if (paymentStatus === "cleared") {
        let updateWalletSql = "";
        if (type === "expense") {
          let updateWalletSql = "";
          if (type === "expense") {
            updateWalletSql =
              "UPDATE wallets SET balance = balance - ? WHERE id = ? AND user_id = ?";
          } else if (type === "income") {
            updateWalletSql =
              "UPDATE wallets SET balance = balance + ? WHERE id = ? AND user_id = ?";
          }

          if (updateWalletSql) {
            const [walletResult] = await connection.execute(updateWalletSql, [
              amount,
              walletId,
              userId,
            ]);
            if (walletResult.affectedRows === 0) {
              throw new Error(
                "Không tìm thấy ví hợp lệ hoặc bạn không có quyền cập nhật ví này.",
              );
            }
          }
        }
      }
      await connection.commit();
      return txResult.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Lấy danh sách giao dịch
  getAllTransactions: async (userId) => {
    const connection = await db.getConnection();
    try {
      // Dùng JOIN để lấy tên category, icon và tên wallet
      // Dùng cú pháp "AS" để đổi tên cột cho giống hệt Mock Data của React
      const query = `
        SELECT 
          t.id, 
          t.type, 
          t.amount, 
          t.transaction_date AS date, 
          t.description AS note, 
          c.name AS category, 
          c.icon AS categoryIcon, 
          w.name AS wallet, 
          t.payment_status AS status
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN wallets w ON t.wallet_id = w.id
        WHERE t.user_id = ?
        ORDER BY t.transaction_date DESC
      `;
      const [rows] = await connection.execute(query, [userId]);
      return rows;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },
};
module.exports = transactionRepository;
