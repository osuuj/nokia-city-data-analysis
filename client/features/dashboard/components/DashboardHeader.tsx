import type React from 'react';
import { useDashboard } from '../hooks/useDashboard';

export const DashboardHeader: React.FC = () => {
  const { state, actions } = useDashboard();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => actions.setActiveView('overview')}
              className={`px-4 py-2 rounded-md ${
                state.activeView === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => actions.setActiveView('analytics')}
              className={`px-4 py-2 rounded-md ${
                state.activeView === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
