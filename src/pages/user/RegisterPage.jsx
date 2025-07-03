import React, { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

// Shadcn UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const API_URL = import.meta.env.VITE_API_URL;

// Custom SweetAlert2-style modal component
const SweetModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Save",
  cancelText = "Cancel",
  type = "default",
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check size={48} className={getIconColor()} />;
      case "error":
        return <X size={48} className={getIconColor()} />;
      case "warning":
        return <AlertTriangle size={48} className={getIconColor()} />;
      default:
        return <Edit2 size={48} className={getIconColor()} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">{getIcon()}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
          <div className="mb-6">{children}</div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit form modal component
const EditAdminModal = ({ isOpen, onClose, onSave, adminData, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isSuperAdmin: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (adminData) {
      setFormData({
        email: adminData.email || "",
        password: "",
        isSuperAdmin: adminData.isSuperAdmin || false,
      });
    }
  }, [adminData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = () => {
    if (!formData.email.trim()) {
      toast.error("Validation Error", {
        description: "Email is required.",
      });
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Edit2 size={20} className="text-blue-600" />
            </div>
            <span>Edit Admin</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email Field */}
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
              className="mt-2"
            />
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="edit-password">Password</Label>
            <div className="relative mt-2">
              <Input
                id="edit-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="•••••••• (Leave blank to keep current)"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>

          {/* Super Admin Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-isSuperAdmin"
              name="isSuperAdmin"
              checked={formData.isSuperAdmin}
              onCheckedChange={(checked) =>
                handleChange({
                  target: {
                    name: "isSuperAdmin",
                    type: "checkbox",
                    checked: checked,
                  },
                })
              }
            />
            <Label
              htmlFor="edit-isSuperAdmin"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Assign as Super Admin
            </Label>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AdminManagement = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isSuperAdmin: false,
  });

  const [admins, setAdmins] = useState([
    { _id: "1", email: "admin1@example.com", isSuperAdmin: false },
    { _id: "2", email: "superAdmin@gmail.com", isSuperAdmin: true },
    { _id: "3", email: "admin@gmail.com", isSuperAdmin: false },
  ]);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  // Fetch admins on component mount
  useEffect(() => {
    checkSuperAdmin();
  }, []);

  const checkSuperAdmin = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/auth/check-superadmin`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        toast.error("Authentication Error", {
          description: "You are not authorized to view admin management.",
        });
        throw new Error("Not a super admin");
      }
      const data = await res.json();
      if (data.isSuperAdmin) {
        fetchAdmins();
      } else {
        toast.error("Access Denied", {
          description: "You do not have super admin privileges.",
        });
        setAdmins([]);
      }
    } catch (err) {
      console.error("Super admin check failed:", err);
      setAdmins([]);
    }
  };

  const fetchAdmins = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAdmins(data);
      } else {
        toast.error("Error", {
          description: data.message || "Failed to load admins.",
        });
        setAdmins([]);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error("Network Error", {
        description: "An error occurred while fetching admins.",
      });
      setAdmins([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Admin Registered", {
          description: "New admin user has been successfully created.",
        });
        setFormData({ email: "", password: "", isSuperAdmin: false });
        fetchAdmins();
      } else {
        throw new Error(data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Error Registering Admin", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setShowEditModal(true);
  };

  const handleEditSave = async (updatedData) => {
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_URL}/api/auth/users/${editingAdmin._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowEditModal(false);
        setEditingAdmin(null);
        toast.success("Admin Updated", {
          description: "Admin updated successfully!",
        });
        fetchAdmins();
      } else {
        throw new Error(data.message || "Failed to update admin.");
      }
    } catch (error) {
      toast.error("Update Failed", {
        description: error.message || "An error occurred while updating admin.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_URL}/api/auth/admin/${adminToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setShowDeleteConfirmDialog(false);
        setAdminToDelete(null);
        toast.success("Admin Deleted", {
          description: "Admin has been successfully deleted.",
        });
        fetchAdmins();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete admin.");
      }
    } catch (error) {
      toast.error("Delete Failed", {
        description: error.message || "An error occurred while deleting the admin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl px-3 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Admins</h1>
        </div>

        {/* Add Admin Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
            Add New Admin
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Field */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@example.com"
                  className="mt-2"
                />
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Super Admin Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSuperAdmin"
                name="isSuperAdmin"
                checked={formData.isSuperAdmin}
                onCheckedChange={(checked) =>
                  handleChange({
                    target: {
                      name: "isSuperAdmin",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <Label
                htmlFor="isSuperAdmin"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Assign as Super Admin
              </Label>
            </div>

            {/* Action Button */}
            <div className="flex">
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Adding Admin..." : "Add Admin"}
              </Button>
            </div>
          </div>
        </div>

        {/* Admins List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Admins List</h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin, index) => (
                  <tr key={admin._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          admin.isSuperAdmin
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {admin.isSuperAdmin ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors flex items-center space-x-1"
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(admin)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex items-center space-x-1"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {admins.map((admin, index) => (
              <div
                key={admin._id || index}
                className="p-6 border-b border-gray-200 last:border-b-0"
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {admin.email}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        admin.isSuperAdmin
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {admin.isSuperAdmin ? "Super Admin" : "Admin"}
                    </span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded text-sm hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(admin)}
                      className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {admins.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No admins found</p>
              <p className="text-gray-400 text-sm mt-2">
                Add your first admin using the form above
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {admins.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="bg-white rounded-lg shadow-sm border">
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                1
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditAdminModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAdmin(null);
        }}
        onSave={handleEditSave}
        adminData={editingAdmin}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle size={24} className="text-yellow-500" />
              <span>Are you sure?</span>
            </DialogTitle>
            <DialogDescription>
              You are about to delete <strong>{adminToDelete?.email}</strong>. This action cannot be undone!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirmDialog(false);
                  setAdminToDelete(null);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteConfirm}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600"
            >
              {loading ? "Deleting..." : "Yes, delete it!"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;
