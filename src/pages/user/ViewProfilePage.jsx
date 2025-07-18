import { getUserProfile, updateUserProfile } from "@/features/auth/authSlice";
import { AlertTriangle, ChevronDown, Mail, UserPen } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const FormField = ({
  label,
  value,
  placeholder,
  isDropdown = false,
  readOnly = true,
  name,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        readOnly={readOnly}
        name={name}
        onChange={onChange}
        className={`w-full ${
          readOnly
            ? "bg-gray-100/80 border-transparent cursor-pointer text-gray-500"
            : "bg-white border-gray-300 text-gray-700"
        } rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white`}
      />
      {isDropdown && (
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      )}
    </div>
  </div>
);

// A skeleton loader to show while the profile data is being fetched.
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

const ViewProfilePage = () => {
  const dispatch = useDispatch();
  const { user, accessToken, loading, error } = useSelector(
    (state) => state.auth
  );

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (accessToken) {
      dispatch(getUserProfile({ accessToken }));
    } else {
      toast.error("You are not logged in. Please log in to view your profile.");
    }
  }, [dispatch, accessToken]);

  // Sync formData and imagePreview with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
      });
      setImagePreview(user.avatar || "https://i.imgur.com/34dFk2s.png");
      setSelectedImage(null);
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!user?._id) {
      toast.error("User ID not found. Cannot update profile.");
      return;
    }
    if (!accessToken) {
      toast.error("Authentication token missing. Please log in.");
      return;
    }

    let payload;
    if (selectedImage) {
      payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("address", formData.address);
      payload.append("avatar", selectedImage);
    } else {
      payload = formData;
    }

    const resultAction = await dispatch(
      updateUserProfile({ userId: user._id, userData: payload })
    );
    if (updateUserProfile.fulfilled.match(resultAction)) {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error(error || "Failed to update profile. Please try again.");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      address: user.address || "",
    });
    setImagePreview(user.avatar || "https://i.imgur.com/34dFk2s.png");
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-50/50 min-h-screen font-sans">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <ProfileLoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-lg">
          No profile data available. Please log in to view your profile.
        </p>
      </div>
    );
  }

  const formatTimeAgo = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1)
      return (
        Math.floor(interval) +
        " year" +
        (Math.floor(interval) === 1 ? "" : "s") +
        " ago"
      );
    interval = seconds / 2592000;
    if (interval > 1)
      return (
        Math.floor(interval) +
        " month" +
        (Math.floor(interval) === 1 ? "" : "s") +
        " ago"
      );
    interval = seconds / 86400;
    if (interval > 1)
      return (
        Math.floor(interval) +
        " day" +
        (Math.floor(interval) === 1 ? "" : "s") +
        " ago"
      );
    interval = seconds / 3600;
    if (interval > 1)
      return (
        Math.floor(interval) +
        " hour" +
        (Math.floor(interval) === 1 ? "" : "s") +
        " ago"
      );
    interval = seconds / 60;
    if (interval > 1)
      return (
        Math.floor(interval) +
        " minute" +
        (Math.floor(interval) === 1 ? "" : "s") +
        " ago"
      );
    return (
      Math.floor(seconds) +
      " second" +
      (Math.floor(seconds) === 1 ? "" : "s") +
      " ago"
    );
  };

  return (
    <div className="bg-gray-50/50 font-sans mt-16">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              {isEditing
                ? "Edit Profile"
                : `Welcome, ${
                    formData.name.split(" ")[0]?.charAt(0).toUpperCase() +
                      formData.name.split(" ")[0]?.slice(1) || "User"
                  }`}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Tue, 07 June 2022</p>
          </div>
          <div className="mt-4 sm:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
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
                  onClick={handleCancel}
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
              <div className="relative">
                <img
                  src={imagePreview}
                  alt={formData.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-gray-200"
                />
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <span className="text-xs text-blue-600">Edit</span>
                  </label>
                )}
              </div>
              <div className="flex-grow mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData.name.charAt(0).toUpperCase() +
                    formData.name.slice(1)}
                </h2>
                <p className="text-gray-500 mt-1">{formData.email}</p>
              </div>
              <div className="mt-4 sm:mt-0"></div>
            </div>

            {/* Form Section */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField
                label="Full Name"
                value={formData.name}
                name="name"
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
              <FormField
                label="Email"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
              <FormField
                label="Address"
                value={formData.address}
                name="address"
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
              <FormField label="Role" value={user.role} readOnly={true} />
            </div>

            {/* Email Address Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                My email Address
              </h3>
              <div className="mt-4 p-4 bg-blue-50/50 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Mail size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">
                      {formData.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-blue-50 text-blue-700 font-semibold py-3 rounded-lg hover:bg-blue-100 transition-colors"
                disabled
              >
                + Add Email Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;
