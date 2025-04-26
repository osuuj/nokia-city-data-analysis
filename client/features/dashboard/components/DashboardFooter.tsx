import type React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Nokia City Data Analysis
          </p>
          <div className="flex space-x-4">
            <a href="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-sm text-gray-500 hover:text-gray-700">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
