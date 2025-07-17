import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUser } from "../../features/user/userSlice";
import { Button } from "@/components/ui/button";
import { Search, RotateCw, Trash2, Eye } from "lucide-react";
import Loader from "@/component/common/Loader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);

  const [searchInput, setSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  console.log('userToDelete', userToDelete)

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmDialog(false);
    if (!userToDelete) return;

    try {
      await dispatch(
        deleteUser({ id: userToDelete._id, accessToken })
      ).unwrap();
      toast.success("User deleted successfully");
      // Optionally, refresh the user list
      dispatch(fetchAllUsers(accessToken));
    } catch (err) {
      // Optionally, show a toast here for error
      toast.error(typeof err === "string" ? err : err.message || String(err));
    }
    setUserToDelete(null);
  };

  const accessToken =
    useSelector((state) => state.auth?.user?.accessToken) ||
    localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchAllUsers(accessToken));
    }
  }, [dispatch, accessToken]);
  const filteredUsers = users?.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-6">
            Users Management
          </h2>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  className="flex-1 rounded-r-none border-r-0 border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-l-none px-4"
                  onClick={() => {}} // No-op for now
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Search</span>
                </Button>
              </div>
            </div>
            <div>
              <Button
                onClick={() => setSearchInput("")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Users Content */}
        <div className="p-4 lg:p-6">
          {loading ? (
            <Loader message={"Loading Users..."} />
          ) : filteredUsers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-xl font-semibold mb-2">No users found</p>
              <p className="text-md">Try adjusting your search</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-800 text-white text-left">
                      <th className="px-6 py-4 font-medium">Avatar</th>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers?.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <img
                            src={user.avatar || "/default-avatar.png"}
                            alt={user.name}
                            className="w-12 h-12 object-cover rounded-full shadow-sm"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-gray-700 capitalize">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {user.isActive ? (
                            <span className="text-green-600 font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            {/* View Button with Tooltip */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                  onClick={() => handleViewUser(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View User</p>
                              </TooltipContent>
                            </Tooltip>
                            {/* Delete Button with Tooltip */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                  onClick={() => handleDelete(user)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete User</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredUsers?.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center"
                  >
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      className="w-14 h-14 object-cover rounded-full shadow-sm mr-4"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {user.email}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="capitalize">{user.role}</span>
                        <span
                          className={
                            user.isActive
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 ml-2"
                      onClick={() => handleViewUser(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 ml-2"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              {selectedUser ? (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedUser.avatar || "/default-avatar.png"}
                      alt={selectedUser.name}
                      className="w-16 h-16 object-cover rounded-full shadow"
                    />
                    <div>
                      <div className="font-bold text-lg">
                        {selectedUser.name}
                      </div>
                      <div className="text-gray-500">{selectedUser.email}</div>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">Role:</span>{" "}
                    <span className="capitalize">{selectedUser.role}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    {selectedUser.isActive ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactive
                      </span>
                    )}
                  </div>
                  {/* Add more fields as needed */}
                  <div>
                    <span className="font-semibold">ID:</span>{" "}
                    {selectedUser._id}
                  </div>
                  {/* Example: <div><span className="font-semibold">Phone:</span> {selectedUser.phone}</div> */}
                  {/* Example: <div><span className="font-semibold">Created:</span> {new Date(selectedUser.createdAt).toLocaleString()}</div> */}
                </div>
              ) : (
                <div>No user selected.</div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showDeleteConfirmDialog}
        onOpenChange={setShowDeleteConfirmDialog}
      >
        <AlertDialogContent className="w-96">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium text-foreground">
                "{userToDelete?.name}"
              </span>{" "}
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirmDialog(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageUsers;
