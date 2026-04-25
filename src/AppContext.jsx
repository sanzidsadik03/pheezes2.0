import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // --- Initialization Helper ---
  const loadState = (key, defaultState) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultState;
    } catch (e) {
      console.error(`Error loading ${key} from localStorage`, e);
      return defaultState;
    }
  };

  // --- States ---
  const [owners, setOwners] = useState(() => 
    loadState('pheezes_owners', [
      { id: '1', name: 'Owner 1', contact: '', profitPercentage: 50 },
      { id: '2', name: 'Owner 2', contact: '', profitPercentage: 50 }
    ])
  );

  const [paymentMethods, setPaymentMethods] = useState(() => 
    loadState('pheezes_methods', [
      { id: 'bkash', name: 'Bkash' },
      { id: 'nagad', name: 'Nagad' },
      { id: 'bank', name: 'Bank' },
      { id: 'cash', name: 'Cash' }
    ])
  );

  const [transactions, setTransactions] = useState(() => 
    loadState('pheezes_transactions', [])
  );

  const [orders, setOrders] = useState(() => 
    loadState('pheezes_orders', [])
  );

  // Split calculation dynamic settings
  const [splitSettings, setSplitSettings] = useState(() => {
    const saved = loadState('pheezes_split_settings', null);
    if (saved) {
      if (typeof saved.initialCapital === 'undefined') saved.initialCapital = 0;
      return saved;
    }
    return {
      excludedMethods: [],
      initialCapital: 0
    };
  });

  // --- Synchronize to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('pheezes_owners', JSON.stringify(owners));
  }, [owners]);

  useEffect(() => {
    localStorage.setItem('pheezes_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('pheezes_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('pheezes_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pheezes_split_settings', JSON.stringify(splitSettings));
  }, [splitSettings]);

  // --- CRUD Operations ---
  
  // Owners
  const addOwner = (owner) => setOwners(prev => [...prev, { ...owner, id: uuidv4() }]);
  const updateOwner = (id, updatedOwner) => setOwners(prev => prev.map(o => o.id === id ? { ...o, ...updatedOwner } : o));
  const removeOwner = (id) => setOwners(prev => prev.filter(o => o.id !== id));

  // Payment Methods
  const addMethod = (method) => setPaymentMethods(prev => [...prev, { ...method, id: uuidv4() }]);
  const updateMethod = (id, updatedMethod) => setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, ...updatedMethod } : m));
  const removeMethod = (id) => setPaymentMethods(prev => prev.filter(m => m.id !== id));

  // Transactions
  const addTransaction = (transaction) => setTransactions(prev => [{ ...transaction, id: uuidv4(), date: transaction.date || new Date().toISOString() }, ...prev]);
  const updateTransaction = (id, updatedT) => setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedT } : t));
  const removeTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  // Orders
  const addOrder = (order) => setOrders(prev => [{ ...order, id: uuidv4(), date: order.date || new Date().toISOString() }, ...prev]);
  const updateOrder = (id, updatedOrder) => setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedOrder } : o));
  const removeOrder = (id) => setOrders(prev => prev.filter(o => o.id !== id));

  return (
    <AppContext.Provider value={{
      owners, addOwner, updateOwner, removeOwner,
      paymentMethods, addMethod, updateMethod, removeMethod,
      transactions, addTransaction, updateTransaction, removeTransaction,
      orders, addOrder, updateOrder, removeOrder,
      splitSettings, setSplitSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};
