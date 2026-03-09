import styles from "./AuthLayout.module.css";
import logo from "../../assets/logo-removebg-preview.png";
import screenLogin from "../../assets/images/login/screen_login.webp";
import logoPositive from "../../assets/logo-positive-colors.png";
import FormLogin from "../FormLogin";
function AuthLayout() {
  return (
    <div
      className={`${styles["auth-layout"]} grid grid-cols-12 min-h-screen w-full overflow-hidden`}
    >
      {/* start hero */}
      <div className={`${styles.hero} lg:col-span-7 max-lg:hidden `}>
        <div
          className={`${styles["logo"]} w-[10.4rem] mt-[1.4rem] ml-[1.4rem]`}
        >
          <img src={logo} alt="" className="w-full h-full object-contain" />
        </div>

        <div
          className={`${styles["hero-text"]} flex flex-col items-center justify-center mt-[8rem] gap-[2rem] w-[60%] ml-auto mr-auto`}
        >
          <h1 className="title text-[4rem] font-semibold text-[oklch(45%_0.085_224.283)] ">
            Your Finances
          </h1>
          <div className="demo-images w-[20rem] h-[10rem] mt-[1rem]">
            <img className="w-full h-auto" src={screenLogin} alt="" />
          </div>
          <p className="hero-desc text-center text-[1.8rem] text-[oklch(45%_0.085_224.283)]">
            Dive into reports, build budgets, sync with your banks and enjoy
            automatic categorization.
          </p>
          <a
            href=""
            className="text-[oklch(45%_0.085_224.283)] underline text-[1.6rem]"
          >
            Learn more about how Wallet works
          </a>

          <div className="w-[13rem] mt-[2rem]">
            <img className="w-full h-auto" src={logoPositive} alt="" />
          </div>
        </div>
      </div>
      {/* end hero */}

      <div
        className={`${styles["auth-login"]} lg:col-span-5 lg:p-[6rem] 
        max-lg:col-span-12 max-lg:p-[8rem] box-border
        max-sm:max-lg:p-[2rem] max-sm:flex max-sm:items-center
        shadow-xl `}
      >
        <FormLogin />
      </div>
    </div>
  );
}
export default AuthLayout;
