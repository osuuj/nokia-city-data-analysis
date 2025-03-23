'use client';

import { useEffect } from 'react';

interface CustomErrorProps {
  error: Error;
  reset: () => void;
}

/**
 * Displays a fallback UI when an error occurs in the app.
 *
 * @component
 * @param {CustomErrorProps} props - The error object and reset function
 */
export default function CustomError({ error, reset }: CustomErrorProps) {
  useEffect(() => {
    console.error(error); // You could replace with logging service
  }, [error]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold text-red-600">Something went wrong!</h2>
      <p className="text-default-600 mt-2">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
