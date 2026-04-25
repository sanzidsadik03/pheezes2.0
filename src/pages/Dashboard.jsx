import React, { useState, useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { isAfter, subDays, startOfDay, format, parseISO } from 'date-fns';

const Dashboard = () => {
  const { transactions, paymentMethods, splitSettings } = useAppContext();
  const [timeframe, setTimeframe] = useState('30days'); // '30days' or 'all'

  // Calculations
  const initialCapital = splitSettings?.initialCapital || 0;
  const filteredTransactions = useMemo(() => {
    if (timeframe === 'all') return transactions;
    const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
    return transactions.filter(t => isAfter(parseISO(t.date), thirtyDaysAgo));
  }, [transactions, timeframe]);

  const { income, expense } = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => {
      const amount = parseFloat(curr.amount) || 0;
      if (curr.type === 'Income') acc.income += amount;
      else acc.expense += amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [filteredTransactions]);

  const allTimeBalance = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      const amount = parseFloat(curr.amount) || 0;
      return curr.type === 'Income' ? acc + amount : acc - amount;
    }, 0);
  }, [transactions]);

  const netProfit = allTimeBalance - initialCapital;

  // Daily Chart Data
  const chartData = useMemo(() => {
    const dataMap = {};
    
    // Initialize map for all dates if 30 days
    if (timeframe === '30days') {
      for(let i=30; i>=0; i--) {
        const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
        dataMap[d] = { dateStr: format(subDays(new Date(), i), 'MMM dd'), Income: 0, Expense: 0 };
      }
    }

    filteredTransactions.forEach(t => {
      const dStr = format(parseISO(t.date), 'yyyy-MM-dd');
      const dLabel = format(parseISO(t.date), 'MMM dd');
      if (!dataMap[dStr]) dataMap[dStr] = { dateStr: dLabel, Income: 0, Expense: 0 };
      
      if (t.type === 'Income') dataMap[dStr].Income += parseFloat(t.amount);
      if (t.type === 'Expense') dataMap[dStr].Expense += parseFloat(t.amount);
    });

    const sortedData = Object.keys(dataMap)
      .sort((a,b) => new Date(a) - new Date(b))
      .map(k => dataMap[k]);

    return sortedData;
  }, [filteredTransactions, timeframe]);

  // Method Balances
  const methodBalances = useMemo(() => {
    const balances = paymentMethods.reduce((acc, m) => {
      acc[m.id] = { name: m.name, value: 0 };
      return acc;
    }, {});

    // For method balances, we usually look at all-time, not affected by timeframe toggle
    // If you want it affected by timeframe, change 'transactions' to 'filteredTransactions'
    transactions.forEach(t => {
      if(balances[t.methodId]) {
        const amt = parseFloat(t.amount);
        if(t.type === 'Income') balances[t.methodId].value += amt;
        else balances[t.methodId].value -= amt;
      }
    });

    return Object.values(balances);
  }, [transactions, paymentMethods]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-surface)', padding: '0.25rem', borderRadius: '8px' }}>
          <button 
             className={`badge ${timeframe === '30days' ? 'bg-primary' : ''}`}
             style={{ 
               backgroundColor: timeframe === '30days' ? 'var(--color-primary)' : 'transparent',
               color: timeframe === '30days' ? 'white' : 'var(--color-text-muted)'
             }}
             onClick={() => setTimeframe('30days')}
          >
            30 Days
          </button>
          <button 
             className={`badge ${timeframe === 'all' ? 'bg-primary' : ''}`}
             style={{ 
              backgroundColor: timeframe === 'all' ? 'var(--color-primary)' : 'transparent',
              color: timeframe === 'all' ? 'white' : 'var(--color-text-muted)'
            }}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md-grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="glass-card p-6">
          <p className="form-label m-0">Net Balance (All Time)</p>
          <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0', color: allTimeBalance >= 0 ? 'var(--color-text)' : 'var(--color-danger)' }}>
            ৳{allTimeBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        
        <div className="glass-card p-6 border-l-4" style={{ borderLeft: `4px solid ${netProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
          <p className="form-label m-0">{netProfit >= 0 ? 'Profit' : 'Loss'} (All Time)</p>
          <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0', color: netProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {netProfit >= 0 ? '+' : ''}৳{netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="glass-card p-6 border-l-4" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <p className="form-label m-0">Income</p>
          <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0', color: 'var(--color-success)' }}>
            ৳{income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="glass-card p-6 border-l-4" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <p className="form-label m-0">Expense</p>
          <h2 style={{ fontSize: '1.8rem', margin: '0.5rem 0', color: 'var(--color-danger)' }}>
            ৳{expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
        </div>
      </div>

      <h3 className="mb-4">Balances by Method (All Time)</h3>
      <div className="grid grid-cols-2 md-grid-cols-4 mb-8">
        {methodBalances.map(m => (
          <div key={m.name} className="glass-card p-4 text-center">
            <h4 style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }} className="m-0 mb-2">{m.name}</h4>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: m.value < 0 ? 'var(--color-danger)' : 'var(--color-text)', margin: 0 }}>
              ৳{m.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 mb-8" style={{ height: '400px' }}>
        <h3 className="mb-4">Cash Flow Range</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="dateStr" stroke="var(--color-text-muted)" />
            <YAxis stroke="var(--color-text-muted)" />
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="Income" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="Expense" stroke="var(--color-danger)" fillOpacity={1} fill="url(#colorExpense)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
