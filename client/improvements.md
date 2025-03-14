1️⃣ ThemeSwitch.tsx (✅ Good but Small Improvements)
📌 Current State:

Uses useTheme from next-themes to toggle between light/dark modes.
Uses useState to handle mounting logic.
Works efficiently but can be optimized slightly.
✅ Suggestions
Remove unnecessary state (mounted):

Instead of using useState to track mounting, next-themes provides resolvedTheme, which can be used directly.
Move VisuallyHidden inside Button for accessibility.

Ensure the button remains interactive while loading.

2️⃣ Hero.tsx (❗ Needs Cleanup)
📌 Current State:

Uses a video background.
Has hardcoded text inside JSX.
Calls a ButtonStart component.
✅ Suggestions
Extract text into a configuration file (/config/site.ts).

This improves internationalization (i18n) support.
Ensure video loading is efficient:

Use the loading="lazy" attribute.
Provide a static fallback image.
Improve ButtonStart usage:

Pass the button label and destination as props instead of hardcoding.
3️⃣ layout.tsx (✅ Good but Needs Cleanup)
📌 Current State:

Sets global styles, fonts, metadata.
Loads a script to handle dark mode.
Wraps content with a Providers component.
✅ Suggestions
Move theme-related scripts to a useEffect inside ThemeSwitch.tsx.

This avoids inline scripts and improves security.
Ensure fonts are preloaded correctly.

Google Fonts should use the latest @next/font instead of <link>.
Optimize ConditionalLayout.

If all pages use the same structure, remove unnecessary layout logic.
4️⃣ Footer.tsx (✅ Good but Can Be Optimized)
📌 Current State:

Uses a navigation menu inside the footer.
Social media icons are mapped from an array.
✅ Suggestions
Use Next.js next/link for internal links instead of @heroui/react/Link.

This ensures preloading benefits.
Move navLinks and socialItems to a config file.

Example: /config/site.ts.
5️⃣ Navbar.tsx (❗ Needs Refactoring for Modularity)
📌 Current State:

Large component with multiple responsibilities:
Renders Logo.
Handles mobile menu state.
Implements search input & GitHub icon.
Calls ThemeSwitch.
✅ Suggestions
Break it down into smaller components:

NavbarBrand.tsx → For logo & menu toggle.
NavbarLinks.tsx → For menu items.
NavbarActions.tsx → For search, GitHub, and theme switch.
Ensure accessibility (aria-labels, role="navigation").

6️⃣ page.tsx (Landing Page) (✅ Good, Minor Fixes)
📌 Current State:

Simply renders Hero.tsx inside a section.
✅ Suggestions
If future components are added, make sure they are lazy-loaded.
tsx
Copy
Edit
import dynamic from 'next/dynamic';
const Hero = dynamic(() => import('@/components/common/Hero'), { ssr: false });
7️⃣ Button.tsx (❗ Needs Modularity)
📌 Current State:

Uses a gradient button wrapped in next/link.
✅ Suggestions
Pass button text & href as props.
tsx
Copy
Edit
export default function ButtonStart({ label = "Start Exploring", href = "/home" }) {
  return (
    <Link href={href}>
      <Button className="bg-gradient-to-tr from-blue-800 to-blue-400 text-white shadow-lg">
        {label}
      </Button>
    </Link>
  );
}