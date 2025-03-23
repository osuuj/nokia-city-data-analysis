import type { IconSvgProps } from '@/types';

/**
 * ArrowDownIcon
 * A downward-facing arrow SVG used for dropdowns or sorting indicators.
 */
export const ArrowDownIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    viewBox="0 0 12 12"
    width="1em"
    {...props}
  >
    <path
      d="M3 4.5L6 7.5L9 4.5"
      stroke="#71717A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);
