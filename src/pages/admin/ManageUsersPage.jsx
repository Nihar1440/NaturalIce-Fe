import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/user/userSlice'; // Import the thunk
import { toast } from 'sonner';
import Loader from '@/component/common/Loader';

const ManageUsersPage = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user); // Access the 'user' slice state
  const accessToken = localStorage.getItem('accessToken'); // Get accessToken for API call

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUsers(accessToken));
    } else {
      toast.error("Authentication required", {
        description: "Please log in to view user data."
      });
    }
  }, [dispatch, accessToken]);

  if (loading) {
    return <Loader message={"Loading Users..."}/>
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">ID</th>
                <th className="px-4 py-2 border-b text-left">Email</th>
                <th className="px-4 py-2 border-b text-left">Name</th>
                <th className="px-4 py-2 border-b text-left">Role</th>
                <th className="px-4 py-2 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 border-b text-sm">{user._id}</td>
                  <td className="px-4 py-2 border-b text-sm">{user.email}</td>
                  <td className="px-4 py-2 border-b text-sm">{user.name || 'N/A'}</td>
                  <td className="px-4 py-2 border-b text-sm">{user.isSuperAdmin ? 'Super Admin' : 'User'}</td>
                  <td className="px-4 py-2 border-b text-sm">
                    {/* Add edit/delete buttons here */}
                    <button className="text-blue-600 hover:underline mr-2">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage; 