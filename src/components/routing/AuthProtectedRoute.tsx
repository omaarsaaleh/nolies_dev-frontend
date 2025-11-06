import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/context/auth/use-user";

export function AuthProtectedRoute() {
  const { user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />;
  }

  if (!user.is_verified && location.pathname !== "/verify-account") {
    return <Navigate to="/verify-account" replace />;
  }

  if (user.is_verified && location.pathname === "/verify-account") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
