import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPages = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-error">Access Denied</h1>
      <p className="text-xl mt-4">
        You don't have permission to access this page.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Go to Home
      </Link>
    </div>
  );
};

export default UnauthorizedPages;
