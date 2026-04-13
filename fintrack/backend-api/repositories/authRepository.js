// backend-api/repositories/authRepository.js
const db = require("../db");

// Hàm 1: Tìm user bằng email
const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0]; // Trả về user đầu tiên tìm thấy hoặc undefined
};

// Hàm 2: Tạo mới user
const createUser = async (email, hashedPassword, name) => {
  const sql = "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)";
  const [result] = await db.query(sql, [email, hashedPassword, name]);
  return result; // result.insertId sẽ là ID của user mới
};

module.exports = {
  getUserByEmail,
  createUser,
};
