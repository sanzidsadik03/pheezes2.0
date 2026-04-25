import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

const Settings = () => {
  const { 
    paymentMethods, addMethod, removeMethod, 
    owners, addOwner, updateOwner, removeOwner,
    splitSettings, setSplitSettings
  } = useAppContext();

  const [newMethodName, setNewMethodName] = useState('');
  
  const [newOwner, setNewOwner] = useState({ name: '', percentage: 0 });

  const handleAddMethod = (e) => {
    e.preventDefault();
    if(newMethodName.trim()) {
      addMethod({ name: newMethodName.trim() });
      setNewMethodName('');
    }
  };

  const handleAddOwner = (e) => {
    e.preventDefault();
    if(newOwner.name.trim()) {
      addOwner({ name: newOwner.name.trim(), profitPercentage: parseFloat(newOwner.percentage) || 0, contact: '' });
      setNewOwner({ name: '', percentage: 0 });
    }
  };

  const toggleMethodExclusion = (methodId) => {
    setSplitSettings(prev => {
      const isExcluded = prev.excludedMethods.includes(methodId);
      if (isExcluded) {
        return { ...prev, excludedMethods: prev.excludedMethods.filter(id => id !== methodId) };
      } else {
        return { ...prev, excludedMethods: [...prev.excludedMethods, methodId] };
      }
    });
  };

  const totalPercentage = owners.reduce((acc, o) => acc + o.profitPercentage, 0);

  return (
    <div>
      <h1 className="mb-6">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Payment Methods */}
        <div className="glass-card p-6">
          <h3 className="mb-4">Payment Methods</h3>
          
          <form onSubmit={handleAddMethod} className="flex gap-2 mb-6">
            <input 
              type="text" 
              className="form-input flex-1" 
              placeholder="E.g., Rocket, Card..."
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>

          <table className="w-full">
            <tbody>
              {paymentMethods.map(m => (
                <tr key={m.id}>
                  <td className="py-2">{m.name}</td>
                  <td className="text-right py-2">
                    <button 
                      onClick={() => {
                        if(confirm('Delete method?')) removeMethod(m.id);
                      }}
                      className="text-danger"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

         {/* Exclusions */}
         <div className="glass-card p-6">
          <h3 className="mb-4">Profit Split Rules</h3>

          <div className="form-group mb-6">
            <label className="form-label">Initial Invested Capital (৳)</label>
            <input 
              type="number" 
              className="form-input" 
              value={splitSettings.initialCapital || 0}
              onChange={(e) => setSplitSettings(prev => ({ ...prev, initialCapital: parseFloat(e.target.value) || 0 }))}
            />
          </div>

          <p className="form-label mb-4">Select payment methods to EXCLUDE from the distributable profit calculation.</p>
          
          <div className="flex flex-col gap-3">
            {paymentMethods.map(m => {
              const isExcluded = splitSettings.excludedMethods.includes(m.id);
              return (
                <label key={m.id} className="flex items-center gap-3 cursor-pointer" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <input 
                    type="checkbox"
                    checked={isExcluded}
                    onChange={() => toggleMethodExclusion(m.id)}
                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Exclude <strong>{m.name}</strong> from profit split</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Owners Settings */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="m-0">Business Owners</h3>
            {totalPercentage !== 100 && (
               <span className="badge badge-warning">Warning: Total equals {totalPercentage}%, should be 100%</span>
            )}
          </div>

          <div className="table-container mb-6">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Share Percentage (%)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {owners.map(o => (
                  <tr key={o.id}>
                    <td>{o.name}</td>
                    <td>
                      <input 
                        type="number" 
                        className="form-input" 
                        style={{ width: '100px' }}
                        value={o.profitPercentage}
                        onChange={(e) => updateOwner(o.id, { profitPercentage: parseFloat(e.target.value) || 0 })}
                      />
                    </td>
                    <td>
                      <button 
                        onClick={() => {
                          if(confirm('Delete owner?')) removeOwner(o.id);
                        }}
                        className="text-danger"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="mb-3 mt-8">Add New Owner</h4>
          <form onSubmit={handleAddOwner} className="grid grid-cols-1 md-grid-cols-3 gap-4">
            <div className="form-group mb-0">
              <input 
                 type="text" 
                 className="form-input" 
                 placeholder="Owner Name"
                 value={newOwner.name}
                 onChange={(e) => setNewOwner({...newOwner, name: e.target.value})}
                 required
              />
            </div>
            <div className="form-group mb-0">
               <input 
                 type="number" 
                 className="form-input" 
                 placeholder="Percentage (e.g. 50)"
                 value={newOwner.percentage || ''}
                 onChange={(e) => setNewOwner({...newOwner, percentage: e.target.value})}
                 required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Owner</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Settings;
