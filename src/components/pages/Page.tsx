import Navbar from "@/components/navbar/navbar";
import type { User as NavbarUser } from "@/types/ui/navigation";
import { navbarMenuItems as defaultNavigationLinks, navbarProfileMenuItems as defaultProfileLinks } from "@/constants/ui/navigation";
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
      username: user.username,
      avatarUrl: undefined,
    };
  }, [user]);
  

  return (
    <div className={cn("min-h-screen flex flex-col ", className)} {...props}>
      <Navbar
        navigationLinks={defaultNavigationLinks}
        profileLinks={defaultProfileLinks}
        user={derivedNavbarUser}
        signInText={"Login"}
        onSignInClick={() => navigate('/login')}
        showCta= {false}
      />

      <main className={cn("flex-1", contentClassName)}>
        <div className="
          container 
          mx-auto 
          max-w-screen-lg 
          px-6 
          md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
