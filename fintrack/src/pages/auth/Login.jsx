import LayoutLogin from "../../layouts/AuthLayout";
import styles from "./Login.module.css";
function Login() {
  return (
    <div className={styles["login"]}>
      <LayoutLogin />
    </div>
  );
}
export default Login;
