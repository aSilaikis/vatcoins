"use client"

import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Bitcoin, Mail, LogOut, Github, Linkedin, Instagram, Facebook, ChevronDown, Book, Loader2 } from "lucide-react"

import { useRouter } from "next/navigation"

export function AppSidebar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Logout failed")
      }
      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error.message)
      router.replace("/")
      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar className="w-64 h-screen">
      <SidebarHeader>
        <div className="flex items-center space-x-3">
          <img
            className="w-14 h-14 bg-background border rounded-full"
            src="/web-app-manifest-192x192.png"
            alt="varCoins logo"
          />
          <h1 className="text-3xl font-bold"><a href="/dashboard">vatCoins</a></h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="m-0" />
        {/* Group: Crypto */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-semibold flex items-center pb-2">
            <a href="/dashboard">Crypto</a>
          </SidebarGroupLabel>
        </SidebarGroup>
        <SidebarSeparator className="m-0" />
        {/* Group: Contact */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-semibold flex items-center pb-2">
            Contact
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/about">
                  <Book className="mr-2 h-6 w-6" /> About
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/contact">
                  <Mail className="mr-2 h-6 w-6" /> Contact
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="m-0" />
        {/* Group: Account */}
        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-2xl font-semibold flex items-center cursor-pointer pb-2">
                Account menu
                <ChevronDown className="ml-2 h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/watchlist">
                      <Bitcoin className="mr-2 h-6 w-6" /> Watchlist
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-6 w-6" /> Logout
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="m-0" />
      <SidebarFooter>
        <div className="flex justify-around p-4">
          <a href="https://github.com/aSilaikis?tab=repositories" className="text-neutral-700 hover:text-neutral-400 ease-in-out duration-200">
            <Github className="h-6 w-6 hover:scale-125" />
          </a>
          <a href="https://www.instagram.com/arnas.silaikis/?utmsource=gr&igsh=bW16Z29rajFINHVx" className="text-orange-700 hover:text-orange-500 ease-in-out duration-200">
            <Instagram className="h-6 w-6 hover:scale-125" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100007990363206" className="text-blue-700 hover:text-blue-500 ease-in-out duration-200">
            <Facebook className="h-6 w-6 hover:scale-125" />
          </a>
          <a href="www.linkedin.com/in/arnas-silaikis" className="text-sky-700 hover:text-sky-500 ease-in-out duration-200">
            <Linkedin className="h-6 w-6 hover:scale-125" />
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}