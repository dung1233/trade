import React, { useEffect, useState } from "react";
import userIcon from "../../assets/img/user.svg";
import passwordIcon from "../../assets/img/password.svg";
import { validate } from "./validate";
import styles from "../login/SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notify } from "./toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpBox = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    IsAccepted: false,
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setErrors(validate(data, "signUp"));
  }, [data, touched]);

  const changeHandler = (event) => {
    if (event.target.name === "IsAccepted") {
      setData({ ...data, [event.target.name]: event.target.checked });
    } else {
      setData({ ...data, [event.target.name]: event.target.value });
    }
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {
      const urlApi = `https://t2305mpk320241031161932.azurewebsites.net/api/Auth/register-customer`;
      const pushData = async () => {
        try {
          const response = await toast.promise(
            axios.post(urlApi, {
              username: data.username.toLowerCase(),
              password: data.password,
            }, {
              headers: {
                "Content-Type": "application/json",
              }
            }),
            {
              pending: "Check your data",
              success: "Checked!",
              error: "Something went wrong!",
            }
          );

          // Log the response data to verify the structure
          console.log("API Response:", response.data);

          // Adjust the condition based on actual response structure
          if (response.data === 'Customer registered successfully.') {
            notify("You signed up successfully", "success");
            navigate("/login");
          } 
          // Nếu response.data là một đối tượng với thuộc tính success
          else if (response.data && response.data.success === 'Customer registered successfully.') {
            notify("You signed up successfully", "success");
            navigate("/login");
          } else {
            notify("You have already registered, log in to your account", "warning");
          }
        } catch (error) {
          console.error("Error during registration:", error);
          notify("An error occurred. Please try again.", "error");
        }
      };
      pushData();
    } else {
      notify("Please check fields again", "error");
      setTouched({
        username: true,
        password: true,
        confirmPassword: true,
        IsAccepted: false,
      });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formLogin} onSubmit={submitHandler} autoComplete="off">
        <h2>Sign Up</h2>
        <div>
          <div className={errors.username && touched.username ? styles.unCompleted : !errors.username && touched.username ? styles.completed : undefined}>
            <input type="text" name="username" value={data.username} placeholder="Username" onChange={changeHandler} onFocus={focusHandler} autoComplete="off" />
            <img src={userIcon} alt="" />
          </div>
          {errors.username && touched.username && <span className={styles.error}>{errors.username}</span>}
        </div>
        <div>
          <div className={errors.password && touched.password ? styles.unCompleted : !errors.password && touched.password ? styles.completed : undefined}>
            <input type="password" name="password" value={data.password} placeholder="Password" onChange={changeHandler} onFocus={focusHandler} autoComplete="off" />
            <img src={passwordIcon} alt="" />
          </div>
          {errors.password && touched.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        <div>
          <div className={errors.confirmPassword && touched.confirmPassword ? styles.unCompleted : !errors.confirmPassword && touched.confirmPassword ? styles.completed : undefined}>
            <input type="password" name="confirmPassword" value={data.confirmPassword} placeholder="Confirm Password" onChange={changeHandler} onFocus={focusHandler} autoComplete="off" />
            <img src={passwordIcon} alt="" />
          </div>
          {errors.confirmPassword && touched.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
        </div>
        <div>
          <div className={styles.terms}>
            <input type="checkbox" name="IsAccepted" value={data.IsAccepted} id="accept" onChange={changeHandler} onFocus={focusHandler} />
            <label htmlFor="accept">I accept terms of privacy policy</label>
          </div>
          {errors.IsAccepted && touched.IsAccepted && <span className={styles.error}>{errors.IsAccepted}</span>}
        </div>
        <div>
          <button type="submit">Create Account</button>
          <span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
            Already have a account? <Link to="/login">Sign In</Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUpBox;
