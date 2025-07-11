import { Toaster } from "@/components/ui/sonner";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import ProtectedRoute from "./component/ProtectedRoute";
import AboutAllFixPage from "./pages/user/AboutAllFixPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import CreateSuperAdminPage from "./pages/admin/CreateSuperAdminPage";
import DashboardHomePage from "./pages/admin/DashboardHomePage";
import HomePage from "./pages/user/HomePage";
import InvoicePage from "./pages/user/InvoicePage";
import LoginPage from "./pages/user/LoginPage";
import ManageProductsPage from "./pages/admin/ManageProductsPage";
import MessagesPage from "./pages/admin/MessagesPage";
import OrderConfirmation from "./pages/user/OrderConfirmation";
import OrdersPage from "./pages/admin/OrdersPage";
import PaymentPage from "./pages/user/PaymentPage";
import RegisterPage from "./pages/user/RegisterPage";
import WishlistPage from "./pages/user/WishlistPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCategory from "./pages/admin/ManageCategory";
import RequestResetPasswordPage from "./pages/user/RequestResetPasswordPage";
import SetNewPasswordPage from "./pages/user/SetNewPasswordPage";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import SuccessPage from "./pages/user/SuccessPage";
import ErrorPage from "./pages/user/ErrorPage";
import ViewProfilePage from "./pages/user/ViewProfilePage";
import EditProfilePage from "./pages/user/EditProfilePage";
import MyOrdersPage from "./pages/user/MyOrdersPage";
import ShippingAddressPage from "./pages/user/ShippingAddressPage";
import ChangePasswordPage from "./pages/user/ChangePasswordPage";
import ContactForm from "./component/ContactForm";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCartPage = location.pathname === "/cart";
  const isProductDetailsPage = location.pathname.startsWith("/product/");
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isRequestResetPasswordPage = location.pathname === "/forgot-password";
  const isSetNewPasswordPage = location.pathname.startsWith("/reset-password/");
  const isCheckoutPage = location.pathname === "/checkout";
  const isProfileRoute = location.pathname.startsWith("/profile");
  const isWishlistRoute = location.pathname === "/wishlist";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100">
      {!isAdminRoute &&
        !isLoginPage &&
        !isRegisterPage &&
        !isRequestResetPasswordPage &&
        !isSetNewPasswordPage &&
        !isCheckoutPage && <Navbar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/forgot-password"
            element={<RequestResetPasswordPage />}
          />
          <Route
            path="/forgot-password/:token"
            element={<SetNewPasswordPage />}
          />
          <Route path="/create-superadmin" element={<CreateSuperAdminPage />} />
          <Route path="/about" element={<AboutAllFixPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/invoice" element={<InvoicePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/contactUs" element={<ContactForm />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          {/* <Route path="/add-product" element={<AddProductPage />} /> */}

          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<ErrorPage />} />

          <Route
            path="/profile/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="view" element={<ViewProfilePage />} />
                  <Route path="edit" element={<EditProfilePage />} />
                  <Route path="orders" element={<MyOrdersPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="shipping" element={<ShippingAddressPage />} />
                  {/* <Route
                    path="payment-methods"
                    element={<PaymentMethodsPage />}
                  /> */}
                  <Route
                    path="change-password"
                    element={<ChangePasswordPage />}
                  />
                  <Route index element={<ViewProfilePage />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHomePage />} />
            <Route path="dashboard" element={<DashboardHomePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="manage-products" element={<ManageProductsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="manage-categories" element={<ManageCategory />} />
            <Route
              path="manage-users"
              element={
                <div className="p-4">
                  Manage Users Placeholder - Please create ManageUsersPage
                  component
                </div>
              }
            />
          </Route>
        </Routes>
      </div>

      {!isAdminRoute &&
        !isCartPage &&
        !isProductDetailsPage &&
        !isLoginPage &&
        !isRegisterPage &&
        !isRequestResetPasswordPage &&
        !isSetNewPasswordPage &&
        !isCheckoutPage &&
        !isWishlistRoute &&
        !isProfileRoute && <Footer />}
      <Toaster />
    </div>
  );
};

export default App;
