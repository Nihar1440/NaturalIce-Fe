import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, checkAdmin, logout } from "../../features/auth/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { accessToken, loading, error, user } = useSelector((state) => state.auth);


  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (accessToken && !user && !loading) {
      dispatch(checkAdmin(accessToken));
    }

    if (user && user.role === 'admin') {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      toast.success("Login Successful", {
        description: "Welcome to the Admin Dashboard!",
      });
      navigate("/admin");
    }

    if (error) {
      toast.error("Login Failed", {
        description: error,
      });
      dispatch(logout());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  }, [accessToken, user, error, loading, navigate, dispatch]);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (storedAccessToken && !accessToken && !user && !loading) {
      dispatch(checkAdmin(storedAccessToken));
    }
  }, [dispatch, accessToken, user, loading]);

  const handleSocialLogin = (provider) => {
    toast.info(`Attempting to log in with ${provider}...`, {
      description: `Please ensure your backend supports ${provider} OAuth integration.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-xl p-2 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Welcome back!
        </h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your account</p>

        <form onSubmit={handleLogin} className="space-y-5">
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="h-5 w-5">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Logo" className="h-full w-full object-contain" />
            </div>
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("Facebook")}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <div className="h-5 w-5">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Logo" className="h-full w-full object-contain filter invert" />
            </div>
            Sign in with Facebook
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("GitHub")}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 transition-colors"
          >
            <div className="h-5 w-5">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub Logo" className="h-full w-full object-contain filter invert" />
            </div>
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
