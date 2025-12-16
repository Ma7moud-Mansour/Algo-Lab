import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AlgorithmSidebar } from './AlgorithmSidebar';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Show sidebar only on algorithm pages
  const showSidebar = location.pathname.startsWith('/algorithms');

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-open');
    if (saved !== null) {
      setSidebarOpen(JSON.parse(saved));
    }
  }, []);

  const handleSidebarToggle = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebar-open', JSON.stringify(newState));
  };

  return (
    <div className="min-h-screen">
      <Navbar onMenuToggle={handleSidebarToggle} showMenuButton={showSidebar} sidebarOpen={sidebarOpen} />
      
      {showSidebar && (
        <AlgorithmSidebar
          isOpen={sidebarOpen}
          onClose={() => {
            setSidebarOpen(false);
            localStorage.setItem('sidebar-open', 'false');
          }}
        />
      )}

      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          showSidebar && sidebarOpen && 'lg:pl-72'
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
