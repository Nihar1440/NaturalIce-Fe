import { clearUserProfile, fetchUserProfile } from "@/features/user/userSlice";
import { AlertTriangle, ChevronDown, Mail } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const FormField = ({
  label,
  value,
  placeholder,
  isDropdown = false,
  readOnly = true,
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
        className="w-full bg-gray-100/80 border-transparent rounded-lg p-3 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
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
  const { profile, loading, error } = useSelector((state) => state.user);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserProfile({ accessToken }));
    } else {
      toast.error("You are not logged in. Please log in to view your profile.");
    }

    return () => {
      dispatch(clearUserProfile());
    };
  }, [dispatch, accessToken]);

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

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-lg">
          No profile data available. Please log in to view your profile.
        </p>
      </div>
    );
  }

  // Use a fallback for names to prevent errors if data is incomplete.
  const welcomeName = profile?.name?.split(" ")[0] || "User";
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
              Welcome,{" "}
              {welcomeName.charAt(0).toUpperCase() + welcomeName.slice(1)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Tue, 07 June 2022</p>
          </div>
        </header>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="h-28 bg-gradient-to-r from-blue-300 via-indigo-500 to-yellow-300 rounded-t-2xl relative" />
          <div className="p-6 sm:p-8">
            {/* Profile Info Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end">
              <img
                src={profile.avatarUrl || "https://i.imgur.com/34dFk2s.png"}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-gray-200"
              />
              <div className="flex-grow mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name.charAt(0).toUpperCase() + profile.name.slice(1)}
                </h2>
                <p className="text-gray-500 mt-1">{profile.email}</p>
              </div>
              <div className="mt-4 sm:mt-0"></div>
            </div>

            {/* Form Section */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField label="Full Name" value={profile.name} />
              <FormField label="Email" value={profile.email} />
              <FormField label="Address" value={profile.address} />
              <FormField label="Role" value={profile.role} />
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
                      {profile.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(profile.createdAt)}
                    </p>{" "}
                    {/* Used profile.createdAt */}
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full bg-blue-50 text-blue-700 font-semibold py-3 rounded-lg hover:bg-blue-100 transition-colors">
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
