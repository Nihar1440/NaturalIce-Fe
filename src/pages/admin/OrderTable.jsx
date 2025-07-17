// src/component/admin/OrderTable.jsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Truck } from "lucide-react";

const statusClasses = {
  Delivered: "bg-green-300 text-green-800 border-green-200",
  Pending: "bg-yellow-300 text-yellow-800 border-yellow-200",
  Processing: "bg-blue-300 text-blue-800 border-blue-200",
  Shipped: "bg-purple-300 text-purple-800 border-purple-200",
  Cancelled: "bg-red-300 text-red-800 border-red-200",
};

function getStatusBadge(status) {
  return (
    <span
      className={`px-3 py-2 rounded-full text-xs font-semibold border ${
        statusClasses[status] || "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

const OrderTable = ({ orders, onViewDetails, onUpdateStatus }) => (
  <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
    <Table className="min-w-full bg-white">
      <TableHeader>
        <TableRow className="bg-gray-800">
          <TableHead className="px-6 py-4 font-medium text-white">Order ID</TableHead>
          <TableHead className="px-6 py-4 font-medium text-white">Name</TableHead>
          <TableHead className="px-6 py-4 font-medium text-white">Email</TableHead>
          <TableHead className="px-6 py-4 font-medium text-white">Date</TableHead>
          <TableHead className="px-6 py-4 font-medium text-white">Total Amount</TableHead>
          <TableHead className="px-6 py-4 font-medium text-white">Items</TableHead>
          <TableHead className="px-6 py-4 font-medium text-white">Status</TableHead>
          <TableHead className="px-6 py-4 font-medium text-white">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id} className="border-b last:border-b-0 hover:bg-gray-200 transition-colors">
            <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">{order._id}</TableCell>
            <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">{order?.user?.name}</TableCell>
            <TableCell className="px-6 py-4 text-sm text-gray-700">{order?.user?.email}</TableCell>
            <TableCell className="px-6 py-4 text-sm text-gray-700">{new Date(order.createdAt).toLocaleString()}</TableCell>
            <TableCell className="px-6 py-4 text-sm text-gray-700">{order.totalAmount} AED</TableCell>
            <TableCell className="px-6 py-4 text-sm text-gray-700">{order.items.length}</TableCell>
            <TableCell className="px-6 py-4">{getStatusBadge(order.status)}</TableCell>
            <TableCell className="px-6 py-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" onClick={() => onViewDetails(order)}>
                  <Eye className="h-4 w-4 mr-2" /> View
                </Button>
                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-800 hover:bg-green-50" onClick={() => onUpdateStatus(order._id, order.status)}>
                  <Truck className="h-4 w-4 mr-2" /> Update Status
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default OrderTable;