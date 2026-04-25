import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { format, parseISO } from 'date-fns';

const CashFlow = () => {
  const { transactions, addTransaction, removeTransaction, paymentMethods } = useAppContext();
  
  const [formData, setFormData] = useState({
    type: 'Income',
    amount: '',
    methodId: paymentMethods[0]?.id || '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount)) return;
    
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    setFormData({ ...formData, amount: '', description: '' });
  };

  const getMethodName = (id) => {
    return paymentMethods.find(m => m.id === id)?.name || 'Unknown';
  };

  return (
    <div>
      <h1 className="mb-6">Cash Flow</h1>

      <div className="glass-card p-6 mb-8">
        <h3 className="mb-4">Add Transaction</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md-grid-cols-2 gap-4" style={{ alignItems: 'end' }}>
          
          <div className="form-group mb-0">
            <label className="form-label">Type</label>
            <select 
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Payment Method</label>
            <select 
              className="form-select"
              value={formData.methodId}
              onChange={(e) => setFormData({...formData, methodId: e.target.value})}
              required
            >
              {paymentMethods.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Amount (৳)</label>
            <input 
              type="number"
              step="0.01"
              className="form-input"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Description / Remarks</label>
            <input 
              type="text"
              className="form-input"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="e.g. Sold photo frame"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="btn btn-primary w-full mt-4">
              Add {formData.type}
            </button>
          </div>
        </form>
      </div>

      <h3 className="mb-4">Recent Transactions</h3>
      <div className="table-container glass-card">
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Method</th>
              <th>Description</th>
              <th className="text-right">Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No transactions found</td></tr>
            ) : (
              transactions.map(t => (
                <tr key={t.id}>
                  <td>{format(parseISO(t.date), 'MMM dd, yyyy h:mm a')}</td>
                  <td>
                    <span className={`badge ${t.type === 'Income' ? 'badge-success' : 'badge-danger'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td>{getMethodName(t.methodId)}</td>
                  <td>{t.description}</td>
                  <td className={`text-right ${t.type === 'Income' ? 'text-success' : 'text-danger'}`} style={{ fontWeight: 600 }}>
                    {t.type === 'Income' ? '+' : '-'}৳{parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                      onClick={() => {
                        if(confirm('Are you sure you want to delete this transaction?')) removeTransaction(t.id);
                      }}
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

export default CashFlow;
