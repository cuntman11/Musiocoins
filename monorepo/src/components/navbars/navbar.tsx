'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/buttons/toggleThemeButton"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { useSidebar } from "@/components/ui/sidebar"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { WEBSITE_LOGO_PATH as LOGO_PATH, WEBSITE_NAME, WEBSITE_TITLE_FONT as WEBSITE_FONT } from "@/utils/constants/navbar-constants"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "/docs", label: "Documentation" },
    { href: "/create-coin", label: "Create a coin" },
    { href: "/trade-coin", label: "Trade a coin" },
    { href: "/profile", label: "Profile" },
    { href: "/coin-explorer", label: "Explore" },
  ];

  const serviceItems = [
    {
      href: "/create-coin",
      title: "Create a coin",
      description: "Tokenise digital content",
      icon: "🪙"
    },
    {
      href: "/trade-coin",
      title: "Trade a coin",
      description: "Trade coins",
      icon: "💱"
    },

    {
      href: "/profile",
      title: "Profile",
      description: "View your profile",
      icon: "👤"
    },
    {
      href: "/coin",
      title: "Coins",
      description: "Search for your favorite coins",
      icon: "🔍"
    },
     {
      href: "/coin-explorer",
      title: "Coin Explorer",
      description: "Discover and trade new coins",
      icon: "🌟"
    },
  ];

  return (
    <nav className="sticky top-0 h-18 w-full border-b border-blue-200/20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 backdrop-blur-md z-50 shadow-lg shadow-blue-500/5">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="relative">
              <Image 
                src={LOGO_PATH} 
                alt="Logo" 
                width={200} 
                height={200}
                className="w-12 h-12 md:w-20 md:h-20 rounded-xl transition-all duration-300"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
            </div>
            <span className={`text-2xl md:text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-bold ${WEBSITE_FONT} hidden sm:block group-hover:from-blue-700 group-hover:to-indigo-700 dark:group-hover:from-blue-300 dark:group-hover:to-indigo-300 transition-all duration-300`}>
              {WEBSITE_NAME}
            </span>
          </Link>
        </div>
        
        <div className="hidden lg:flex flex-1 items-center justify-end gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link 
                      href={item.href} 
                      className="group inline-flex h-10 w-max items-center justify-center rounded-lg bg-white/50 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:text-blue-800 dark:hover:text-blue-200 hover:shadow-md hover:shadow-blue-500/20 focus:bg-blue-100 dark:focus:bg-blue-800/50 focus:text-blue-800 dark:focus:text-blue-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50 border border-blue-200/30 dark:border-blue-700/30"
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="hidden md:block">
            <div className="relative">
              <ConnectButton />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <ModeToggle />
        </div>

        <div className="flex lg:hidden flex-1 items-center justify-end gap-2">
          <div className="md:hidden">
            <div className="relative">
              <ConnectButton />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <ConnectButton />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <ModeToggle />
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden bg-white/50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 border border-blue-200/30 dark:border-blue-700/30 rounded-lg shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all duration-300">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200/20 dark:border-blue-700/20">
              <div className="flex flex-col space-y-4 mt-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2 pb-4 border-b border-blue-200/30 dark:border-blue-700/30 group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative">
                    <Image 
                      src={LOGO_PATH} 
                      alt="Logo" 
                      width={40} 
                      height={40}
                      className="w-10 h-10 rounded-lg shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300"
                    />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className={`text-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-bold ${WEBSITE_FONT} group-hover:from-blue-700 group-hover:to-indigo-700 dark:group-hover:from-blue-300 dark:group-hover:to-indigo-300 transition-all duration-300`}>
                    {WEBSITE_NAME}
                  </span>
                </Link>
                
                <div className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 rounded-lg text-base font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-300 border border-transparent hover:border-blue-200/30 dark:hover:border-blue-700/30 hover:shadow-md hover:shadow-blue-500/10"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="pt-2 border-t border-blue-200/30 dark:border-blue-700/30">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 px-3 py-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Services
                    </div>
                    {serviceItems.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block px-6 py-3 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all duration-300 border border-transparent hover:border-blue-200/30 dark:hover:border-blue-700/30 hover:shadow-md hover:shadow-blue-500/10"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{service.icon}</span>
                          <div>
                            <div className="font-medium text-blue-800 dark:text-blue-200">{service.title}</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {service.description}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}