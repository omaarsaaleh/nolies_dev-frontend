"use client"

import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type {MenuItem} from '@/types/ui/navigation' ;
import type { User } from "@/types/ui/navigation";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useLogout } from "@/context/auth/use-logout";
import { ThemeToggle } from "@/components/common/ThemeToggle";



// -------------------
// Logo
// -------------------
export function Logo(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 324 323"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="88.1023"
        y="144.792"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 88.1023 144.792)"
        fill="currentColor"
      />
      <rect
        x="85.3459"
        y="244.537"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 85.3459 244.537)"
        fill="currentColor"
      />
    </svg>
  )
}

// -------------------
// Hamburger Icon
// -------------------
export function HamburgerIcon({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      className={cn("cursor-pointer", className)}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 12L20 12"
        className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
      />
      <path
        d="M4 12H20"
        className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
      />
      <path
        d="M4 12H20"
        className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
      />
    </svg>
  )
}

// -------------------
// Types
// -------------------


export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  logoHref?: string
  navigationLinks: MenuItem[]
  profileLinks: MenuItem[]
  signInText?: string
  signInHref?: string
  onSignInClick?: () => void
  ctaText?: string
  ctaHref?: string
  onCtaClick?: () => void,
  showCta?: boolean,
  user?: User | null

}


// -------------------
// Mobile Navigation
// -------------------
function MobileNav({ links }: { links: MenuItem[] }) {
  const location = useLocation();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground cursor-pointer"
          variant="ghost"
          size="icon"
        >
          <HamburgerIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-fit p-2">
        <NavigationMenu className="max-w-none">
          <NavigationMenuList className="flex-col items-start gap-1">
            {links.map((link, index) => {
              if (link.type === "link") {
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <NavigationMenuItem key={index} className="w-full">
                    <Link
                      to={link.to}
                      className={cn(
                        "group inline-flex h-9 w-full items-center justify-center rounded-md px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer no-underline text-md",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      {link.title}
                    </Link>
                  </NavigationMenuItem>
                )
              }
              return null;
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </PopoverContent>
    </Popover>
  )
}

// -------------------
// Desktop Navigation
// -------------------
function DesktopNav({ links }: { links: MenuItem[] }) {
  const location = useLocation();
  
  return (
    <NavigationMenu className="flex">
      <NavigationMenuList className="gap-1">
        {links.map((link, index) => {
          if (link.type === "link") {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <NavigationMenuItem key={index}>
                <Link 
                  to={link.to} 
                  className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer no-underline text-md",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  {link.title}
                </Link>
  
              </NavigationMenuItem>
            )
          }
          return null;
        })}
      </NavigationMenuList>

          
        
    </NavigationMenu>
  )
}

// -------------------
// User Menu (avatar + dropdown)
// -------------------
function UserMenu(
{ 
  user,
  profileLinks
}
: 
{ 
  user: NavbarProps["user"],
  profileLinks: MenuItem[]
}
) {
  const navigate = useNavigate();
  const logout = useLogout();
  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{fullName}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          profileLinks.map((profileLink, index) => {
            if(profileLink.type === 'link'){
              return(
                <DropdownMenuItem onClick={() => navigate(profileLink.to)} key={index} className="cursor-pointer">
                  {profileLink.title}
                </DropdownMenuItem>
              )
            }
            else if(profileLink.type === 'button'){
              return (
                <DropdownMenuItem onClick={profileLink.action} key={index} className="cursor-pointer">
                  {profileLink.title}
                </DropdownMenuItem>
              )
            }
            else{
              return null;
            }
          })
        }
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout.mutate()} className="cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


// -------------------
// Actions
// -------------------
function NavbarActions({
  signInText,
  ctaText,
  onSignInClick,
  onCtaClick,
  user,
  profileLinks,
  showCta = false
}: {
  signInText: string
  onSignInClick?: () => void
  ctaText: string
  onCtaClick?: () => void,
  showCta?: boolean,
  user?: NavbarProps["user"]
  profileLinks: MenuItem[]
}) {
  return (
    <div className="flex items-center gap-3">
      
      {user ? (
        <UserMenu user={user} profileLinks={profileLinks} />
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-medium hover:bg-accent hover:text-accent-foreground px-4 h-9 rounded-md cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              onSignInClick?.()
            }}
          >
            {signInText}
          </Button>
          {
            showCta? (
              <Button
                size="sm"
                className="text-sm font-medium px-4 h-9 rounded-md shadow-sm cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  onCtaClick?.()
                }}
              >
                {ctaText}
              </Button>
            ) : null
          }
        </>
      )}
    </div>
  )
}

// -------------------
// Navbar (main)
// -------------------
export default function Navbar({
  className,
  logo = <Logo />,
  navigationLinks,
  signInText = "Sign In",
  onSignInClick,
  showCta = false,
  ctaText = "Contribute",
  onCtaClick,
  user = null,
  profileLinks,
  ...props
}: NavbarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        setIsMobile(containerRef.current.offsetWidth < 768)
      }
    }
    checkWidth()
    const resizeObserver = new ResizeObserver(checkWidth)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <header
      ref={containerRef}
      className={cn(
        "sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-1 md:px-6 [&_*]:no-underline",
        className
      )}
      {...props}
    >
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {isMobile && <MobileNav links={navigationLinks} />}
          <div className="flex items-center gap-6">
            <button
              onClick={(e) => e.preventDefault()}
              className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
            >
              <div className="text-2xl">{logo}</div>
              <span className="hidden font-bold text-xl sm:inline-block">
                shadcn.io
              </span>
            </button>
            {!isMobile && <DesktopNav links={navigationLinks} />}
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-row gap-2">
          <ThemeToggle />
          <NavbarActions
            signInText={signInText}
            ctaText={ctaText}
            onSignInClick={onSignInClick}
            onCtaClick={onCtaClick}
            user={user}
            profileLinks={profileLinks}
            showCta = {showCta}
          />
        </div>
      </div>
    </header>
  )
}
