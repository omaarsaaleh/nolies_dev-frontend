import { useUser } from "@/context/auth/use-user";
import * as React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import type { User as NavigationUser } from "@/types/ui/navigation";
import { sidebarSections } from "@/constants/ui/navigation";
import {  useLocation, Outlet, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { House } from "lucide-react";
import { Button } from "../ui/button";

function getPageTitle(pathname: string): string {
  // TODO: Handle /profile
  // const isIndexRoute = pathname === "/profile" || pathname === "/profile/";
  
  for (const section of sidebarSections) {
    for (const item of section.menuItems) {
      if (item.type === "link" && item.to === pathname) {
        return item.title;
      }
      if (item.type === "trigger" && item.menu) {
        for (const subItem of item.menu) {
          const fullPath = item.prefixTo + subItem.to;
          if (fullPath === pathname ) {
            return subItem.title;
          }
        }
      }
    }
  }
  
  return "Profile";
}

export default function ProfilePage() {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const derivedUser: NavigationUser | null = React.useMemo(() => {
    if (!user) return null;
    return {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      username: user.username,
      avatarUrl: undefined,
    };
  }, [user]);

  const currentPageTitle = React.useMemo(
    () => getPageTitle(location.pathname),
    [location.pathname]
  );

  if (!derivedUser) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        user={derivedUser} 
        sidebarSections={sidebarSections} 
        className="border-r border-solid" 
      />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <span>{currentPageTitle}</span>
          </div>
          <div className=" flex gap-2 justify-center items-center">
            <ThemeToggle/>
            <Button variant="outline" size="icon" onClick={() => navigate('/')}>
              <House className="absolute h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-2 md:px-4 pt-6 md:pt-8">
          <Outlet/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

