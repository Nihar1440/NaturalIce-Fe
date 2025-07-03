// File: src/pages/OrdersPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Search,
  RotateCw,
  FileText,
  Calendar,
  PackageOpen,
  Eye,
  Package,
  User,
  DollarSign,
  Clock,
  Filter,
  X,
  Truck,
  Check,
  Ban,
  Loader,
  ClipboardList,
  MapPin,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_URL = import.meta.env.VITE_API_URL;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const orderDetailsRef = useRef(null);

  // Dummy data for development (replace with actual API call)
  const dummyOrders = [
    {
      _id: "ORD-001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      date: "2024-03-15T10:30:00Z",
      items: [
        { name: "Ice Cubes - Regular", quantity: 5, price: 10 },
        { name: "Ice Cubes - Large", quantity: 2, price: 15 },
      ],
      total: 80,
      status: "Delivered",
      deliveryAddress: "123 Main St, Dubai, UAE",
    },
    {
      _id: "ORD-002",
      customerName: "Alice Smith",
      customerEmail: "alice@example.com",
      date: "2024-03-14T14:20:00Z",
      items: [{ name: "Crushed Ice", quantity: 10, price: 8 }],
      total: 80,
      status: "Processing",
      deliveryAddress: "456 Business Bay, Dubai, UAE",
    },
    {
      _id: "ORD-003",
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      date: "2024-03-13T09:15:00Z",
      items: [
        { name: "Ice Blocks", quantity: 3, price: 25 },
        { name: "Ice Cubes - Small", quantity: 8, price: 6 },
      ],
      total: 123,
      status: "Pending",
      deliveryAddress: "789 Jumeirah, Dubai, UAE",
    },
    {
      _id: "ORD-004",
      customerName: "Sarah Wilson",
      customerEmail: "sarah@example.com",
      date: "2024-03-12T16:45:00Z",
      items: [{ name: "Premium Ice Cubes", quantity: 15, price: 12 }],
      total: 180,
      status: "Shipped",
      deliveryAddress: "321 Marina, Dubai, UAE",
    },
    {
      _id: "ORD-005",
      customerName: "Mike Brown",
      customerEmail: "mike@example.com",
      date: "2024-03-11T11:30:00Z",
      items: [{ name: "Dry Ice", quantity: 2, price: 50 }],
      total: 100,
      status: "Cancelled",
      deliveryAddress: "654 Downtown, Dubai, UAE",
    },
  ];

  useEffect(() => {
    // In production, use actual API call
    // const accessToken = localStorage.getItem('accessToken');
    // if (!accessToken) {
    //   Swal.fire('Authentication Required', 'Please login to access this page', 'error')
    //     .then(() => (window.location.href = '/login'));
    //   return;
    // }

    // const socket = io(API_URL, {
    //   extraHeaders: { Authorization: `Bearer ${accessToken}` },
    // });
    // socket.on('newOrder', fetchOrders);
    // socket.on('orderDeleted', fetchOrders);
    // socket.on('orderUpdated', fetchOrders);

    // fetchOrders();
    // return () => socket.disconnect();

    // For demo, use dummy data
    setLoading(true);
    setTimeout(() => {
      setOrders(dummyOrders);
      setLoading(false);
    }, 500);
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    // const accessToken = localStorage.getItem('accessToken');

    // const queryParams = new URLSearchParams();
    // if (searchTerm) {
    //   queryParams.append('search', searchTerm);
    // }
    // if (filterStatus !== 'All') {
    //   queryParams.append('status', filterStatus);
    // }
    // if (filterDate) {
    //   queryParams.append('date', filterDate);
    // }

    // fetch(`${API_URL}/api/orders?${queryParams.toString()}`, {
    //   headers: { Authorization: `Bearer ${accessToken}` },
    // })
    //   .then((res) => res.json())
    //   .then(setOrders)
    //   .catch((err) => console.error('Failed to fetch orders:', err))
    //   .finally(() => setLoading(false));

    // For demo, filter dummy data
    let filtered = dummyOrders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    if (filterDate) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.date).toISOString().split("T")[0] === filterDate
      );
    }

    setTimeout(() => {
      setOrders(filtered);
      setLoading(false);
    }, 300);
  };

  const handleSearch = () => {
    fetchOrders();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterDate("");
    setOrders(dummyOrders);
  };

  const exportToPdf = () => {
    toast.info("Exporting", { description: "Generating PDF report..." });
    // Implement PDF export logic
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    // This example uses a simple prompt, consider a more robust UI like a Select for next status
    const { value: newStatus } = await toast.prompt("Update Order Status", {
      description: "Please select a new status for the order.",
      inputOptions: {
        Pending: "Pending",
        Processing: "Processing",
        Shipped: "Shipped",
        Delivered: "Delivered",
        Cancelled: "Cancelled",
      },
      inputValue: currentStatus,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Please select a status!";
        }
      },
    });

    if (newStatus) {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error("Authentication Error", { description: "Please login to update status." });
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to update order status');
        }

        toast.success("Status Updated", { description: "Order status updated successfully!" });
        fetchOrders(); // Re-fetch orders to reflect changes
      } catch (err) {
        console.error("Error updating status:", err);
        toast.error("Error Updating Status", { description: err.message || 'An error occurred while updating order status.' });
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Delivered: "bg-green-100 text-green-800 border-green-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Processing: "bg-blue-100 text-blue-800 border-blue-200",
      Shipped: "bg-purple-100 text-purple-800 border-purple-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold border ${
          statusClasses[status] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {status}
      </span>
    );
  };

  const handleExportPdf = async () => {
    if (!orderDetailsRef.current || !selectedOrder) {
      toast.error("Export Failed", {
        description: "No order details to export.",
      });
      return;
    }

    setIsExporting(true);
    let printContent = null;

    try {
      printContent = document.createElement('div');
      printContent.className = 'p-6 bg-white';

      printContent.innerHTML = `
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 24px; color: #1f2937;">Order Details - <span style="color: #2563eb;">${selectedOrder._id}</span></h2>
        
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Customer Information</h3>
          <p><strong>Name:</strong> ${selectedOrder.customerName}</p>
          <p><strong>Email:</strong> ${selectedOrder.customerEmail}</p>
          <p><strong>Order Date:</strong> ${new Date(selectedOrder.date).toLocaleString()}</p>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Delivery Address</h3>
          <p>${selectedOrder.deliveryAddress}</p>
        </div>
        
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Order Items</h3>
          <ul style="list-style: none; padding: 0;">
            ${selectedOrder.items && selectedOrder.items.length > 0 ?
              selectedOrder.items.map((item) => `
                <li style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; margin-bottom: 12px;">
                  <span style="font-weight: 500; color: #1f2937;">${item.name}</span>
                  <span style="color: #4b5563; font-size: 14px;">
                    ${item.quantity} x ${item.price.toFixed(2)} AED = <span style="font-weight: 600;">${(item.quantity * item.price).toFixed(2)} AED</span>
                  </span>
                </li>
              `).join('')
            : '<li>No items found for this order.</li>'}
          </ul>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 20px; font-weight: bold; margin-bottom: 12px;">
            <span style="color: #1f2937;">Order Total:</span>
            <span style="color: #2563eb;">${selectedOrder.total} AED</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 18px;">
            <span style="font-weight: 600; color: #1f2937;">Current Status:</span>
            <span style="padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: bold; ${getStatusBadge(selectedOrder.status).replace(/bg-(\w+)-\d+/, 'background-color: var(--color-$1-100);').replace(/text-(\w+)-\d+/, 'color: var(--color-$1-800);')}"
            >
              ${selectedOrder.status}
            </span>
          </div>
        </div>
      `;
      document.body.appendChild(printContent);

      const canvas = await html2canvas(printContent, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Order_Details_${selectedOrder._id}.pdf`);
      toast.success("PDF Exported", {
        description: `Order details for ${selectedOrder._id} saved as PDF.`,
      });
    } finally {
      if (printContent && printContent.parentNode) {
        document.body.removeChild(printContent);
      }
      setIsExporting(false);
    }
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
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex">
                <Input
                  type="text"
                  placeholder="Search by Order ID, customer name, or email..."
                  className="flex-1 rounded-r-none border-r-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <Button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-l-none px-4"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Search</span>
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={exportToPdf}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-600 p-2">
                  Total: <span className="font-semibold">{orders.length}</span>{" "}
                  orders
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="sm:hidden bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={resetFilters}
                      variant="outline"
                      className="flex-1"
                    >
                      <RotateCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button
                      onClick={exportToPdf}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading orders...</p>
              </div>
            </div>
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
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <Table className="min-w-full bg-white">
                  <TableHeader className="hover:bg-gray-400 hover:text-black">
                    <TableRow className="bg-gray-800">
                      <TableHead className="px-6 py-4 font-medium text-white">Order ID</TableHead>
                      <TableHead className="px-6 py-4 font-medium text-white">Customer Name</TableHead>
                      <TableHead className="px-6 py-4 font-medium text-white">Total</TableHead>
                      <TableHead className="px-6 py-4 font-medium text-white">Status</TableHead>
                      <TableHead className="px-6 py-4 font-medium text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id} className="border-b last:border-b-0 hover:bg-gray-200 transition-colors">
                        <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">{order._id}</TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-700">{order.customerName}</TableCell>
                        <TableCell className="px-6 py-4 text-sm text-gray-700">{order.total} AED</TableCell>
                        <TableCell className="px-6 py-4">
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-800 hover:bg-green-50"
                              onClick={() => handleUpdateStatus(order._id, order.status)}
                            >
                              <Truck className="h-4 w-4 mr-2" /> Update Status
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">Order ID: <span className="font-normal">{order._id}</span></p>
                      <p className="text-gray-700">Customer: <span className="font-normal">{order.customerName}</span></p>
                      <p className="text-gray-700">Total: <span className="font-normal">{order.total} AED</span></p>
                      <p className="text-gray-700">Status: 
                        {getStatusBadge(order.status)}
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-4 border-t pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-green-600 hover:text-green-800 hover:bg-green-50"
                        onClick={() => handleUpdateStatus(order._id, order.status)}
                      >
                        <Truck className="h-4 w-4 mr-1" /> Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-sm text-gray-600">
                    Showing {orders.length} orders
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                    <span>
                      Total Revenue:{" "}
                      <strong>
                        {orders.reduce((sum, order) => sum + order.total, 0)}{" "}
                        AED
                      </strong>
                    </span>
                    <span>
                      Avg Order:{" "}
                      <strong>
                        {orders.length > 0
                          ? Math.round(
                              orders.reduce(
                                (sum, order) => sum + order.total,
                                0
                              ) / orders.length
                            )
                          : 0}{" "}
                        AED
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        <DialogContent className="max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto max-h-[90vh] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Order Details - <span className="text-blue-600">{selectedOrder?._id}</span></DialogTitle>
            <DialogDescription>Comprehensive information about the selected order.</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div ref={orderDetailsRef} className="space-y-6 mt-6 p-2 bg-white rounded-lg">
              {/* Customer Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-800">
                    <User className="h-6 w-6 mr-3 text-blue-500" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-gray-700">
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
                </CardContent>
              </Card>
              
              {/* Delivery Address Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-800">
                    <MapPin className="h-6 w-6 mr-3 text-red-500" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>{selectedOrder.deliveryAddress}</p>
                </CardContent>
              </Card>
              
              {/* Order Items Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-800">
                    <Package className="h-6 w-6 mr-3 text-green-500" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-base border-b pb-3 last:border-b-0 last:pb-0">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-gray-700 text-sm sm:text-base mt-1 sm:mt-0">
                            {item.quantity} x {item.price.toFixed(2)} AED = <span className="font-semibold">{(item.quantity * item.price).toFixed(2)} AED</span>
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No items found for this order.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Total and Status Section */}
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center text-xl font-bold mb-3">
                  <span className="text-gray-800">Order Total:</span>
                  <span className="text-blue-700">{selectedOrder.total} AED</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-800">Current Status:</span>
                  <span className={`px-4 py-2 rounded-full text-base font-bold ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center"
            >
              {isExporting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" /> Exporting...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" /> Export to PDF
                </>
              )}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
