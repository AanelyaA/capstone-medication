import "./LoginPage.scss";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    verifyPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [activeForm, setActiveForm] = useState("login");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleActive = (formName) => {
    setActiveForm(formName);
    setError(null);
    setSuccess(false);
  };

  const handleChange = (event) => {
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

  const handleSignSubmit = async (event) => {
    event.preventDefault();

    const { username, email, password, verifyPassword } = formData;

    if (password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:8080/auth/register", {
        username,
        email,
        password,
      });

      setSuccess(true);
      setError(null);
      setFormData({
        username: "",
        email: "",
        password: "",
        verifyPassword: "",
      });
      setActiveForm("login");
    } catch (error) {
      setSuccess(false);
      setError(error.response?.data || "Signup failed");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

        const { email, password } = loginData;


    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email, password
      });

      sessionStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div className="login">
      <div className="login__pattern"></div>

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
                onClick={handleSubmit}
              >
                enter
              </button>
              {error && <div className="login__error"> {error} </div>}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder="Please enter your email"
                />
              </div>
              <div className="login__form-box">
                <label className="login__label">Password:</label>
                <input
                  className="login__input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder="Please re-enter your new password"
                />
              </div>

              <button
                type="submit"
                className="login__button"
                onClick={handleSignSubmit}
              >
                sign up
              </button>
              {error && <div className="login__error"> {error} </div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
