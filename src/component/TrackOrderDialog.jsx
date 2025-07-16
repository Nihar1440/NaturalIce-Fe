// src/component/TrackOrderDialog.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trackOrder, clearTracking } from "@/features/order/orderSlice";
import { Button } from "@/components/ui/button";

const statusIcons = {
  completed: "✓",
  current: "🔄",
  pending: " ",
};

function getStepStatus(idx, currentIdx) {
  if (idx < currentIdx) return "completed";
  if (idx === currentIdx) return "current";
  return "pending";
}

export default function TrackOrderDialog({ open, onOpenChange, orderId }) {
  const dispatch = useDispatch();
  const { tracking, trackingLoading, trackingError } = useSelector((state) => state.order);

  useEffect(() => {
    if (open && orderId) {
      dispatch(trackOrder(orderId));
    }
    return () => {
      dispatch(clearTracking());
    };
  }, [dispatch, open, orderId]);

  // Find the current step index
  let currentStepIdx = -1;
  if (tracking?.trackingHistory?.length) {
    currentStepIdx = tracking.trackingHistory.findIndex(
      (item) => item.status === tracking.status
    );
    if (currentStepIdx === -1) currentStepIdx = tracking.trackingHistory.length - 1;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Track Order</DialogTitle>
          <DialogDescription>
            {orderId && (
              <span className="font-mono text-xs text-gray-500">Order ID: #{orderId}</span>
            )}
          </DialogDescription>
        </DialogHeader>
        {trackingLoading && <div>Loading tracking info...</div>}
        {trackingError && <div className="text-red-500">Error: {trackingError}</div>}
        {tracking && (
          <div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span> {tracking.status}
            </div>
            <div className="mb-2">
              <span className="font-semibold">ETA:</span>{" "}
              {tracking.estimatedDeliveryDate
                ? new Date(tracking.estimatedDeliveryDate).toLocaleDateString()
                : "N/A"}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Current Location:</span> {tracking.currentLocation || "N/A"}
            </div>
            <div className="flex flex-col gap-2">
              {tracking.trackingHistory?.map((item, idx) => {
                const stepStatus = getStepStatus(idx, currentStepIdx);
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-lg w-6 text-center">
                      {statusIcons[stepStatus]}
                    </span>
                    <div>
                      <div className="font-medium">{item.status}</div>
                      <div className="text-xs text-gray-500">
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleDateString()
                          : "Pending"}
                        {item.location ? ` - ${item.location}` : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Optionally show the next step if not delivered */}
              {tracking.status !== "delivered" && (
                <div className="flex items-start gap-2 opacity-60">
                  <span className="text-lg w-6 text-center">[ ]</span>
                  <div>
                    <div className="font-medium">Delivered</div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}