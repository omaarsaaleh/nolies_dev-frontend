import type { LucideIcon } from "lucide-react"

export type User = {
  firstName: string
  lastName: string
  username: string
  email: string
  avatarUrl?: string
}

export interface BaseMenuItem {
  title: string
  icon?: LucideIcon
  isActive?: boolean
}

export interface LinkMenuItem extends BaseMenuItem {
  type: "link"
  to: string
}

export interface TriggerMenuItem extends BaseMenuItem {
  type: "trigger"
  prefixTo: string
  menu: {
    title: string
    to: string
    desc?: string 
  }[]
}

export interface ButtonMenuItem extends BaseMenuItem {
  type: "button"
  action: () => void
}

export function isLinkMenuItem(item: MenuItem): item is LinkMenuItem {
  return item.type == 'link' ;
}

export function isTriggerMenuItem(item: MenuItem): item is TriggerMenuItem {
  return item.type == 'trigger' ;
}

export function isButtonMenuItem(item: MenuItem): item is ButtonMenuItem {
  return item.type == 'button' ;
}

export type MenuItem = LinkMenuItem | TriggerMenuItem | ButtonMenuItem;


export interface SidebarSection{
  title?: string
  menuItems: MenuItem[]
}