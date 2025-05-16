import { useS3Download } from '@/shared/hooks/api/useS3Download';
import { Button } from '@heroui/button';
import { Icon } from '@iconify/react';
import { useState } from 'react';

interface DownloadResumeButtonProps {
  profileId: string;
  label?: string;
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DownloadResumeButton = ({
  profileId,
  label = 'Download CV',
  variant = 'solid',
  size = 'md',
  className = '',
}: DownloadResumeButtonProps) => {
  const fileKey = `resumes/${profileId}.pdf`;
  const { downloadFile, isLoading, error } = useS3Download();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleDownload = async () => {
    if (isLoading) return; // Prevent multiple simultaneous downloads

    const success = await downloadFile(fileKey, `${profileId}-resume.pdf`);

    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else if (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="relative">
      <Button
        onPress={handleDownload}
        variant={variant}
        size={size}
        disabled={isLoading}
        endContent={<Icon icon="lucide:download" />}
        className={`shadow-lg ${className}`}
      >
        {isLoading ? 'Downloading...' : label}
      </Button>

      {showSuccess && (
        <div className="absolute top-full mt-2 bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
          Download successful!
        </div>
      )}

      {showError && (
        <div className="absolute top-full mt-2 bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
          {error?.includes('404') ? `Resume not available for ${profileId}` : error}
        </div>
      )}
    </div>
  );
};
