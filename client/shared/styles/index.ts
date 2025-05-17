/**
 * Global styles organization
 *
 * Files:
 * - critical.css  : Minimal styles to prevent flash of unstyled content (should be inlined in head)
 * - globals.css   : Main stylesheet with theme handling and base styles
 * - utilities.css : Utility classes and custom CSS utilities
 * - mobile.css    : Mobile-specific optimizations (imported by specific pages that need it)
 */

// Import critical CSS first to ensure it's loaded before other styles
import './critical.css';

// Import main styles
import './globals.css';

// Import utilities
import './utilities.css';

// This file serves as a central import point for all shared styles
// The actual styles are imported in the app/layout.tsx file via app/globals.css
