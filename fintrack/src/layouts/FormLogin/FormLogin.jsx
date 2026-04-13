import { useState } from "react";
import axios from "axios";
function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      if (response.data.success) {
        // THÊM DÒNG NÀY ĐỂ XEM API THỰC SỰ TRẢ VỀ GÌ
        console.log("Dữ liệu API trả về:", response.data);
        // 1. Lưu Token và thông tin User vào Local Storage của trình duyệt
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // 2. Chuyển hướng sang trang Dashboard
        // 3. Chuyển hướng bằng navigate (không load lại trang)
        navigate("/transactions");
      }
    } catch (err) {
      // Bắt lỗi từ Backend trả về (Ví dụ: Sai mật khẩu)
      setError(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      action=""
      className="form-login p-[7rem] flex flex-col gap-[1rem] max-sm:p-[2rem] max-sm:flex-1"
      onSubmit={handleLogin}
    >
      <h2 className="form-login-title text-[4rem] font-semibold text-center max-sm:text-[3rem]">
        Login
      </h2>

      <label className="form-label text-[1.6rem] font-normal" htmlFor="email">
        Email
      </label>
      <div className="login-email flex gap-[0.6rem] h-[4rem] items-center border border-[#333333] focus-within:border-[oklch(45%_0.085_224.283)] p-[0.5rem] rounded-lg font-medium transition-colors">
        <span className="input-icon">
          <i className="fa-solid fa-user"></i>
        </span>
        <input
          className="form-input sm:flex-1 max-sm:w-[80%] outline-none bg-transparent"
          type="email"
          placeholder="Type your email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <label
        className="form-label text-[1.6rem] font-normal"
        htmlFor="password"
      >
        Password
      </label>
      <div className="login-password flex gap-[0.6rem] h-[4rem] items-center border border-[#333333] focus-within:border-[oklch(45%_0.085_224.283)] p-[0.5rem] rounded-lg font-medium transition-colors">
        <span className="input-icon">
          <i className="fa-solid fa-lock"></i>
        </span>
        <input
          className="form-input sm:flex-1 max-sm:w-[80%] outline-none bg-transparent"
          type="password"
          placeholder="Type your password"
          id="password"
          required
          value={password} // THÊM DÒNG NÀY
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <p className="forgot-password text-right text-[1.6rem] hover:text-[oklch(45%_0.085_224.283)] font-normal transition-colors cursor-pointer">
        <span className="max-sm:whitespace-nowrap">Forgot password?</span>
      </p>

      <button
        type="submit"
        disabled={isLoading}
        className={`btn-login text-white h-[4rem] rounded-xl cursor-pointer transition-all font-semibold ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[oklch(45%_0.085_224.283)] hover:bg-[oklch(40%_0.085_224.283)]"
        }`}
      >
        {isLoading ? "Đang xử lý..." : "Login"}
      </button>

      {/* THÊM PHẦN NÀY ĐỂ HIỂN THỊ LỖI */}
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-[1.4rem] text-center border border-red-100">
          {error}
        </div>
      )}

      <div className="social-sign-up flex flex-col gap-[1rem] items-center mt-[3rem]">
        <p className="sub-title text-[1.6rem] text-center max-sm:whitespace-nowrap">
          Or Sign Up Using
        </p>
        <div className="social-icons flex justify-center items-center gap-[1rem]">
          <span className="logo-icon logo-google w-[4rem] h-[4rem] flex justify-center items-center text-[1.8rem] rounded-lg bg-white border border-gray-300 text-gray-700 font-medium transition hover:bg-gray-50 cursor-pointer">
            <i className="fa-brands fa-google"></i>
          </span>
          <span className="logo-icon logo-facebook w-[4rem] h-[4rem] flex justify-center items-center text-[1.8rem] rounded-lg bg-[#1877F2] text-white font-semibold transition hover:bg-[#166FE5] cursor-pointer">
            <i className="fa-brands fa-facebook-f"></i>
          </span>
        </div>
      </div>

      <div className="sign-up-section flex flex-col gap-[0.8rem] items-center mt-[2rem]">
        <p className="sub-title text-[1.6rem] text-center max-sm:whitespace-nowrap">
          Don't have an account?
        </p>
        <button
          type="button"
          className="btn-signup-link w-full h-[4rem] rounded-lg border border-gray-300 text-gray-700 font-semibold transition-all duration-200 hover:border-black hover:text-black active:scale-[0.98] cursor-pointer"
        >
          SIGN UP
        </button>
      </div>
    </form>
  );
}

export default FormLogin;
