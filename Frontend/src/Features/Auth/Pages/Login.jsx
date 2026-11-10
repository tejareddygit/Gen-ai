import React, { Suspense, useState } from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../Hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  };

  if (loading) {
    return (
      <main>
        <h1>Loading.....</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <div className="input-group">
            <label htmlFor="Email">Email</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="Enter email"
              id="email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="Password">Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="Password"
              placeholder="Enter Password"
              id="Password"
            />
          </div>
          <button className="button primary-button">Login</button>
        </form>
        <p>
          Don't have an account <Link to={"/register"}>Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
