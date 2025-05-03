import type React from 'react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <aside className="w-64 bg-white shadow-lg">
      <nav className="mt-5 px-2">
        <button
          type="button"
          onClick={() => onViewChange('overview')}
          className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
            activeView === 'overview'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => onViewChange('analytics')}
          className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
            activeView === 'analytics'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Analytics
        </button>
        <button
          type="button"
          onClick={() => onViewChange('reports')}
          className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
            activeView === 'reports'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Reports
        </button>
        <button
          type="button"
          onClick={() => onViewChange('settings')}
          className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
            activeView === 'settings'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Settings
        </button>
      </nav>
    </aside>
  );
};
