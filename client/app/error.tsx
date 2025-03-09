'use client';

import { useEffect } from 'react';

interface CustomErrorProps {
  error: Error;
  reset: () => void;
}

export default function CustomError({ error, reset }: CustomErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]); // Added `error` to the dependency array

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
