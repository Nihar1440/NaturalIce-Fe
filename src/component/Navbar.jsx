import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Bell,
  ClipboardList,
  Heart,
  Home,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  ShieldCheck,
  ShoppingCart,
  User,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "../features/auth/authSlice";
import { clearCart, fetchCartItems } from "../features/cart/cartSlice";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);

  const isLoggedIn = !!accessToken;
  const isAdmin = user?.role === "admin";

  const { items: cartItems } = useSelector((state) => state.cart);
  const totalCartItems = cartItems?.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  useEffect(() => {
    if (accessToken && user?._id) {
      dispatch(fetchCartItems({ accessToken }));
    }
  }, [accessToken, user?._id, dispatch]);

  const navItems = isAdmin
    ? [
        { to: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
        {
          to: "/admin",
          label: "Dashboard",
          icon: <ShieldCheck className="w-5 h-5" />,
        },
        {
          to: "/orders",
          label: "Orders",
          icon: <ShoppingCart className="w-5 h-5" />,
        },
        {
          to: "/messages",
          label: "Messages",
          icon: <Mail className="w-5 h-5" />,
        },
      ]
    : [
        { to: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
        {
          to: "/cart",
          label: "Cart",
          icon: <ShoppingCart className="w-5 h-5" />,
        },
        {
          to: "/contactUs",
          label: "Contact Us",
          icon: <Mail className="w-5 h-5" />,
        },
      ].filter(Boolean);

  const performLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/");
    setShowLogoutDialog(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sky-400 text-slate-50 shadow">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 w-full">
        <Link to="/" className="flex items-center font-bold text-xl">
          <img
            src="/src/assets/images/logo.jpeg"
            alt="Logo"
            className="h-20 w-20 color-black"
          />
          NaturalIce
        </Link>

        {/* Centered Navigation Links for desktop */}
        <div className="hidden md:flex flex-grow justify-center">
          <ul className="flex items-center space-x-8">
            {navItems.slice(0, 3).map((item) => (
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
          </ul>
        </div>

        {/* Right side icons and user menu */}
        <div className="flex items-center">
          {isLoggedIn && !isAdmin ? (
            <ul className="flex items-center gap-4">
              <li className="relative">
                <NotificationBell className="w-16 h-16" />
              </li>
              <li className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors focus:outline-none cursor-pointer">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full border-2 border-white"
                        />
                      ) : (
                        <UserCircle className="w-12 h-12" />
                      )}
                      <span className="font-semibold">
                        {user?.name || user?.email || "Profile"}
                      </span>
                      <svg
                        className="w-4 h-4 ml-1 transform transition-transform duration-200 group-hover:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile/view"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" /> View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile/orders"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center"
                      >
                        <ClipboardList className="mr-2 h-4 w-4" /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile/wishlist"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center"
                      >
                        <Heart className="mr-2 h-4 w-4" /> Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile/shipping"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center"
                      >
                        <MapPin className="mr-2 h-4 w-4" /> Shipping Address
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile/change-password"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center"
                      >
                        <Lock className="mr-2 h-4 w-4" /> Change Password
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog
                      open={showLogoutDialog}
                      onOpenChange={setShowLogoutDialog}
                    >
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-red-600 focus:bg-red-50 flex items-center"
                        >
                          <LogOut className="mr-2 h-4 w-4" /> Logout
                        </DropdownMenuItem>
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
                          <AlertDialogAction
                            onClick={performLogout}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Logout
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          ) : !isLoggedIn && !isAdmin ? (
            <ul className="flex items-center gap-4">
              <li>
                <Link
                  to="/login"
                  className={cn(
                    "flex items-center gap-1 text-white text-base hover:text-blue-200 transition-colors",
                    location.pathname === "/login"
                      ? "underline font-semibold"
                      : ""
                  )}
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
              </li>
            </ul>
          ) : null}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
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
                    location.pathname === item.to
                      ? "underline font-semibold"
                      : ""
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
            {/* User Profile Links / Login-Register Links (Mobile) */}
            {isLoggedIn && !isAdmin ? (
              <>
                <li>
                  <Link
                    to="/profile/view"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-white text-base hover:text-blue-200 py-2"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ) : (
                      <UserCircle className="w-8 h-8" />
                    )}
                    <span className="font-semibold">
                      {user?.name || user?.email || "Profile"}
                    </span>
                  </Link>
                </li>
                <li className="pl-6">
                  {" "}
                  {/* Indent sub-items */}
                  <Link
                    to="/profile/orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center py-2 text-white hover:text-blue-200"
                  >
                    <ClipboardList className="mr-2 h-4 w-4" /> My Orders
                  </Link>
                  <Link
                    to="/notification"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center py-2 text-white hover:text-blue-200"
                  >
                    <Bell className="mr-2 h-4 w-4" /> Notifications
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center py-2 text-white hover:text-blue-200"
                  >
                    <Heart className="mr-2 h-4 w-4" /> Wishlist
                  </Link>
                  <Link
                    to="/profile/shipping"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center py-2 text-white hover:text-blue-200"
                  >
                    <MapPin className="mr-2 h-4 w-4" /> Shipping Address
                  </Link>
                  <Link
                    to="/profile/change-password"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center py-2 text-white hover:text-blue-200"
                  >
                    <Lock className="mr-2 h-4 w-4" /> Change Password
                  </Link>
                  <hr className="my-1 border-blue-700" />
                  <AlertDialog
                    open={showLogoutDialog}
                    onOpenChange={setShowLogoutDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileOpen(false);
                          setShowLogoutDialog(true);
                        }}
                        className="block w-full text-left py-2 text-red-300 hover:text-red-100 items-center" // Added flex items-center
                      >
                        <LogOut className="inline-block w-5 h-5 mr-2" /> Logout
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
                        <AlertDialogAction
                          onClick={performLogout}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              </>
            ) : !isLoggedIn && !isAdmin ? (
              <li>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 text-white text-base hover:text-blue-200 py-2",
                    location.pathname === "/login"
                      ? "underline font-semibold"
                      : ""
                  )}
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      )}
      <div className="flex items-center gap-4"></div>
    </nav>
  );
};

export default Navbar;
