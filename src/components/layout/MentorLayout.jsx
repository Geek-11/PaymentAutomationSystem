import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  DollarSign, 
  User, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/common/ThemeToggle';
import Logo from '@/components/common/Logo';

const MentorLayout = ({ children }) => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const closeSidebar = () => {
    setIsOpen(false);
  };
  
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/mentor' },
    { icon: <Clock size={20} />, label: 'Sessions', path: '/mentor/sessions' },
    { icon: <DollarSign size={20} />, label: 'Payouts', path: '/mentor/payouts' },
    { icon: <MessageSquare size={20} />, label: 'Chat', path: '/chat' },
    { icon: <User size={20} />, label: 'Profile', path: '/mentor/profile' }
  ];
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-30 h-screen w-64 transition-transform duration-300 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:transform-none lg:relative ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 flex items-center justify-between">
          <Logo />
          <button 
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <ThemeToggle />
          <button
            onClick={logout}
            className="mt-4 flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mentor Portal
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MentorLayout;
