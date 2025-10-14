import type { MenuItem, User } from "@/types/ui/navbar";


export const menuItems: MenuItem[] = [
  { type: "link", title: "Companies", to: "/companies" },
  { type: "link", title: "Locations", to: "/locations" },
  { type: "link", title: "Technologies", to: "/technologies" },
  // {
  //   type: "trigger",
  //   title: "Components",
  //   prefixTo: "/components",
  //   menu: [
  //       { title: "Alert Dialog", to: "/alert-dialog", desc: "A modal dialog that interrupts the user" },
  //       { title: "Hover Card", to: "/hover-card", desc: "Preview content behind a link" },
  //     ],
  // },
  { type: "link", title: "Salaries", to: "/salaris" },
]


export const exampleUser: User = {
  firstName: "Omar",
  lastName: "Saleh",
  email: "omaarsaaleh1@gmail.com",
  avatarUrl: null, 
}

export const profileLinks: MenuItem[] = [
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


