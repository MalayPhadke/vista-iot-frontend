"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Gauge, Laptop, Tag, Tags, Cpu, Terminal, Plus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"

// Type for port data
interface Port {
  id: string
  name: string
  type: string
  enabled: boolean
  devices: Device[]
  [key: string]: any // Allow additional properties
}

// Type for device data
interface Device {
  id: string
  name: string
  type: string
  enabled: boolean
  [key: string]: any // Allow additional properties
}

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  active?: boolean
  badge?: string
  submenu?: NavItem[]
  dynamicSubmenu?: string
  isIoTagSection?: boolean
}

interface SidebarNavProps {
  items: NavItem[]
  sidebarOpen: boolean
  ioPorts?: Port[]
}

export function SidebarNav({ items, sidebarOpen, ioPorts = [] }: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")
  const section = searchParams.get("section")
  const portId = searchParams.get("portId")
  const deviceId = searchParams.get("deviceId")
  
  // Track which menus, ports, and devices are open
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const [expandedPorts, setExpandedPorts] = useState<string[]>([])
  const [expandedDevices, setExpandedDevices] = useState<string[]>([])

  // Initialize IO Tag menu as open if a port or device is selected
  useEffect(() => {
    if (section === "io-tag") {
      // Open the Data Center menu
      setOpenMenus(prev => ({
        ...prev,
        "Data Center": true
      }))
      
      // If a port is selected, expand it
      if (portId) {
        const port = ioPorts.find(p => p.id === portId)
        if (port) {
          setExpandedPorts(prev => 
            prev.includes(port.id) ? prev : [...prev, port.id]
          )
          
          // If a device is selected, expand it
          if (deviceId) {
            const device = port.devices?.find(d => d.id === deviceId)
            if (device) {
              setExpandedDevices(prev => 
                prev.includes(device.id) ? prev : [...prev, device.id]
              )
            } else {
              // Clear expanded devices if device not found
              setExpandedDevices([])
            }
          } else {
            // Clear expanded devices if no device is selected
            setExpandedDevices([])
          }
        } else {
          // Clear expanded ports and devices if port not found
          setExpandedPorts([])
          setExpandedDevices([])
        }
      } else {
        // Clear expanded ports and devices if no port is selected
        setExpandedPorts([])
        setExpandedDevices([])
      }
    } else {
      // Clear expanded ports and devices when navigating away from IO tag section
      setExpandedPorts([])
      setExpandedDevices([])
    }
  }, [section, portId, deviceId, ioPorts])

  // Toggle submenu visibility
  const toggleSubmenu = (title: string, isIoTag = false) => {
    // If it's the IO Tag section, we want to automatically scroll to top
    if (isIoTag) {
      // Find the sidebar element and scroll to top
      const sidebarElement = document.querySelector('.sidebar-scroll')
      if (sidebarElement) {
        sidebarElement.scrollTop = 0
      }
    }
    
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  // Toggle port expansion
  const togglePortExpansion = (portId: string, e?: React.MouseEvent) => {
    // If event is provided, prevent default and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Always just toggle the expansion state without navigation
    setExpandedPorts(prev => {
      if (prev.includes(portId)) {
        return prev.filter(id => id !== portId);
      } else {
        return [...prev, portId];
      }
    });
  }
  
  // Toggle device expansion
  const toggleDeviceExpansion = (deviceId: string, e?: React.MouseEvent) => {
    // If event is provided, prevent default and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Always just toggle the expansion state without navigation
    setExpandedDevices(prev => {
      if (prev.includes(deviceId)) {
        return prev.filter(id => id !== deviceId);
      } else {
        return [...prev, deviceId];
      }
    });
  }
  
  // Check if a device is expanded
  const isDeviceExpanded = (device: Device) => {
    return expandedDevices.includes(device.id) || deviceId === device.id
  }

  // Handle clicking on a navigation item
  const handleItemClick = (href: string, hasSubmenu: boolean, title: string, isIoTagSection = false) => {
    if (hasSubmenu) {
      toggleSubmenu(title, isIoTagSection)
    } else if (isIoTagSection) {
      // If it's IO Tag section, we want to show ports and scroll to top
      toggleSubmenu("Data Center", true)
      router.push(href)
    } else {
      router.push(href)
    }
  }

  // Check if a port is expanded
  const isPortExpanded = (port: Port) => {
    return expandedPorts.includes(port.id) || portId === port.id
  }

  // Render IO tags for a device
  const renderIoTags = (device: Device) => {
    const tags = device.tags || [];
    if (tags.length === 0) {
      return (
        <div className="px-3 py-2 pl-16 text-xs text-muted-foreground">
          No IO tags configured
        </div>
      );
    }
    
    return tags.map((tag: any) => (
      <li key={tag.id}>
        <div className="flex items-center justify-between rounded-md px-3 py-2 pl-16 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <Tag className="h-3 w-3" />
            {tag.name}
          </span>
          <span className="text-xs opacity-70">{tag.dataType}</span>
        </div>
      </li>
    ));
  };

  // Render devices for a port
  const renderDevices = (port: Port) => {
    return (port.devices || []).map((device: Device) => {
      const hasIoTags = device.tags && device.tags.length > 0;
      const isDeviceOpen = isDeviceExpanded(device);
      
      return (
        <li key={device.id}>
          <div className="flex flex-col">
            <Link 
              href={`?tab=datacenter&section=io-tag&portId=${port.id}&deviceId=${device.id}`}
              className={`flex items-center justify-between rounded-md px-3 py-2 pl-12 text-sm ${
                portId === port.id && deviceId === device.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                {device.name}
              </span>
              
              <div className="flex items-center gap-2">
                {device.enabled ? 
                  <div className="h-2 w-2 rounded-full bg-green-500"></div> : 
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                }
                
                {hasIoTags && (
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${isDeviceOpen ? "rotate-180" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDeviceExpansion(device.id, e);
                    }}
                  />
                )}
              </div>
            </Link>
            
            {/* Render IO tags if device is expanded */}
            {isDeviceOpen && hasIoTags && (
              <ul className="mt-1 space-y-1">
                {renderIoTags(device)}
              </ul>
            )}
          </div>
        </li>
      );
    });
  }

  // Render the IO ports for the IO Tag section
  const renderIoPorts = () => {
    if (!ioPorts || ioPorts.length === 0) {
      return (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          No communication ports configured
        </div>
      )
    }
    
    return (
      <ul className="space-y-1">
        {ioPorts.map(port => {
          const hasDevices = port.devices && port.devices.length > 0
          const isPortOpen = isPortExpanded(port)
          
          return (
            <li key={port.id}>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Link
                    href={`?tab=datacenter&section=io-tag&portId=${port.id}`}
                    className={`flex-1 flex items-center justify-between rounded-md px-3 py-2 pl-8 text-sm hover:bg-accent hover:text-accent-foreground ${
                      portId === port.id && !deviceId ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      <span>{port.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {port.enabled ? 
                        <div className="h-2 w-2 rounded-full bg-green-500"></div> : 
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      }
                    </div>
                  </Link>
                  
                  {/* Separate dropdown button */}
                  {hasDevices && (
                    <button
                      className={`p-2 rounded-md hover:bg-accent hover:text-accent-foreground ${
                        portId === port.id ? "text-accent-foreground" : "text-muted-foreground"
                      }`}
                      onClick={(e) => togglePortExpansion(port.id, e)}
                      aria-label={isPortOpen ? "Collapse devices" : "Expand devices"}
                    >
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${isPortOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
              
                {/* Render devices if port is expanded */}
                {isPortOpen && hasDevices && (
                  <ul className="mt-1 space-y-1">
                    {renderDevices(port)}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
        
        {/* Add Port button */}
        <li>
          <Link
            href={`?tab=datacenter&section=io-tag&action=add-port`}
            className="flex items-center gap-2 rounded-md px-3 py-2 pl-8 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="h-4 w-4" />
            <span>Add Port</span>
          </Link>
        </li>
      </ul>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto sidebar-scroll">
        <nav className="space-y-1">
          <ul className="space-y-1">
            {items.map((item, index) => {
              const hasSubmenu = item.submenu && item.submenu.length > 0
              const isOpen = openMenus[item.title] || false
              const isActive = tab === item.href.split('tab=')[1]?.split('&')[0]

              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleItemClick(item.href, hasSubmenu, item.title)
                    }}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {sidebarOpen && <span>{item.title}</span>}
                    </div>
                    {hasSubmenu && sidebarOpen && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>

                  {/* Render submenu if it exists and is open */}
                  {hasSubmenu && isOpen && sidebarOpen && (
                    <ul className="mt-1 space-y-1">
                      {item.submenu?.map((subItem, subIndex) => {
                        const isSubActive = section === subItem.href.split('section=')[1]?.split('&')[0]
                        
                        return (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              onClick={(e) => {
                                e.preventDefault()
                                handleItemClick(subItem.href, false, subItem.title, subItem.isIoTagSection)
                              }}
                              className={`flex items-center justify-between rounded-md px-3 py-2 pl-8 text-sm hover:bg-accent hover:text-accent-foreground ${
                                isSubActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                <span>{subItem.title}</span>
                              </div>
                            </Link>
                            
                            {/* If this is IO Tag section and it's active, render ports */}
                            {subItem.isIoTagSection && isSubActive && (
                              <div className="mt-2 ml-4">
                                {renderIoPorts()}
                              </div>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
