import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchNotifications, markNotificationAsRead, deleteUserNotification } from "../features/notification/notificationSlice";
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from "lucide-react";

const NotificationBell = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { notifications, unreadCount, loading } = useSelector(state => state.notifications);
    console.log('notifications', notifications)

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchNotifications(user._id));
        }
    }, [dispatch, user?._id]);

    const handleMarkAsRead = (notificationId) => {
        dispatch(markNotificationAsRead(notificationId));
    };

    const handleDelete = (e, notificationId) => {
        e.stopPropagation();
        dispatch(deleteUserNotification(notificationId));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {loading ? (
                     <DropdownMenuItem className="flex justify-center items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                     </DropdownMenuItem>
                ) : notifications.length > 0 ? (
                    notifications.slice(0, 10).map((notification) => ( // Show latest 10
                        <DropdownMenuItem
                            key={notification._id}
                            className={`flex items-start gap-2 cursor-pointer ${!notification.isRead ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                        >
                            <div className="flex-grow">
                                <p className="font-semibold">{notification.title}</p>
                                <p className="text-sm text-gray-600">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={(e) => handleDelete(e, notification._id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem>No new notifications.</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell; 