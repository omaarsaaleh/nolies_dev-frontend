"use client"

import type * as React from "react"
import { LogOut } from "lucide-react"
import { SidebarMenuGroup } from "./SidebarMenuGroup"
import { SidebarUser } from "./SidebarUser"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarMenuButton } from "@/components/ui/sidebar"
import type { User } from "@/types/ui/navigation"
import type { SidebarSection } from "@/types/ui/navigation"
import { useLogout } from "@/context/auth/use-logout";


type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User
  sidebarSections: SidebarSection[]
};

export function AppSidebar({ user, sidebarSections, ...props }: AppSidebarProps) {
  const logout = useLogout(); 
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarSections.map((section, index) => (
          <SidebarMenuGroup key={index} label={section.title} items={section.menuItems} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton tooltip="Logout" onClick={() => logout.mutate()}>
            <LogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
