import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboardComponents/dashboardSidebar"

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col w-full mx-auto">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
