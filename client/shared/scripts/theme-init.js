// Theme initialization script
// This script runs immediately in the <head> to prevent flash of wrong theme
(() => {
  try {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const savedTheme = localStorage.getItem('theme');
    const finalTheme = savedTheme || systemTheme;

    // Set data-theme attribute for component library
    document.documentElement.setAttribute('data-theme', finalTheme);

    // Add theme class for immediate styling
    document.documentElement.classList.add(finalTheme === 'dark' ? 'dark-theme' : 'light-theme');
  } catch (e) {
    // Fallback to dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark-theme');
  }
})();
