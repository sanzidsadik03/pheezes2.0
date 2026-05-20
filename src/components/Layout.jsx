import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full" style={{ overflow: 'hidden' }}>
      {/* Mobile Topbar */}
      <div className="flex items-center p-4 glass-card md:hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderRadius: 0, borderBottom: '1px solid var(--color-border)', gap: '1rem' }}>
        <button onClick={() => setMobileMenuOpen(prev => !prev)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Menu color="var(--color-text)" />
        </button>
        <h2 className="m-0" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>Pheezes v2.0</h2>
      </div>

      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      
      <main className="w-full h-full p-4 md:p-8" style={{ overflowY: 'auto', marginTop: '60px', paddingBottom: '80px' }} id="main-content">
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            #main-content {
              margin-top: 0 !important;
            }
          }
        `}} />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
