import type React from 'react';
import { type ApiError, ApiErrorType } from '../../utils/api';

interface ApiErrorDisplayProps {
  error: ApiError;
  onRetry?: () => void;
}

/**
 * Component for displaying API errors with appropriate messages and retry options
 */
const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({ error, onRetry }) => {
  // Determine error icon and color based on error type
  const getErrorStyles = () => {
    switch (error.type) {
      case ApiErrorType.NETWORK:
        return {
          icon: '🌐',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-300',
        };
      case ApiErrorType.SERVER:
        return {
          icon: '🔧',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-300',
        };
      case ApiErrorType.UNAUTHORIZED:
      case ApiErrorType.FORBIDDEN:
        return {
          icon: '🔒',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-300',
        };
      case ApiErrorType.NOT_FOUND:
        return {
          icon: '🔍',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300',
        };
      default:
        return {
          icon: '❗',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-300',
        };
    }
  };

  const styles = getErrorStyles();

  // Get detailed error message if available
  const getDetailedMessage = () => {
    if (error.type === ApiErrorType.VALIDATION && error.data) {
      // Format validation errors
      return (
        <div className="mt-2">
          <h4 className="font-semibold">Validation Errors:</h4>
          <ul className="list-disc pl-5 mt-1">
            {Object.entries(error.data).map(([field, errors]) => (
              <li key={field}>
                <span className="font-medium">{field}:</span>{' '}
                {Array.isArray(errors) ? errors.map((e) => String(e)).join(', ') : String(errors)}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-4 rounded-md border ${styles.bgColor} ${styles.borderColor} my-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 text-xl">{styles.icon}</div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.textColor}`}>{error.message}</h3>
          {error.status && <p className="text-sm opacity-75 mt-1">Status Code: {error.status}</p>}
          {getDetailedMessage()}

          {/* Show retry button for network errors */}
          {(error.type === ApiErrorType.NETWORK || error.type === ApiErrorType.SERVER) &&
            onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ApiErrorDisplay;
