'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  Search,
  Bell,
  User,
  ChevronRight,
  ChevronLeft,
  LogOut,
  HelpCircle,
  BatteryPlusIcon,
  Wallet,
  Shield,
  Sparkles,
  Crown,
  Zap,
} from "lucide-react"

import { useAccount, useChainId, useDisconnect } from "wagmi";

import { Button } from "@/components/ui/button"

const mainNavItems = [
  {
    title: "Coin explorer",
    icon: Home,
    url: "/coin-explorer",
    badge: "New",
    emoji: "🏠"
  },
  {
    title: "Users",
    icon: Users,
    url: "/users",
    emoji: "👥",
    items: [
      { title: "Profile (Me)", url: "/profile", emoji: "👤" },
    ],
  },
  {
    title: "Coins",
    icon: FileText,
    url: "/coin",
    emoji: "🪙",
    items: [
      { title: "Explore coins", url: "/coin", emoji: "🔍" },
      { title: "Create coin", url: "/create-coin", emoji: "➕" },
      { title: "Trade coin", url: "/trade-coin", emoji: "💱" },
    ],
  },
  {
    title: "MusiBot",
    icon: BatteryPlusIcon,
    url: "/chatbot",
    badge: "AI",
    emoji: "🤖"
  },
]

const quickActions = [
  {
    title: "Docs",
    icon: Search,
    url: "/docs",
    emoji: "📚"
  },
  {
    title: "About us",
    icon: HelpCircle,
    url: "/",
    emoji: "ℹ️"
  },
]

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar()
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative">
      <Sidebar className="border-r border-blue-200/30 dark:border-blue-700/30 bg-gradient-to-b from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 backdrop-blur-sm">
        <SidebarHeader className="border-b border-blue-200/30 dark:border-blue-700/30 p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Dashboard
              </h2>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Welcome back!
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="group">
                      <a href={item.url} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 border border-transparent hover:border-blue-200/30 dark:hover:border-blue-700/30">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-lg">{item.emoji}</span>
                          <div className="flex-1">
                            <span className="text-blue-800 dark:text-blue-200 font-medium">{item.title}</span>
                            {item.badge && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        {item.items && (
                          <ChevronRight className="ml-auto h-4 w-4 text-blue-500 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                        )}
                      </a>
                    </SidebarMenuButton>
                    {item.items && (
                      <SidebarMenuSub className="ml-6 mt-2 space-y-1">
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url} className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">
                                <span className="text-sm">{subItem.emoji}</span>
                                <span className="text-sm">{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 border border-transparent hover:border-blue-200/30 dark:hover:border-blue-700/30">
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-blue-800 dark:text-blue-200 font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-blue-200/30 dark:border-blue-700/30 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/80 dark:to-indigo-950/80">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-auto p-4">
                <div className="flex items-center gap-3 bg-white/50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200/30 dark:border-blue-700/30 shadow-sm">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    {isConnected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {isConnected && address ? formatAddress(address) : "Connect Wallet"}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {chainId ? `Chain ID: ${chainId}` : "No connection"}
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-500 flex items-center gap-1 mt-1">
                      <Shield className="w-3 h-3" />
                      Base mainnet recommended
                    </p>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 border border-transparent hover:border-blue-200/30 dark:hover:border-blue-700/30">
                  <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-800 dark:text-blue-200 font-medium">Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isConnected && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    onClick={handleDisconnect}
                    className="flex w-full items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-transparent hover:border-red-200/30 dark:hover:border-red-700/30"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Disconnect Wallet</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      
      <Button
        variant="outline"
        size="sm"
        className="absolute -right-3 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-900 p-0 shadow-lg shadow-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-800 hover:shadow-blue-500/30 transition-all duration-300"
        onClick={toggleSidebar}
      >
        {open ? (
          <ChevronLeft className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        )}
      </Button>
    </div>
  )
}