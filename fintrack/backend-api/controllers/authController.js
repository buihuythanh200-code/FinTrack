const authRepo = require("../repositories/authRepository");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kiểm tra đầu vào
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập Email và Mật khẩu!" });
    }

    // 2. Tìm user trong DB
    const user = await authRepo.getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email không tồn tại!" });
    }

    // 3. So sánh mật khẩu (Đang so sánh chuỗi thuần theo yêu cầu của bạn)
    const isMatch = password === user.password_hash;
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu không chính xác!" });
    }

    // 4. Kiểm tra Secret Key
    if (!process.env.JWT_SECRET) {
      console.error("LỖI: JWT_SECRET chưa được định nghĩa trong file .env");
      return res
        .status(500)
        .json({ success: false, message: "Lỗi cấu hình Server" });
    }

    // 5. Tạo Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const responseData = {
      success: true,
      message: "Đăng nhập thành công!",
      token: token,
      user: { id: user.id, name: user.name, email: user.email },
    };

    // LOG DỮ LIỆU ĐỂ KIỂM TRA TRONG TERMINAL
    console.log(">>> Đăng nhập thành công cho:", email);
    console.log(">>> Token cấp mới:", token);

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Lỗi Đăng nhập:", error);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

module.exports = { login };
