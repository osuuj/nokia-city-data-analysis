/**
 * DashboardFooter
 * A minimal footer variant used on the `/dashboard` route.
 */
export const DashboardFooter = () => {
  return (
    <footer className="text-center">
      <p className="text-default-500 text-small">
        © {new Date().getFullYear()} <strong>Osuuj</strong>. All rights reserved.
      </p>
    </footer>
  );
};
