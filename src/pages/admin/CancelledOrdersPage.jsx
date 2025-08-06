import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCancelledOrders, initiateRefund } from '../../features/order/cancelledOrderSlice';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CancelledOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.cancelledOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getCancelledOrders());
  }, [dispatch]);

  const handleInitiateRefund = async (orderId) => {
    console.log('orderId', orderId)
    const result = await dispatch(initiateRefund(orderId));
    if (initiateRefund.fulfilled.match(result)) {
      toast.success('Refund initiated successfully!');
    } else {
      toast.error('Failed to initiate refund.');
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error.message || 'Something went wrong'}</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Cancelled Orders</h1>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.user?.name || 'Guest'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-200"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>View Items</p></TooltipContent>
                      </Tooltip>
                      <Button 
                        onClick={() => handleInitiateRefund(order._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        size="sm"
                        disabled={loading || order.refundStatus === 'Initiated' || order.refundStatus === 'Succeeded'}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (order.refundStatus === 'Initiated' ? 'Initiated' : (order.refundStatus === 'Succeeded' ? 'Refunded' : 'Initiate Refund'))}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No cancelled orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Order ID: {order.orderId}</p>
                  <p className="text-sm text-gray-600">{order.user?.name || 'Guest'}</p>
                  <p className="text-sm text-gray-500">{order.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-grow text-blue-600"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Items
                </Button>
                <Button 
                  onClick={() => handleInitiateRefund(order._id)}
                  className="flex-grow bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                  disabled={loading || order.refundStatus === 'Initiated' || order.refundStatus === 'Succeeded'}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (order.refundStatus === 'Initiated' ? 'Initiated' : (order.refundStatus === 'Succeeded' ? 'Refunded' : 'Initiate Refund'))}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No cancelled orders found.</p>
        )}
      </div>

      {/* Item Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Items for Order #{selectedOrder.orderId}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              {selectedOrder.items.map((item) => (
                <div key={item.productId || item._id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-50">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">₹{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CancelledOrdersPage;
