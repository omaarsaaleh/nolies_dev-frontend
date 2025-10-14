import Navbar from "@/components/features/common/navbar";
import type { User as NavbarUser } from "@/types/ui/navbar";
import { menuItems as defaultNavigationLinks, profileLinks as defaultProfileLinks } from "@/constants/ui/navbar";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useUser } from "@/context/auth/use-user";
import { useNavigate } from "react-router-dom";

export type PageProps = React.HTMLAttributes<HTMLDivElement> & {
  contentClassName?: string;
};

export default function Page({
  className,
  contentClassName,
  children,
  ...props
}: PageProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const derivedNavbarUser: NavbarUser | null = React.useMemo(() => {
    if (!user) return null;
    return {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      avatarUrl: null,
    };
  }, [user]);
  

  return (
    <div className={cn("min-h-screen flex flex-col", className)} {...props}>
      <Navbar
        navigationLinks={defaultNavigationLinks}
        profileLinks={defaultProfileLinks}
        user={derivedNavbarUser}
        signInText={"Login"}
        onSignInClick={() => navigate('/login')}
        showCta= {false}
      />

      <main className={cn("flex-1", contentClassName)}>
        <div className="container mx-auto max-w-screen-2xl px-4 md:px-6 py-3 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
