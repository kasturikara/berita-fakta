import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginPages = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await login(email, password);
    if (response.success) {
      navigate("/home");
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="shadow-xl card w-96 bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="on"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-6 form-control">
              <button className="w-full btn btn-primary">Login</button>
            </div>
          </form>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPages;
