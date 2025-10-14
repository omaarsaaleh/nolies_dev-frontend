import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/context/auth/use-user";

export function UnauthRoute() {
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
  // if authenticated redirect 
  if (user) {
    const redirectTo = location.state?.redirectTo;
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <Navigate to="/" replace />;
  }
  // else can access
  return <Outlet />;
}
