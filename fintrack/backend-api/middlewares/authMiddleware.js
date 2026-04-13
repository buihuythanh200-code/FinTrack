const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Lấy chuỗi sau chữ "Bearer"

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Bạn cần đăng nhập!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gán thông tin đã giải mã (trong đó có id) vào request
    next(); // Cho phép đi tiếp vào Controller
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Token không hợp lệ hoặc hết hạn!" });
  }
};

module.exports = verifyToken;
