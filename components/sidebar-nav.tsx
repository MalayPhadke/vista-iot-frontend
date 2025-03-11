"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Circle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"

interface SidebarNavProps {
  items: {
    title: string
    href: string
    icon: LucideIcon
    active?: boolean
    badge?: string
    submenu?: {
      title: string
      href: string
      icon: LucideIcon
    }[]
  }[]
  sidebarOpen: boolean
}

export function SidebarNav({ items, sidebarOpen }: SidebarNavProps) {
  const router = useRouter()
  // Track which menus are open
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})

  const toggleSubmenu = (title: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const handleItemClick = (href: string, hasSubmenu: boolean, title: string) => {
    if (hasSubmenu) {
      toggleSubmenu(title)
    } else {
      router.push(href)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 space-y-1">
        <ul className="space-y-1">
          {items.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isOpen = openMenus[item.title]

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleItemClick(item.href, hasSubmenu, item.title)
                  }}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                    item.active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {sidebarOpen && (
                      <span className="flex-1 truncate">{item.title}</span>
                    )}
                  </div>
                  {hasSubmenu && sidebarOpen && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                  {item.badge && sidebarOpen && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>

                {/* Submenu */}
                {hasSubmenu && isOpen && sidebarOpen && (
                  <div className="mt-1">
                    <ul className="space-y-1 pl-8">
                      {item.submenu.map((subitem) => (
                        <li key={subitem.title}>
                          <Link
                            href={subitem.href}
                            onClick={(e) => {
                              e.preventDefault()
                              router.push(subitem.href)
                            }}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            <subitem.icon className="h-4 w-4" />
                            <span className="flex-1 truncate">{subitem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* System Status Section */}
      {sidebarOpen && (
        <div className="border-t pt-4 mt-4">
          <div className="px-3 mb-2 text-sm font-medium text-muted-foreground">
            System Status
          </div>
          <div className="space-y-2">
            <div className="flex items-center px-3 py-1">
              <Circle className="h-2 w-2 mr-2 fill-green-500 text-green-500" />
              <span className="text-sm">Network</span>
              <span className="text-xs text-muted-foreground ml-auto">Connected</span>
            </div>
            <div className="flex items-center px-3 py-1">
              <Circle className="h-2 w-2 mr-2 fill-green-500 text-green-500" />
              <span className="text-sm">VPN</span>
              <span className="text-xs text-muted-foreground ml-auto">Active</span>
            </div>
            <div className="flex items-center px-3 py-1">
              <Circle className="h-2 w-2 mr-2 fill-yellow-500 text-yellow-500" />
              <span className="text-sm">CPU</span>
              <span className="text-xs text-muted-foreground ml-auto">45%</span>
            </div>
            <div className="flex items-center px-3 py-1">
              <Circle className="h-2 w-2 mr-2 fill-green-500 text-green-500" />
              <span className="text-sm">Memory</span>
              <span className="text-xs text-muted-foreground ml-auto">2.5GB/8GB</span>
            </div>
            <div className="flex items-center px-3 py-1">
              <Circle className="h-2 w-2 mr-2 fill-green-500 text-green-500" />
              <span className="text-sm">Storage</span>
              <span className="text-xs text-muted-foreground ml-auto">45%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

