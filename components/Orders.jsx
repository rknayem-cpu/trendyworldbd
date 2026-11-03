'use client';

import { useState, useEffect } from 'react';
import { Eye, CheckCircle, Truck, PackageCheck, Trash2, X, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status API Handler
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setOrders(prev =>
          prev.map(ord => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
        );
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Status updated to ${newStatus}`,
          showConfirmButton: false,
          timer: 1500,
          background: '#09090b',
          color: '#fff',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Delete Order?',
      text: 'This order record will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
      background: '#09090b',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setOrders(prev => prev.filter(o => o._id !== orderId));
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Order deleted', showConfirmButton: false, timer: 1200, background: '#09090b', color: '#fff' });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-200 p-4 sm:p-8 max-w-7xl mx-auto space-y-6 mt-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl font-black text-white">Order Management</h1>
          <p className="text-xs text-gray-400">View customer orders and control shipping statuses</p>
        </div>
        <button onClick={fetchOrders} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-20 text-xs text-gray-400">Loading Orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-xs text-gray-400">No orders placed yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/5 uppercase text-[10px] text-amber-400 font-bold border-b border-white/10">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">District</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => {
                const isConfirmed = order.status === 'Confirmed' || order.status === 'Shipping' || order.status === 'Delivered';
                const isShipping = order.status === 'Shipping' || order.status === 'Delivered';
                const isDelivered = order.status === 'Delivered';

                return (
                  <tr key={order._id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-4 font-bold text-white">{order.customer?.name || 'N/A'}</td>
                    <td className="p-4">{order.customer?.phone}</td>
                    <td className="p-4">{order.customer?.district}</td>
                    <td className="p-4 font-black text-rose-400">৳{order.total}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isDelivered ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        isShipping ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        isConfirmed ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Eye Modal View */}
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300" title="View Details">
                          <Eye className="w-4 h-4 text-blue-400" />
                        </button>

                        {/* Confirm Button */}
                        <button 
                          onClick={() => handleUpdateStatus(order._id, 'Confirmed')}
                          disabled={isConfirmed}
                          className={`p-1.5 rounded-lg border transition-all ${isConfirmed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 opacity-50' : 'bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border-white/10'}`}
                          title="Confirm Order"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>

                        {/* Shipping Button (Requires Order to be Confirmed First) */}
                        <button 
                          onClick={() => handleUpdateStatus(order._id, 'Shipping')}
                          disabled={!isConfirmed || isShipping}
                          className={`p-1.5 rounded-lg border transition-all ${isShipping ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 opacity-50' : !isConfirmed ? 'opacity-30 cursor-not-allowed bg-white/5 text-gray-500 border-white/5' : 'bg-white/5 hover:bg-blue-500/20 text-blue-400 border-white/10'}`}
                          title="Set Shipping"
                        >
                          <Truck className="w-4 h-4" />
                        </button>

                        {/* Delivered Button */}
                        <button 
                          onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                          disabled={!isShipping || isDelivered}
                          className={`p-1.5 rounded-lg border transition-all ${isDelivered ? 'bg-purple-500/10 border-purple-500/30 text-purple-500 opacity-50' : !isShipping ? 'opacity-30 cursor-not-allowed bg-white/5 text-gray-500 border-white/5' : 'bg-white/5 hover:bg-purple-500/20 text-purple-400 border-white/10'}`}
                          title="Set Delivered"
                        >
                          <PackageCheck className="w-4 h-4" />
                        </button>

                        {/* Trash Button */}
                        <button onClick={() => handleDeleteOrder(order._id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400 border border-white/10" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Single Detail Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-neutral-950 border border-white/10 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-sm font-black uppercase text-amber-400">Order Details</h2>

            {/* Customer Details */}
            <div className="p-3 rounded-xl bg-white/5 space-y-1 text-xs">
              <p className="text-white font-bold">{selectedOrder.customer?.name}</p>
              <p className="text-gray-400">Phone: {selectedOrder.customer?.phone}</p>
              {selectedOrder.customer?.email && <p className="text-gray-400">Email: {selectedOrder.customer?.email}</p>}
              <p className="text-gray-300 pt-1">
                <span className="text-amber-400 font-semibold">Address:</span> {selectedOrder.customer?.address}, {selectedOrder.customer?.upazila}, {selectedOrder.customer?.district}, {selectedOrder.customer?.division}
              </p>
            </div>

            {/* Products List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-900 shrink-0" />
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-gray-400">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-rose-400">৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="border-t border-white/10 pt-3 text-xs space-y-1">
              <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>৳{selectedOrder.subtotal}</span></div>
              <div className="flex justify-between text-gray-400"><span>Delivery Fee</span><span>৳{selectedOrder.deliveryFee}</span></div>
              <div className="flex justify-between font-black text-white text-sm pt-1"><span>Total</span><span className="text-rose-400">৳{selectedOrder.total}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}