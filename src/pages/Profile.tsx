import { useUser } from "@/context/auth/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogout } from "@/context/auth/use-logout";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useUser();
  const logoutMutation = useLogout();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              Hello, {user?.first_name} {user?.last_name}!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Email: {user?.email}
            </p>
            <p className="text-sm text-muted-foreground">
              Username: {user?.username}
            </p>
            <p className="text-sm text-muted-foreground">
              Status: {user?.is_verified ? "✅ Verified" : "❌ Not Verified"}
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button variant="outline" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
