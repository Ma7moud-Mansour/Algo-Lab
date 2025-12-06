import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AlgorithmSidebar } from './AlgorithmSidebar';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Show sidebar only on algorithm pages
  const showSidebar = location.pathname.startsWith('/algorithms');

  return (
    <div className="min-h-screen">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {showSidebar && (
        <AlgorithmSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          showSidebar && 'lg:pl-72'
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
