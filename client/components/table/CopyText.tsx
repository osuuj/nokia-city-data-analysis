import { Button, Tooltip, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';
import { forwardRef, memo, useEffect, useMemo, useState } from 'react';

export interface CopyTextProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  textClassName?: string;
  copyText?: string;
  children: string;
}

export const CopyText = memo(
  forwardRef<HTMLDivElement, CopyTextProps>((props, forwardedRef) => {
    const { className, textClassName, children, copyText = 'Copy' } = props;
    const [copied, setCopied] = useState(false);
    const [copyTimeout, setCopyTimeout] = useState<NodeJS.Timeout | null>(null);

    // ✅ Cleanup timeout on component unmount to prevent memory leaks
    useEffect(() => {
      return () => {
        if (copyTimeout) {
          clearTimeout(copyTimeout);
        }
      };
    }, [copyTimeout]);

    const handleClick = () => {
      if (!navigator.clipboard) {
        console.error('Clipboard API not available');
        return;
      }

      navigator.clipboard
        .writeText(children)
        .then(() => {
          setCopied(true);

          const timeout = setTimeout(() => {
            setCopied(false);
          }, 3000);

          setCopyTimeout(timeout);
        })
        .catch((err) => {
          console.error('Failed to copy text:', err);
        });
    };

    const tooltipContent = useMemo(() => (copied ? 'Copied!' : copyText), [copied, copyText]);

    return (
      <div ref={forwardedRef} className={cn('flex items-center gap-3 text-default-500', className)}>
        <span className={textClassName}>{children}</span>
        <Tooltip className="text-foreground" content={tooltipContent}>
          <Button
            isIconOnly
            className="h-7 w-7 min-w-7 text-default-400"
            size="sm"
            variant="light"
            onPress={handleClick}
          >
            {copied ? (
              <Icon className="h-[14px] w-[14px]" icon="solar:check-read-linear" />
            ) : (
              <Icon className="h-[14px] w-[14px]" icon="solar:copy-linear" />
            )}
          </Button>
        </Tooltip>
      </div>
    );
  }),
);

CopyText.displayName = 'CopyText';
