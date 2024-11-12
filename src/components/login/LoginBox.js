import React, { useState } from "react";
import userIcon from "../../assets/img/user.svg";
import passwordIcon from "../../assets/img/password.svg";
import styles from "../login/SignUp.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginBox = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [touched, setTouched] = useState({});
  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  const checkData = (obj) => {
    const { username, password } = obj;
    const urlApi = `https://t2305mpk320241031161932.azurewebsites.net/api/Auth/login`;

    const api = axios
      .post(
        urlApi,
        { username: username.toLowerCase(), password: password },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        
        const data = response.data; // Lấy dữ liệu từ phản hồi của axios
        console.log("Dữ liệu đăng nhập thành công:", data);
       
        // Lưu JWT và tên người dùng vào localStorage
        localStorage.setItem('jwtToken', data.token);
        
        return response.data;
      })
      .then((data) => {
        if (data.token) {  // Kiểm tra sự tồn tại của token
          notify("You logged in successfully", "success");
          // Thêm logic lưu token nếu cần, ví dụ: localStorage.setItem("token", data.token);
          // Điều hướng về trang chủ sau khi đăng nhập thành công
        navigate("/");
        } else {
          notify("Your username or password is incorrect", "error");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error); // Log lỗi chi tiết
        notify("An error occurred. Please try again.", "error");
      });

    toast.promise(api, {
      pending: "Loading your data...",
      success: false,
      error: "Something went wrong!",
    });
  };

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    checkData(data);
  };

  return (
    <div className={styles.container}>
      <form className={styles.formLogin} onSubmit={submitHandler} autoComplete="off">
        <h2>Sign In</h2>
        <div>
          <div>
            <input
              type="text"
              name="username"
              value={data.username}
              placeholder="Username"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={userIcon} alt="" />
          </div>
        </div>
        <div>
          <div>
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Password"
              onChange={changeHandler}
              onFocus={focusHandler}
              autoComplete="off"
            />
            <img src={passwordIcon} alt="" />
          </div>
        </div>

        <div>
          <button type="submit">Login</button>
          <span style={{ color: "orange", textAlign: "center", display: "inline-block", width: "100%" }}>
            Don't have an account? <Link to="/register">Create account</Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginBox;
