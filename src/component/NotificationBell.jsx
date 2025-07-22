// components/NotificationBell.jsx

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  import { Bell, Trash2, Loader2 } from "lucide-react";
  import { useDispatch, useSelector } from "react-redux";
  import { useEffect } from "react";
  import {
    fetchNotifications,
    markNotificationAsRead,
    deleteUserNotification,
  } from "../features/notification/notificationSlice";
  import { formatDistanceToNow } from "date-fns";
  
  const NotificationBell = () => {
    const dispatch = useDispatch();
  
    const { user } = useSelector((state) => state.auth);
    const { notifications, unreadCount, loading } = useSelector(
        (state) => state.notifications
    );
    console.log('notifications', notifications)
  
    // Fetch user-specific notifications on mount
    useEffect(() => {
      if (user?._id) {
        dispatch(fetchNotifications(user._id));
      }
    }, [dispatch, user?._id]);
  
    // Mark notification as read
    const handleMarkAsRead = (id) => {
      dispatch(markNotificationAsRead(id));
    };
  
    // Delete notification
    const handleDelete = (e, id) => {
      e.stopPropagation();
      dispatch(deleteUserNotification(id));
    };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
  
        <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
  
          {loading ? (
            <DropdownMenuItem className="flex justify-center items-center text-sm text-gray-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </DropdownMenuItem>
          ) : notifications.length > 0 ? (
            notifications.slice(0, 10).map((notification) => {
              const { _id, title, message, isRead, createdAt } = notification;
  
              return (
                <DropdownMenuItem
                  key={_id}
                  className={`flex items-start gap-2 px-2 py-2 rounded-md transition cursor-pointer ${
                    !isRead ? "bg-blue-200 hover:bg-blue-300" : "hover:bg-muted"
                  }`}
                  onClick={() => !isRead && handleMarkAsRead(_id)}
                >
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{title}</p>
                    <p className="text-xs text-gray-600">{message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </p>
                  </div>
  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0 text-gray-500 hover:text-red-500"
                    onClick={(e) => handleDelete(e, _id)}
                    aria-label="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuItem>
              );
            })
          ) : (
            <DropdownMenuItem className="text-sm text-gray-500 justify-center">
              No new notifications.
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  export default NotificationBell;
  