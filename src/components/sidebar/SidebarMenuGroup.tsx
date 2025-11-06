"use client"

import { ChevronRight } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { type MenuItem, isButtonMenuItem, isLinkMenuItem, isTriggerMenuItem } from "@/types/ui/navigation.ts";
import { Link } from "react-router-dom";

export function SidebarMenuGroup({
  label,
  items,
  defaultOpen,
}: {
  label?: string
  items: MenuItem[]
  defaultOpen?: boolean
}) {
  return (
    <SidebarGroup>
      {
        label && (<SidebarGroupLabel>{label}</SidebarGroupLabel>)
      }
      <SidebarMenu>
        {items.map((item, index) => {
          if (isLinkMenuItem(item)) {
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link to={item.to}>
                    {
                      item.icon && (
                        <item.icon />
                      )
                    }
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          if (isTriggerMenuItem(item)) {
            return (
              <Collapsible key={item.title} asChild defaultOpen={defaultOpen}>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={item.title}>
                    {
                      item.icon && (
                        <item.icon />
                      )
                    }
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.menu.map((subItem, index) => (
                        <SidebarMenuSubItem key={index}>
                          <SidebarMenuSubButton asChild>
                            <Link to={item.prefixTo + subItem.to}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }
          else if(isButtonMenuItem(item)){
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} onClick={item.action} isActive={item.isActive}>
                  {
                    item.icon && (
                      <item.icon />
                    )
                  }
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          return null
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}