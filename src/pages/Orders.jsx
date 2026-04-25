import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { format, parseISO } from 'date-fns';

const Orders = () => {
  const { orders, addOrder, updateOrder, removeOrder } = useAppContext();
  const [formData, setFormData] = useState({
    customerName: '',
    totalAmount: '',
    advancePayment: '',
    status: 'Not Sent'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrder({
      ...formData,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      advancePayment: parseFloat(formData.advancePayment) || 0
    });
    setFormData({ customerName: '', totalAmount: '', advancePayment: '', status: 'Not Sent' });
  };

  return (
    <div>
      <h1 className="mb-6">Order Tracking</h1>

      <div className="glass-card p-6 mb-8">
        <h3 className="mb-4">New Order</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md-grid-cols-4 gap-4" style={{ alignItems: 'end' }}>
          
          <div className="form-group mb-0 md:col-span-1">
            <label className="form-label">Customer Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              required 
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Total Amount</label>
            <input 
              type="number" 
              className="form-input" 
              value={formData.totalAmount}
              onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
              required 
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Advance Given</label>
            <input 
              type="number" 
              className="form-input" 
              value={formData.advancePayment}
              onChange={(e) => setFormData({...formData, advancePayment: e.target.value})}
              required 
            />
          </div>

          <div className="form-group mb-0">
            <button type="submit" className="btn btn-primary w-full">Add Order</button>
          </div>
        </form>
      </div>

      <div className="table-container glass-card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th className="text-right">Total</th>
              <th className="text-right">Advance</th>
              <th className="text-right">Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No orders found</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o.id}>
                  <td>{format(parseISO(o.date), 'MMM dd, yyyy')}</td>
                  <td>{o.customerName}</td>
                  <td className="text-right">৳{parseFloat(o.totalAmount).toLocaleString()}</td>
                  <td className="text-right">৳{parseFloat(o.advancePayment).toLocaleString()}</td>
                  <td className="text-right text-danger" style={{ fontWeight: 600 }}>
                    ৳{(parseFloat(o.totalAmount) - parseFloat(o.advancePayment)).toLocaleString()}
                  </td>
                  <td>
                    <select 
                      className="form-select" 
                      style={{ padding: '0.25rem 0.5rem', width: 'auto' }}
                      value={o.status}
                      onChange={(e) => updateOrder(o.id, { status: e.target.value })}
                    >
                      <option value="Not Sent">Not Sent</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td>
                    <button 
                       className="btn btn-outline" 
                       style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                       onClick={() => removeOrder(o.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
