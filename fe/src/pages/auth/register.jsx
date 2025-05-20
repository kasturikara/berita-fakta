import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterPages = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    username: "",
    full_name: "",
  });
  const [error, setError] = React.useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await register(formData);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="shadow-xl card w-96 bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="input input-bordered"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="********"
                className="input input-bordered"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="username"
                className="input input-bordered"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="full_name"
                placeholder="Your Full Name"
                className="input input-bordered"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-6 form-control">
              <button className="w-full btn btn-primary">Register</button>
            </div>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPages;
