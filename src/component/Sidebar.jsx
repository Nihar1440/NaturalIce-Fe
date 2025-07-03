import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  MessageSquare,
  UserCog,
  Users,
  BarChart,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const navLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-3" />,
    },
    {
      name: "Manage Products",
      path: "/admin/manage-products",
      icon: <Boxes className="h-5 w-5 mr-3" />,
    },
    {
      name: "Manage Orders",
      path: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5 mr-3" />,
    },
    {
      name: "Manage Messages",
      path: "/admin/messages",
      icon: <MessageSquare className="h-5 w-5 mr-3" />,
    },
    {
      name: "Manage Categories",
      path: "/admin/manage-categories",
      icon: <UserCog className="h-5 w-5 mr-3" />,
    },
    {
      name: "Manage Users",
      path: "/admin/manage-users",
      icon: <Users className="h-5 w-5 mr-3" />,
    },
  ];

  return (
    <>
      <aside
        className={`w-64 bg-blue-700 text-white p-4 shadow-xl lg:shadow-md
                    transition-transform duration-300 ease-in-out z-20
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    fixed top-0 left-0 h-screen overflow-y-hidden
                    lg:static lg:translate-x-0 lg:h-full lg:flex-shrink-0 lg:overflow-y-hidden`}
      >
        <h3 className="text-xl font-bold mb-6 text-center lg:text-left pt-4 lg:pt-0">
          E-Commerce Admin
        </h3>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name} className="mb-2">
                <Link
                  to={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center py-2 px-3 rounded transition duration-200
                    ${
                      location.pathname.startsWith(link.path)
                        ? "bg-blue-600 font-semibold"
                        : "hover:bg-gray-700"
                    }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar; 