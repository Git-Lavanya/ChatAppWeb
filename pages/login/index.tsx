import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Auth } from "../../redux/actions";
import { setLoginAuthData } from "../../redux/reducers";
import { useRouter } from "next/router";
import { AppDispatch } from "../../redux/store";
import { Input, Button } from "../../components";
import Styles from "../../styles/Comp.module.scss";
interface InputType {
  username: string;
  password: string;
}
const Login: React.FunctionComponent = function () {
  const defaultInput = {
    username: "",
    password: "",
  };
  const [formInput, setFormInput] = useState<InputType>(defaultInput);
  const intref = useRef<HTMLInputElement | null>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  async function handleLogin() {
    const res = await Auth.getAuthentication(formInput);
    if (!res.errMsg) {
      dispatch(setLoginAuthData(res));
      router.push("/layout");
    }
  }
  async function handleSignUp() {
    const res = await Auth.getSignUp(formInput);
    if (!res.errMsg) {
      setFormInput(defaultInput);
      alert("Signup successfully");
    } else {
      alert(res.errMsg);
    }
  }
  function onFormChange(e) {
    setFormInput((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  return (
    <div className="flex-container" style={{ height: "100vh" }}>
      <div className={`flex-container ${Styles.loginBackground}`}>
        <div>
          <Input
            onChange={onFormChange}
            id="username"
            placeholder="Type Username"
            onCancel={() => setFormInput({ ...formInput, username: "" })}
          />
          <Input
            onChange={onFormChange}
            id="password"
            placeholder="Type Password"
            type="password"
            onCancel={() => setFormInput({ ...formInput, password: "" })}
          />
          <Button
            handleClick={handleLogin}
            text="Login"
            className="login-button"
          />
          <Button
            handleClick={handleSignUp}
            text="Sign Up"
            className="login-button"
          />
        </div>
      </div>
    </div>
  );
};
export default Login;
