"use client"

import {
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import type {User} from '@/types/ui/navigation.tsx';

export function SidebarUser({ user }: { user: User }) {
  return(
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-2 p-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback className="rounded-lg">{(user.firstName[0] + user.lastName[0]).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.username}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}