// File: src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  ShoppingCart,
  Heart,
  Mail,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems } from '../features/cart/cartSlice';
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const isAdmin = user?.role === "admin";

  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { accessToken } = useSelector((state) => state.auth);

  const totalCartItems = cartItems?.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (accessToken && user?._id) {
      dispatch(fetchCartItems({ accessToken }));
    }
  }, [accessToken, user?._id, dispatch]);

  const navItems = isAdmin
    ? [
        { to: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
        { to: "/admin", label: "Dashboard", icon: <ShieldCheck className="w-5 h-5" /> },
        { to: "/orders", label: "Orders", icon: <ShoppingCart className="w-5 h-5" /> },
        { to: "/messages", label: "Messages", icon: <Mail className="w-5 h-5" /> },
      ]
    : [
        { to: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
        { to: "/cart", label: "Cart", icon: <ShoppingCart className="w-5 h-5" /> },
        { to: "/wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" /> },
        { to: "/contactUs", label: "Contact Us", icon: <Mail className="w-5 h-5" /> },
        ...(!isLoggedIn ? [{ to: "/login", label: "Login", icon: <LogIn  className="w-5 h-5" /> }] : []),
      ].filter(Boolean);

  const performLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/");
    setShowLogoutDialog(false); // Close the dialog after logout
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 w-full">
        <Link to="/" className="flex items-center font-bold text-xl">
          <img
            src="/src/assets/images/navbar_logo.png"
            alt="Logo"
            className="h-12 w-12 mr-2"
          />
          NaturalIce
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex items-center gap-1 text-white text-base hover:text-blue-200 transition-colors",
                  location.pathname === item.to ? "underline font-semibold" : ""
                )}
              >
                {item.icon}
                {item.label}
                {item.to === "/cart" && totalCartItems > 0 && (
                  <span className="ml-1 bg-gray-300 text-black rounded-full px-2 py-0.5 text-xs font-bold relative bottom-[10px] right-[10px]">
                    {totalCartItems}
                  </span>
                )}
              </Link>
            </li>
          ))}
          {isLoggedIn && (
            <li>
              <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogTrigger asChild>
                  <button
                    className="flex items-center gap-1 text-white text-base hover:text-blue-200 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out of your account?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={performLogout} className="bg-red-500 hover:bg-red-600">
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          )}
        </ul>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 text-white text-base hover:text-blue-200 py-2",
                    location.pathname === item.to ? "underline font-semibold" : ""
                  )}
                >
                  {item.icon}
                  {item.label}
                  {item.to === "/cart" && totalCartItems > 0 && (
                    <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                      {totalCartItems}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            {isLoggedIn && (
              <li>
                <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-white text-base hover:text-blue-200 py-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to log out of your account?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={performLogout} className="bg-red-500 hover:bg-red-600">
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
