import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, ShoppingCart, Users, Settings, X } from 'lucide-react';

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/cash-flow', icon: <ArrowLeftRight size={20} />, label: 'Cash Flow' },
    { to: '/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { to: '/owners', icon: <Users size={20} />, label: 'Owners & Split' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden" 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <div 
        className={`glass-card p-4 flex-col mobile-sidebar desktop-sidebar ${mobileMenuOpen ? 'open' : ''} md:flex`}
        style={{
          borderRadius: 0,
          borderRight: '1px solid var(--color-border)',
          borderLeft: 'none',
          borderTop: 'none',
          borderBottom: 'none'
        }}
        id="sidebar"
      >
        
        <div className="flex items-center justify-between mb-8 md:mb-12" style={{ padding: '0.5rem' }}>
          <h1 className="m-0" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 700 }}>
            Pheezes<span style={{ color: 'var(--color-text)' }}>2.0</span>
          </h1>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
             <X color="var(--color-text)" />
          </button>
        </div>

        <nav className="flex-col gap-2 w-full">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1rem',
                borderRadius: '8px',
                color: isActive ? 'white' : 'var(--color-text-muted)',
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                transition: 'all 0.2s',
                fontWeight: isActive ? 500 : 400,
              })}
              className="nav-link"
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
