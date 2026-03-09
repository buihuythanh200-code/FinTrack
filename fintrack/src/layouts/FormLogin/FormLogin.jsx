function FormLogin() {
  return (
    <form
      action=""
      className="form-login p-[7rem] flex flex-col gap-[1rem] max-sm:p-[2rem] max-sm:flex-1"
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
        />
      </div>

      <p className="forgot-password text-right text-[1.6rem] hover:text-[oklch(45%_0.085_224.283)] font-normal transition-colors cursor-pointer">
        <span className="max-sm:whitespace-nowrap">Forgot password?</span>
      </p>

      <button
        type="submit"
        className="btn-login bg-[oklch(45%_0.085_224.283)] text-white hover:bg-[oklch(40%_0.085_224.283)] h-[4rem] rounded-xl cursor-pointer transition-all font-semibold"
      >
        Login
      </button>

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
