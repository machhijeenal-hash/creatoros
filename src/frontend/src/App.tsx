import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";

// Lazy-loaded pages
const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AIStudio = lazy(() => import("@/pages/AIStudio"));
const ContentPlanner = lazy(() => import("@/pages/ContentPlanner"));
const Productivity = lazy(() => import("@/pages/Productivity"));
const Subscriptions = lazy(() => import("@/pages/Subscriptions"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Settings = lazy(() => import("@/pages/Settings"));

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

// Root layout — wraps all routes
function RootLayout() {
  return <Outlet />;
}

// Authenticated app shell
function AuthenticatedShell() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    // Redirect to login
    login();
    return <PageLoader />;
  }

  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}

// Route tree
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Landing />
    </Suspense>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Login />
    </Suspense>
  ),
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AuthenticatedShell,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/dashboard",
  component: Dashboard,
});

const aiStudioRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/ai-studio",
  component: AIStudio,
});

const contentPlannerRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/content-planner",
  component: ContentPlanner,
});

const productivityRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/productivity",
  component: Productivity,
});

const analyticsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/analytics",
  component: Analytics,
});

const subscriptionsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/subscriptions",
  component: Subscriptions,
});

const settingsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/settings",
  component: Settings,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  appRoute.addChildren([
    dashboardRoute,
    aiStudioRoute,
    contentPlannerRoute,
    productivityRoute,
    subscriptionsRoute,
    analyticsRoute,
    settingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
