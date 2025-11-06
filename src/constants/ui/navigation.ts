import type { MenuItem, SidebarSection } from "@/types/ui/navigation";
import {
  User,
  ShieldCheck,
  Briefcase
} from "lucide-react";


export const navbarMenuItems: MenuItem[] = [
  { type: "link", title: "Companies", to: "/companies" },
  { type: "link", title: "Locations", to: "/locations" },
  { type: "link", title: "Technologies", to: "/technologies" },
]

export const navbarProfileMenuItems: MenuItem[] = [
  {
    to: "/profile",
    type: "link",
    title : "Profile"
  },
  {
    to: "/settings",
    type: "link",
    title: "Settings"
  }
]

export const sidebarSections: SidebarSection[] = [
  {
    menuItems: [
      {
        type: "trigger",
        title: "Account",
        prefixTo: "/profile",
        icon: User,
        menu: [
          {
            title: "Change Password",
            to: "/change-password",
          }
        ],
      },
      {
        type: "link",
        title: "Workplace Verifications",
        to: '/profile/workplace-verifications',
        icon: ShieldCheck
      },
      {
        type: "link",
        title: "Work Experiences",
        to: '/profile/work-experiences',
        icon: Briefcase
      }
    ]
  }
]

