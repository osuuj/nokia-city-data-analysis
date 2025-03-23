/**
 * HomeFooter
 * A minimal footer variant used on the `/home` route.
 */
export const HomeFooter = () => {
  return (
    <footer className="text-center">
      <p className="text-default-500 text-small">
        © {new Date().getFullYear()} <strong>Osuuj</strong>. All rights reserved.
      </p>
    </footer>
  );
};
