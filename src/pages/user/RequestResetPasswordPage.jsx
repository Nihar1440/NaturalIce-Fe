import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordRequest } from "../../features/auth/authSlice";

const RequestResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
//   const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(forgotPasswordRequest(email));
    if (forgotPasswordRequest.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload, {
        description: "Please check your email for the password reset link.",
      });
      setEmail("")
    } else {
      toast.error("Failed to send reset link", {
        description: error || "An unexpected error occurred.",
      });
    }
  };

  useEffect(() => {
    if (error) {
        console.error(error, "error")
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Forgot Your Password?
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestResetPasswordPage; 