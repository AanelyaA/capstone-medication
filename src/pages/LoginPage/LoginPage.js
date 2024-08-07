import "./LoginPage.scss";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthAPI from "../../classes/authAPI";
import { timezoneCodes } from "../../utils/utils.js";
import Spinner from "../../components/Spinner/Spinner";

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    verifyPassword: "",
    timezone: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [activeForm, setActiveForm] = useState("login");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleActive = (formName) => {
    setActiveForm(formName);
    setError(null);
    setSuccess(false);
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) ? "" : "Invalid email address.";
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 128;
    const hasNumber = /\d/;
    const hasLetter = /[a-zA-Z]/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (password.length > maxLength) {
      return "Password cannot exceed 128 characters.";
    }
    if (!hasNumber.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!hasLetter.test(password)) {
      return "Password must contain at least one letter.";
    }
    return "";
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();

    const { username, email, password, verifyPassword, timezone } = formData;

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await AuthAPI.Register({ username, email, password, timezone });
      setSuccess(true);
      setError(null);
      setFormData({
        username: "",
        email: "",
        password: "",
        verifyPassword: "",
        timezone: "",
      });

      setLoginData({
        email: email,
        password: "",
      });
      setTimeout(() => setActiveForm("login"), 1500);
    } catch (error) {
      console.error("Error during registration:", error);
      setError(error.message);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = loginData;
    setIsLoading(true);

    try {
      const response = await AuthAPI.Login({ email, password });
      sessionStorage.setItem("token", response.token);
      onLogin(response.token);
      navigate("/");
    } catch (error) {
      console.error("Error logging in a user:", error);
      setError(error.response.data || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__section">
        <div className="login__wrap">
          <img src={logo} alt="logo" className="login__logo" />
          <h3 className="login__title">Otter Pill</h3>
        </div>

        <div className="login__form-container">
          <div className="login__heading">
            <h1
              className={
                activeForm === "login"
                  ? "login__subtitle"
                  : "login__subtitle--inactive"
              }
              onClick={() => {
                handleActive("login");
              }}
            >
              log in
            </h1>
            <h1
              className={
                activeForm === "signup"
                  ? "login__subtitle"
                  : "login__subtitle--inactive"
              }
              onClick={() => {
                handleActive("signup");
              }}
            >
              sign up
            </h1>
          </div>

          {activeForm === "login" && (
            <form className="login__form">
              <div className="login__form-box">
                <label className="login__label">Email:</label>
                <input
                  className="login__input"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Please enter your email"
                />
              </div>
              <div className="login__form-box">
                <label className="login__label">Password:</label>
                <input
                  className="login__input"
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Please enter your password"
                />
              </div>
              <button
                type="submit"
                className="login__button"
                onClick={handleLoginSubmit}
              >
                enter
              </button>
              {error && <div className="login__error"> {error} </div>}
              {isLoading && <Spinner />}
            </form>
          )}

          {activeForm === "signup" && (
            <form className="login__form">
              <div className="login__form-box">
                <label className="login__label">Name:</label>
                <input
                  className="login__input"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleRegisterChange}
                  placeholder="Please enter your name"
                />
              </div>
              <div className="login__form-box">
                <label className="login__label">Email:</label>
                <input
                  className="login__input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleRegisterChange}
                  placeholder="Please enter your email"
                />
              </div>
              <div className="login__form-box">
                <label className="login__label">Timezone:</label>
                <select
                  className="login__input login__input-select"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleRegisterChange}
                  required
                >
                  <option value="">Select your timezone</option>
                  {timezoneCodes.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="login__form-box">
                <label className="login__label">Password:</label>
                <input
                  className="login__input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleRegisterChange}
                  placeholder="Please enter your password"
                />
              </div>
              <div className="login__form-box">
                <label className="login__label">Verify Password:</label>
                <input
                  className="login__input"
                  type="password"
                  name="verifyPassword"
                  value={formData.verifyPassword}
                  onChange={handleRegisterChange}
                  placeholder="Please re-enter your password"
                />
              </div>
              <button
                type="submit"
                className="login__button"
                onClick={handleSignupSubmit}
              >
                sign up
              </button>
              {error && <div className="login__error"> {error} </div>}
              {success && (
                <>
                  <div className="login__success"> Signup successful! </div>
                  <Spinner />
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
