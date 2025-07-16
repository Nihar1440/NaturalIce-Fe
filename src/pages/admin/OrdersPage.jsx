// src/pages/admin/OrdersPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Loader from "@/component/common/Loader";
import OrderCardList from "./OrderCardList";
import OrderTable from "./OrderTable";
import OrderFilters from "./OrderFilters";
import OrderSummary from "./OrderSummary";
import OrderDetailsDialog from "./OrderDetailsDialog";
import OrderStatusDialog from "./OrderStatusDialog";
import { fetchOrders, updateOrderStatus } from "@/features/order/orderSlice";
import { PackageOpen } from "lucide-react";

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusOrderId, setStatusOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Handlers
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };

  const handleUpdateStatus = (orderId, currentStatus) => {
    setStatusOrderId(orderId);
    setNewStatus(currentStatus);
    setShowStatusDialog(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterDate("");
    dispatch(fetchOrders());
  };

  return (
    <div className="bg-gray-100 min-h-screen p-2">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-6">
            Orders Management
          </h2>
          <p className="mt-1 opacity-90">Track and manage customer orders</p>
        </div>

        <div className="p-4 lg:p-6">
          <OrderFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onSearch={() => dispatch(fetchOrders())}
            onReset={handleResetFilters}
            totalOrders={orders.length}
          />

          {/* Content */}
          {loading ? (
            <Loader message={"Loading Orders..."} />
          ) : orders?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <PackageOpen className="h-16 w-16 mb-4 text-gray-400" />
              <p className="text-xl font-semibold mb-2">No orders found</p>
              <p className="text-md text-center">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <OrderTable
                orders={orders}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
              />
              <OrderCardList
                orders={orders}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
              />
              <OrderSummary orders={orders} />
            </>
          )}
        </div>
      </div>

      <OrderDetailsDialog
        open={showOrderDetailsDialog}
        onOpenChange={setShowOrderDetailsDialog}
        order={selectedOrder}
      />

      <OrderStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        orderId={statusOrderId}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        onUpdate={async () => {
          if (!newStatus) return;
          try {
            await dispatch(
              updateOrderStatus({
                orderId: statusOrderId,
                status: newStatus,
              })
            );
            toast.success("Order status updated successfully!");
            setShowStatusDialog(false);
            dispatch(fetchOrders());
          } catch {
            toast.error("Failed to update status");
          }
        }}
      />
    </div>
  );
};

export default OrdersPage;
