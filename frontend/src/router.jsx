import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import About from "./pages/About";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Root Layout (optional)
const rootRoute = createRootRoute({
  component: () => (
    <>
      <h1 className="text-center text-2xl font-bold p-4">Company Map Viewer</h1>
      <Outlet />
    </>
  ),
});

// Define Routes
const homeRoute = createRoute({
  path: "/",
  component: Home,
});
const aboutRoute = createRoute({
  path: "/about",
  component: About,
});
const notFoundRoute = createRoute({
  path: "*",
  component: NotFound,
});

// Create Router
const routeTree = rootRoute.addChildren([homeRoute, aboutRoute, notFoundRoute]);

const router = createRouter({ routeTree });

export default function AppRouter() {
  return <RouterProvider router={router} />;
}