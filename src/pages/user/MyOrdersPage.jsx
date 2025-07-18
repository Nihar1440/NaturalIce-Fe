import Loader from "@/component/common/Loader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cancelOrder, clearOrders, fetchMyOrders } from "@/features/order/orderSlice";
import { format } from "date-fns";
import {
  Eye,
  Package,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../components/ui/alert-dialog';
import { toast } from "sonner";
import TrackOrderDialog from "@/component/TrackOrderDialog";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getStatusClasses = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

const OrderItemDetails = ({ item }) => {
  const savings =
    item.originalPrice && item.originalPrice > item.price
      ? item.originalPrice - item.price
      : 0;

  return (
    <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg shadow-sm">
      <img
        src={item.image || "https://via.placeholder.com/60"}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      <div className="flex-grow">
        <h4 className="font-semibold text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
        <p className="text-sm text-gray-600">
          Price: {formatCurrency(item.price)}
        </p>
        {item.originalPrice && (
          <p className="text-xs text-gray-500">
            Original:{" "}
            <span className="line-through">
              {formatCurrency(item.originalPrice)}
            </span>
            {savings > 0 && (
              <span className="ml-1 text-green-600 font-medium">
                ({formatCurrency(savings)} Savings)
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, cancelLoading, cancelError } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchMyOrders(user?._id));
    }
    return () => {
      dispatch(clearOrders());
    };
  }, [dispatch,user]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCancelOrder = async () => {
    if (selectedOrderId) {
      try {
        await dispatch(cancelOrder(selectedOrderId)).unwrap();
        toast.success('Order cancelled successfully!');
      } catch (err) {
        toast.error(err || 'Failed to cancel order');
      }
      setSelectedOrderId(null);
    }
  };

  if (loading) {
    return <Loader message={"Loading Orders..."} />;
  }

  if (orders?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[60vh] bg-gray-50">
        <Package className="w-16 h-16 text-blue-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">No Orders Found</h2>
        <p className="text-gray-500 mt-2">
          It looks like you haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 mt-10 mb-6">
          Your Order History
        </h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="rounded-lg overflow-hidden shadow-md bg-white">
            <div className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Order ID
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Date
                    </TableHead>
                    <TableHead className="px-4 py-3 text-middle text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="px-4 py-3 text-middle text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Amount
                    </TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Items
                    </TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-100">
                  {orders?.map((order) => {
                    const orderDate = new Date(order.createdAt);
                    const numberOfItems = order.items ? order.items.length : 0;

                    return (
                      <TableRow
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="px-4 py-3 font-mono text-sm text-gray-700">
                          {order._id.substring(0, 30)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-600 text-left">
                          {format(orderDate, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-middle">
                          <span
                            className={`px-2 py-1 text-black rounded-full text-xs font-semibold ${getStatusClasses(
                              order.status
                            )}`}
                          >
                            {capitalizeFirstLetter(order?.status)}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-middle text-sm font-medium text-gray-800">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right text-sm text-gray-600">
                          {numberOfItems}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <div className="flex flex-wrap gap-2 justify-end">
                            <DialogTrigger asChild>
                              <button
                                onClick={() => handleViewDetails(order)}
                                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Details
                              </button>
                            </DialogTrigger>

                            {order.status?.toLowerCase() === "pending" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                    onClick={() => setSelectedOrderId(order._id)}
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Cancel
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel this order? This action cannot be undone.
                                    </AlertDialogDescription>
                                    {cancelError && <div className="text-red-500 text-sm">{cancelError}</div>}
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setSelectedOrderId(null)}>
                                      No, keep order
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      disabled={cancelLoading}
                                      onClick={handleCancelOrder}
                                    >
                                      {cancelLoading ? 'Cancelling...' : 'Yes, cancel order'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            {order.status?.toLowerCase() === "shipped" && (
                              <button
                                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                                onClick={() => {
                                  setSelectedOrderId(order._id);
                                  setTrackDialogOpen(true);
                                }}
                              >
                                <Truck className="w-3 h-3 mr-1" />
                                Track
                              </button>
                            )}

                            {(order.status?.toLowerCase() === "delivered" ||
                              order.status?.toLowerCase() === "completed") && (
                              <button
                                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                                onClick={() =>
                                  alert(`Reordering Order ID: ${order._id}`)
                                }
                              >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                Reorder
                              </button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogContent className="sm:max-w-[800px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle>
                    Order Details: {selectedOrder._id?.substring(0, 25)}
                  </DialogTitle>
                  <DialogDescription>
                    Details of your order placed on{" "}
                    {format(
                      new Date(selectedOrder.createdAt),
                      "MMMM d, yyyy 'at' hh:mm a"
                    )}
                    .
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Ordered Items
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedOrder.items.map((item, index) => (
                        <OrderItemDetails key={index} item={item} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Shipping Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <p className="text-gray-700">
                        <strong>Recipient:</strong>{" "}
                        {selectedOrder?.shippingAddress?.fullName ||
                          "Customer Name"}{" "}
                      </p>
                      <p className="text-gray-700">
                        <strong>Address:</strong>{" "}
                        {selectedOrder?.shippingAddress?.addressLine}
                      </p>
                      <p className="text-gray-700">
                        <strong>Phone:</strong>{" "}
                        {selectedOrder?.shippingAddress?.phoneNumber}
                      </p>
                      <p className="text-gray-700">
                        <strong>City:</strong>{" "}
                        {selectedOrder?.shippingAddress?.city}
                      </p>
                      <p className="text-gray-700">
                        <strong>Postal Code:</strong>{" "}
                        {selectedOrder?.shippingAddress?.postalCode}
                      </p>
                      <p className="text-gray-700">
                        <strong>State</strong>{" "}
                        {selectedOrder?.shippingAddress?.state}
                      </p>
                      <p className="text-gray-700">
                        <strong>Country</strong>{" "}
                        {selectedOrder?.shippingAddress?.country}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Payment Details
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <p className="text-gray-700">
                        <strong>Method:</strong> Credit Card (**** **** ****
                        1234){" "}
                      </p>
                      <p className="text-gray-700">
                        <strong>Transaction ID:</strong> TXN123456789{" "}
                      </p>
                      <p className="text-gray-700">
                        <strong>Total Paid:</strong>{" "}
                        {formatCurrency(selectedOrder.totalAmount)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Order Timeline
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>
                          Order Placed:{" "}
                          {format(
                            new Date(selectedOrder.createdAt),
                            "MMMM d, yyyy 'at' hh:mm a"
                          )}
                        </li>
                        <li>Order Shipped: N/A </li>
                        <li>Order Delivered: N/A </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md">
                      Close
                    </button>
                  </DialogClose>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        <TrackOrderDialog
          open={trackDialogOpen}
          onOpenChange={setTrackDialogOpen}
          orderId={selectedOrderId}
        />
      </div>
    </div>
  );
};

export default MyOrdersPage;
