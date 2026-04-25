import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CashFlow from './pages/CashFlow';
import Orders from './pages/Orders';
import Owners from './pages/Owners';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cash-flow" element={<CashFlow />} />
          <Route path="orders" element={<Orders />} />
          <Route path="owners" element={<Owners />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
