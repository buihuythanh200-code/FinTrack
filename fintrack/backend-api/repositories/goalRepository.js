const db = require("../db");
class GoalRepository {
  // Tìm tất cả mục tiêu theo User ID
  async findByUserId(userId) {
    const [rows] = await db.execute("SELECT * FROM goals WHERE user_id = ?", [
      userId,
    ]);
    return rows;
  }

  // Tính tổng số dư hiện tại của các mục tiêu
  async getTotalBalance(userId) {
    const [rows] = await db.execute(
      "SELECT SUM(current_amount) as totalBalance FROM goals WHERE user_id = ?",
      [userId],
    );
    return rows[0].totalBalance || 0;
  }

  // Tìm một mục tiêu cụ thể theo ID và User ID
  async findById(goalId, userId) {
    const [rows] = await db.execute(
      "SELECT * FROM goals WHERE id = ? AND user_id = ?",
      [goalId, userId],
    );
    return rows[0];
  }

  // Cập nhật số tiền hiện tại
  async updateCurrentAmount(goalId, amount) {
    return await db.execute(
      "UPDATE goals SET current_amount = ? WHERE id = ?",
      [amount, goalId],
    );
  }
  // Lấy tất cả mục tiêu tiết kiệm của user
  async getAllGoals(userId) {
    const query = `
      SELECT 
        id, 
        title, 
        target_amount, 
        current_amount, 
        target_date, 
        icon, 
        color, 
        bg_color
      FROM goals
      WHERE user_id = ?
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }
}

module.exports = new GoalRepository();
