// src/pages/admin/OrderDetailsDialog.jsx
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import Loader from "@/component/common/Loader";
  import { getStatusBadge } from "../../component/admin/orderUtils";
  import { FileText, MapPin, Package, User } from "lucide-react";
  import { useRef } from "react";
  
  const OrderDetailsDialog = ({ open, onOpenChange, order }) => {
    const orderDetailsRef = useRef(null);
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto max-h-[90vh] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Order Details -{" "}
              <span className="text-blue-600">{order?._id}</span>
            </DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected order.
            </DialogDescription>
          </DialogHeader>
          {order ? (
            <div
              ref={orderDetailsRef}
              className="space-y-6 mt-6 p-2 bg-white rounded-lg"
            >
              {/* Customer Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-800">
                    <User className="h-6 w-6 mr-3 text-blue-500" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-gray-700">
                  <p>
                    <strong>Name:</strong> {order?.user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order?.user?.email}
                  </p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
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
                  {order?.shippingAddress ? (
                    <div className="space-y-1">
                      <div>
                        <strong>Name:</strong>{" "}
                        {order.shippingAddress.fullName}
                      </div>
                      <div>
                        <strong>Address:</strong>{" "}
                        {order.shippingAddress.addressLine}
                      </div>
                      <div>
                        <strong>City:</strong>{" "}
                        {order.shippingAddress.city}
                      </div>
                      <div>
                        <strong>State:</strong>{" "}
                        {order.shippingAddress.state}
                      </div>
                      <div>
                        <strong>Country:</strong>{" "}
                        {order.shippingAddress.country}
                      </div>
                      <div>
                        <strong>Postal Code:</strong>{" "}
                        {order.shippingAddress.postalCode}
                      </div>
                      <div>
                        <strong>Phone:</strong>{" "}
                        {order.shippingAddress.phoneNumber}
                      </div>
                    </div>
                  ) : (
                    <div>No shipping address found.</div>
                  )}
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
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <li
                          key={item._id || index}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-base border-b pb-3 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.category}
                              </div>
                              <div className="text-xs text-gray-500">
                                Product ID: {item.productId}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 text-gray-700 text-sm sm:text-base">
                            <div>
                              {item.quantity} x {item.price} AED
                              {item.originalPrice &&
                                item.originalPrice !== item.price && (
                                  <span className="ml-2 line-through text-red-400 text-xs">
                                    {item.originalPrice} AED
                                  </span>
                                )}
                            </div>
                            <div>
                              <span className="font-semibold">
                                Subtotal:{" "}
                                {(item.quantity * item.price).toFixed(2)} AED
                              </span>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">
                        No items found for this order.
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
              {/* Total and Status Section */}
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center text-xl font-bold mb-3">
                  <span className="text-gray-800">Order Total:</span>
                  <span className="text-blue-700">
                    {order.totalAmount} AED
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-800">
                    Current Status:
                  </span>
                  <span
                    className={`px-4 py-2 rounded-full text-base font-bold ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Loader message="Loading..." />
          )}
          <DialogFooter className="mt-6">
            <Button
              onClick={() => alert("Export to PDF not implemented")}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" /> Export to PDF
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default OrderDetailsDialog;