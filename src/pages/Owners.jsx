import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';

const Owners = () => {
  const { owners, paymentMethods, transactions, splitSettings } = useAppContext();

  // Calculate balances per method
  const methodBalances = useMemo(() => {
    const balances = paymentMethods.reduce((acc, m) => {
      acc[m.id] = { ...m, value: 0, isExcluded: splitSettings.excludedMethods.includes(m.id) };
      return acc;
    }, {});

    transactions.forEach(t => {
      if(balances[t.methodId]) {
        const amt = parseFloat(t.amount);
        if(t.type === 'Income') balances[t.methodId].value += amt;
        else balances[t.methodId].value -= amt;
      }
    });

    return Object.values(balances);
  }, [transactions, paymentMethods, splitSettings]);

  // Calculate distributable vs non-distributable
  const { distributableTotal, excludedTotal } = useMemo(() => {
    return methodBalances.reduce((acc, m) => {
      if (m.isExcluded) acc.excludedTotal += m.value;
      else acc.distributableTotal += m.value;
      return acc;
    }, { distributableTotal: 0, excludedTotal: 0 });
  }, [methodBalances]);

  const initialCapital = splitSettings.initialCapital || 0;
  const netProfit = distributableTotal - initialCapital;

  return (
    <div>
      <h1 className="mb-6">Owners & Profit Split</h1>

      <div className="grid grid-cols-1 md-grid-cols-2 gap-8 mb-8">
        
        {/* Method Balances */}
        <div className="glass-card p-6">
          <h3 className="mb-4">Cash Sources</h3>
          <div className="flex flex-col gap-4">
            {methodBalances.map(m => (
              <div key={m.id} className="flex justify-between items-center pb-2 border-b" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <span style={{ fontWeight: 500 }}>{m.name}</span>
                  {m.isExcluded && <span className="badge badge-warning ml-2" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>Excluded from split</span>}
                </div>
                <span className={m.value < 0 ? 'text-danger' : 'text-success'} style={{ fontWeight: 600 }}>
                  ৳{m.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4 mt-2 border-t" style={{ borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>Excluded Methods Total:</span>
              <span>৳{excludedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
               <span style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>Initial Capital:</span>
               <span>৳{initialCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '1.1rem' }}>Total Distributable:</span>
              <span className="text-primary" style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                ৳{distributableTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 mt-2">
              <span style={{ fontWeight: 600, color: netProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontSize: '1.2rem' }}>
                {netProfit >= 0 ? 'Net Profit' : 'Net Loss'}:
              </span>
              <span className={netProfit >= 0 ? 'text-success' : 'text-danger'} style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                {netProfit >= 0 ? '+' : ''}৳{netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Owner Split */}
        <div className="glass-card p-6">
          <h3 className="mb-4">Calculated Shares</h3>
          <div className="grid grid-cols-1 gap-4">
            {owners.map(owner => {
              const baseShare = initialCapital * (owner.profitPercentage / 100);
              const profitShare = netProfit * (owner.profitPercentage / 100);
              const totalPayable = distributableTotal * (owner.profitPercentage / 100);
              
              return (
                <div key={owner.id} className="p-4" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="m-0 text-xl">{owner.name}</h4>
                    <span className="badge bg-primary text-white" style={{ background: 'var(--color-primary)' }}>{owner.profitPercentage}% Share</span>
                  </div>

                  <div className="flex justify-between items-center mb-2" style={{ fontSize: '0.875rem' }}>
                    <span className="form-label m-0">Initial Share:</span>
                    <span>৳{baseShare.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between items-center mb-4" style={{ fontSize: '0.875rem' }}>
                    <span className="form-label m-0">Profit & Loss:</span>
                    <span className={profitShare >= 0 ? 'text-success' : 'text-danger'} style={{ fontWeight: 600 }}>
                      {profitShare >= 0 ? '+' : ''}৳{profitShare.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between items-end pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="form-label m-0">Total Payable:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: totalPayable >= 0 ? 'var(--color-text)' : 'var(--color-danger)' }}>
                      ৳{totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Owners;
