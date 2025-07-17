import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserProfile,
} from "@/features/auth/authSlice";
import { toast } from "sonner";
import { AlertTriangle, UserPen } from "lucide-react";

// Reusable FormField component
const FormField = ({
  label,
  value,
  placeholder,
  onChange,
  name,
  editable = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type="text"
        name={name}
        value={value || ""}
        placeholder={placeholder}
        readOnly={!editable}
        onChange={onChange}
        className={`w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 ${
          editable
            ? "bg-white border-gray-300"
            : "bg-gray-100/80 border-transparent cursor-default"
        }`}
      />
    </div>
  </div>
);

const ProfileLoadingSkeleton = () => (
  <div className="animate-pulse">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
    {/* Card Skeleton */}
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="h-36 bg-gray-200 rounded-t-2xl"></div>
      <div className="p-8">
        <div className="flex items-end -mt-20">
          <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white"></div>
          <div className="flex-grow ml-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-11 bg-gray-200 rounded-lg w-24"></div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const EditProfilePage = () => {
  const dispatch = useDispatch();
  const { user, accessToken, loading, error } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(getUserProfile({ accessToken }));
    } else if (!accessToken) {
      toast.error("You are not logged in. Please log in to view your profile.");
    }
   
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (isEditing && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  };

  const handleSave = async () => {
    if (!user?._id) {
      toast.error("User ID not found. Cannot update profile.");
      return;
    }
    if (!accessToken) {
      toast.error("Authentication token missing. Please log in.");
      return;
    }

    const resultAction = await dispatch(
      updateUserProfile({ userId: user._id, userData: formData })
    );

    if (updateUserProfile.fulfilled.match(resultAction)) {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error(error || "Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50/50 min-h-screen font-sans mt-12">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <ProfileLoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error && !accessToken) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">
          Failed to Load Profile
        </h2>
        <p className="text-gray-500 mt-2">Error: {error}</p>
        <p className="text-gray-500 mt-1">
          Please try again later or ensure you are logged in.
        </p>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-lg">
          No profile data available. Please log in to view and edit your
          profile.
        </p>
      </div>
    );
  }

  const welcomeName = user?.name?.split(" ")[0] || "User";

  return (
    <div className="bg-gray-50/50 font-sans mt-12">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              {isEditing
                ? "Edit Profile"
                : `Welcome, ${
                    welcomeName.charAt(0).toUpperCase() + welcomeName.slice(1)
                  }`}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your profile information
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {!isEditing ? (
              <button
                onClick={handleEditToggle}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <UserPen className="mr-2 h-5 w-5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="h-28 bg-gradient-to-r from-blue-300 via-indigo-500 to-yellow-300 rounded-t-2xl relative" />
          <div className="p-6 sm:p-8">
            {/* Profile Info Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end">
              <img
                src={user.avatarUrl || "https://i.imgur.com/34dFk2s.png"}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-gray-200"
              />
              <div className="flex-grow mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                </h2>
                <p className="text-gray-500 mt-1">{user.email}</p>
              </div>
              <div className="mt-4 sm:mt-0"></div>
            </div>

            {/* Form Section */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                editable={isEditing}
              />
              <FormField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                editable={isEditing}
              />
              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                editable={isEditing}
              />
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={user.role || ""}
                  readOnly
                  className="w-full bg-gray-100/80 border-transparent rounded-lg p-3 text-gray-500 cursor-default"
                />
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-4">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
