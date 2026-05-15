import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { type ReactNode, useEffect } from "react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wraps authenticated-only sections.
 * Shows a loading spinner while auth initialises.
 * Renders fallback (or null) when unauthenticated.
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If not loading and not authenticated, auto-redirect to login
    if (!isLoading && !isAuthenticated) {
      // Handled by parent — do nothing here; App.tsx guards routes
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground text-sm font-body">
            Initializing CreatorOS…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
