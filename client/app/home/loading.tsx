'use client';

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <video src="../puplic/logo-animation.mp4" autoPlay loop muted className="w-24 h-24" />
      <p className="mt-4 text-gray-500">Loading map...</p>
    </div>
  );
}
