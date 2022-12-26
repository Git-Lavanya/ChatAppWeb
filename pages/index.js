import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { encryptPassword } from "../utils/helper_function";
import { useRouter } from "next/router";
import { API_URL } from "../utils/baseUrl";
const LoginPage = () => {
  const router = useRouter();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState({
    state: false,
    msg: "",
  });
  const [passwordError, setPasswordError] = useState({
    state: false,
    msg: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (inputs.email.length === 0) {
        setEmailError({
          name: "Please enter your email",
          state: true,
        });
      } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
        setEmailError({
          name: "Invalid Email",
          state: true,
        });
      } else {
        setEmailError({
          name: "",
          state: false,
        });
      }
      if (inputs.password.length === 0) {
        setPasswordError({
          name: "Please enter your password",
          state: true,
        });
      } else {
        setPasswordError({
          name: "",
          state: false,
        });
      }
      if (emailError.state === false && passwordError.state === false) {
        // encrypt
        const processedPassword = encryptPassword(inputs.password);
        const apiCallResponse = await fetch(`${API_URL}auth/login`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...inputs,
            password: processedPassword,
          }),
        });
        const output = await apiCallResponse.json();

        if (output.status === 1) {
          const result = output.data[0];
          localStorage.setItem(
            "user_id",
            result.user_type === "client"
              ? result?.client_id
              : result?.employee_id
          );
          localStorage.setItem("email", result.email);
          localStorage.setItem("first_name", result.first_name);
          localStorage.setItem("last_name", result.last_name);
          localStorage.setItem("user_role", result.user_type);
          if (result.user_type === "client") {
            localStorage.setItem("employee_id", result.employee_id);
            localStorage.setItem("user_root_folder", result?.s3_root_folder);
          }
          localStorage.setItem("USER_DATA", JSON.stringify(result));
          console.log(router, "ppp");
          router.push("/dashboard");
        } else {
          console.error(output.data.message);
        }
      }
    } catch (error) {
      console.error(`Error occurred while login. Please try again ${error}`);
    }
  };
  return (
    <div>
      <div className={styles.login_container + " " + styles.align_column}>
        <div className={styles.login_block + " " + styles.align_column}>
          <div className={styles.logo}>
            <Image
              src="/resources/images/finlotaxlogo.png"
              alt="Logo"
              width={200}
              height={50}
            />
          </div>
          <div className={styles.signin_info}>
            <h2 className={styles.welcome}>Welcome!</h2>
            <p className={styles.signup}>Please sign in.</p>
          </div>
          <form action="">
            <div className={styles.input_block}>
              {emailError.state ? (
                <label htmlFor="email" className="error_text">
                  {emailError.name}
                </label>
              ) : (
                <label className={styles.label}>Email Address</label>
              )}

              <input
                type="email"
                name="email"
                placeholder="bob@gmail.com"
                onChange={handleChange}
                className={styles.input_section}
              />
            </div>
            <div className={styles.input_block}>
              {passwordError.state ? (
                <label htmlFor="password" className="error_text">
                  {passwordError.name}
                </label>
              ) : (
                <label className={styles.label}>Password</label>
              )}

              <input
                type="password"
                name="password"
                onChange={handleChange}
                className={styles.input_section}
              />
            </div>
            <div className={styles.input_block}>
              <Link href="/forget_password" className={styles.forgotpassword}>
                forgot password ?
              </Link>
            </div>
            <button className={styles.signin_button} onClick={handleSubmit}>
              Sign in
            </button>
          </form>
          <p className={styles.alter_text}>
            Don’t have account yet ?{" "}
            <Link href="/signup" className={styles.signup_link}>
              Sign up
            </Link>
          </p>
          <div className={styles.google_login} onClick={() => {}}>
            <img
              alt="google"
              src="https://developers-dot-devsite-v2-prod.appspot.com/identity/sign-in/g-normal.png"
              className={styles.google_icon}
            />
            Sign in with Google
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
