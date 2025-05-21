"use client"

import { useState, useEffect, Suspense } from "react"
import {
  ChevronDown,
  Database,
  Gauge,
  HardDrive,
  type LucideIcon,
  MessageSquare,
  Network,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Wifi,
  ArrowLeft,
  Code,
  FileDigit,
  Tag,
  UserCircle,
  BarChart,
  Cog,
  Clock,
  HardDrive as HardDiskIcon,
  Activity as MemoryIcon,
  Cpu,
  AreaChart,
  Terminal
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

import NetworkTab from "@/components/tabs/network-tab"
import SecurityTab from "@/components/tabs/security-tab"
import ProtocolsTab from "@/components/tabs/protocols-tab"
import LogsTab from "@/components/tabs/logs-tab"
import OverviewTab from "@/components/tabs/overview-tab"
import { MQTTForm } from "@/components/forms/mqtt-form"
import { RestartGatewayDialog } from "@/components/dialogs/restart-dialog"
import { ExportConfigDialog } from "@/components/dialogs/export-config-dialog"
import { ImportConfigDialog } from "@/components/dialogs/import-config-dialog"
import { ResetConfigDialog } from "@/components/dialogs/reset-config-dialog"
import { SidebarNav } from "@/components/sidebar-nav"
import { DeviceConfigurationPanel } from "@/components/device-configuration-panel"
import HardwareTab from "@/components/tabs/hardware-tab"
import ConfigurationTab from "@/components/tabs/configuration-tab"
import IOTagManagement from "@/components/tabs/io-tag-tab"
import CalculationTagTab from "@/components/tabs/calculation-tag-tab"

// Types for the navigation items
type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  active?: boolean
  badge?: string
  submenu?: NavItem[]
  dynamicSubmenu?: string
  isIoTagSection?: boolean
}

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const deviceId = searchParams.get("device")
  const section = searchParams.get("section")
  const portId = searchParams.get("portId")
  const deviceItemId = searchParams.get("deviceId")
  const [showReconfigureOption, setShowReconfigureOption] = useState(false)
  const [isConfiguring, setIsConfiguring] = useState(false)
  
  // Mock IO ports data for the sidebar tree view
  const [ioPorts, setIoPorts] = useState([])

  // Dialog states
  const [restartDialogOpen, setRestartDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  // Add state for active section
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Modified navigation items with proper routes
  const navItems: NavItem[] = [
    {
      title: "Onboarding",
      href: "/onboarding",
      icon: Server,
    },
    {
      title: "Dashboard",
      href: "/",
      icon: Gauge,
      active: router.pathname === "/",
    },
    {
      title: "Overview",
      href: "?tab=overview",
      icon: Gauge,
      active: activeTab === "overview",
      children: [
        {
          title: "System Uptime",
          href: "?tab=overview&section=system-uptime",
          icon: Clock
        },
        {
          title: "CPU Load",
          href: "?tab=overview&section=cpu-load",
          icon: Cpu
        },
        {
          title: "Memory Usage",
          href: "?tab=overview&section=memory-usage",
          icon: MemoryIcon
        },
        {
          title: "Storage",
          href: "?tab=overview&section=storage",
          icon: HardDiskIcon
        },
        {
          title: "Services Status",
          href: "?tab=overview&section=services-status",
          icon: Server
        }
      ]
    },
    {
      title: "Networking",
      href: "?tab=network",
      icon: Network,
      active: activeTab === "network",
      submenu: [
        {
          title: "Interfaces",
          href: "?tab=network&section=interfaces",
          icon: Wifi,
          submenu: [
            {
              title: "Ethernet",
              href: "?tab=network&section=interfaces&subsection=ethernet",
              icon: Wifi,
            },
            {
              title: "WiFi",
              href: "?tab=network&section=interfaces&subsection=wifi",
              icon: Wifi,
            },
          ],
        },
        { title: "DHCP", href: "?tab=network&section=dhcp", icon: Database },
        { title: "Routing", href: "?tab=network&section=routing", icon: RefreshCw },
        { title: "Port Forwarding", href: "?tab=network&section=port-forwarding", icon: Network },
        { title: "Dynamic DNS", href: "?tab=network&section=ddns", icon: Database },
        { title: "WiFi", href: "?tab=network&section=wifi", icon: Wifi },
      ],
    },
    {
      title: "Data Center",
      href: "?tab=datacenter",
      icon: Server,
      active: activeTab === "datacenter",
      submenu: [
        { 
          title: "IO Tag", 
          href: "?tab=datacenter&section=io-tag", 
          icon: Tag, 
          isIoTagSection: true
        },
        { title: "User Tag", href: "?tab=datacenter&section=user-tag", icon: Tag },
        { title: "Calculation Tag", href: "?tab=datacenter&section=calc-tag", icon: FileDigit },
        { title: "Stats Tag", href: "?tab=datacenter&section=stats-tag", icon: BarChart },
        { title: "System Tag", href: "?tab=datacenter&section=system-tag", icon: Tag },
      ],
    },
    {
      title: "Security",
      href: "?tab=security",
      icon: Shield,
      active: activeTab === "security",
      submenu: [
        { title: "IPSec VPN", href: "?tab=security&section=vpn", icon: Shield },
        { title: "Firewall", href: "?tab=security&section=firewall", icon: Shield },
        { title: "IP Binding", href: "?tab=security&section=ip-binding", icon: Database },
      ],
    },
    {
      title: "Industrial Protocols",
      href: "?tab=protocols",
      icon: Database,
      active: activeTab === "protocols",
      submenu: [
        { title: "DNP3.0", href: "?tab=protocols&section=dnp3", icon: Database },
        { title: "OPC-UA", href: "?tab=protocols&section=opcua", icon: Database },
        { title: "Modbus", href: "?tab=protocols&section=modbus", icon: Database },
        { title: "IEC", href: "?tab=protocols&section=iec", icon: Database },
      ],
    },
    {
      title: "MQTT",
      href: "?tab=mqtt",
      icon: MessageSquare,
      active: activeTab === "mqtt",
    },
    {
      title: "Hardware",
      href: "?tab=hardware",
      icon: HardDrive,
      active: activeTab === "hardware",
      submenu: [
        { 
          title: "COM Ports",
          href: "?tab=hardware&section=com-ports",
          icon: Database 
        },
        { 
          title: "Watchdog",
          href: "?tab=hardware&section=watchdog",
          icon: RefreshCw 
        },
      ],
    },
    {
      title: "Configuration",
      href: "?tab=configuration",
      icon: Code,
      active: activeTab === "configuration",
    },
    {
      title: "Settings",
      href: "?tab=settings",
      icon: Settings,
      active: activeTab === "settings",
    },
  ]

  // Update the navigation handler
  const handleNavigation = (href: string) => {
    if (href.startsWith("/")) {
      router.push(href)
    } else {
      router.push(href)
      const params = new URLSearchParams(href)
      const tab = params.get("tab")
      const section = params.get("section")
      
      if (tab) {
        setActiveTab(tab)
        // If there's a section, update the NetworkTab or other relevant component
        if (section) {
          setActiveSection(section)
        }
      }
    }
  }

  // Update the useEffect to handle sections
  useEffect(() => {
    const tab = searchParams.get("tab")
    const section = searchParams.get("section")
    
    if (tab) {
      setActiveTab(tab)
      if (section) {
        setActiveSection(section)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (deviceId) {
      // For demo purposes, we'll assume devices with odd IDs are configured
      // In a real app, you would check your device database
      const isConfigured = deviceId.includes("001") || deviceId.includes("003")
      setShowReconfigureOption(isConfigured)

      // If the device is not configured, show the configuration panel
      setIsConfiguring(!isConfigured)

      toast({
        title: "Device Connected",
        description: `Managing device with ID: ${deviceId}${isConfigured ? " (Configured)" : " (Needs Configuration)"}`,
      })
    }
  }, [deviceId, toast])

  const handleRefresh = () => {
    toast({
      title: "Refreshing data",
      description: "Dashboard data has been refreshed",
    })
  }

  // Check for hash in URL on initial load
  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash && ["overview", "network", "security", "protocols", "logs", "mqtt"].includes(hash)) {
      setActiveTab(hash)
    }
  }, [])

  const handleReconfigure = () => {
    toast({
      title: "Reconfiguring Device",
      description: `Starting reconfiguration process for device ${deviceId}`,
    })
    setIsConfiguring(true)
  }

  const handleConfigurationComplete = () => {
    setIsConfiguring(false)
    setShowReconfigureOption(true)
    toast({
      title: "Configuration Saved",
      description: `Device ${deviceId} configuration has been saved.`,
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? "w-64" : "w-16"
      } flex flex-col h-full border-r bg-background transition-all duration-300`}>
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            {sidebarOpen && <span className="text-xl font-bold">IoT Gateway</span>}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto">
            <ChevronDown className={`h-4 w-4 transition-transform ${sidebarOpen ? "rotate-0" : "rotate-180"}`} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <SidebarNav items={navItems} sidebarOpen={sidebarOpen} ioPorts={ioPorts} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-6">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/onboarding")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Dashboard {deviceId ? `- Device ${deviceId}` : ""}</h1>
          <div className="ml-auto flex items-center gap-4">
            {showReconfigureOption && deviceId && (
              <Button variant="outline" onClick={handleReconfigure}>
                Reconfigure Device
              </Button>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh data</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Actions
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setRestartDialogOpen(true)}>Restart Gateway</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>Export Configuration</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>Import Configuration</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setResetDialogOpen(true)}>Reset to Defaults</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {isConfiguring && deviceId ? (
            <DeviceConfigurationPanel deviceId={deviceId} onComplete={handleConfigurationComplete} />
          ) : (
            <>
              {/* System status cards - only shown for Overview section */}
              {activeTab === "overview" && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">10d 14h 32m</div>
                      <p className="text-xs text-muted-foreground">Last restart: 2023-06-15 08:23:45</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">CPU Load</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24%</div>
                      <Progress value={24} className="h-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">512MB / 2GB</div>
                      <Progress value={25} className="h-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Storage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2.1GB / 8GB</div>
                      <Progress value={26} className="h-2" />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tabs for main sections */}
              <div className="mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-9">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="network">Network</TabsTrigger>
                    <TabsTrigger value="datacenter" onClick={() => handleNavigation("?tab=datacenter")}>Data Center</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="protocols">Protocols</TabsTrigger>
                    <TabsTrigger value="mqtt">MQTT</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                    <TabsTrigger value="hardware">Hardware</TabsTrigger>
                    <TabsTrigger value="configuration">Configuration</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6 space-y-6">
                    <OverviewTab />
                  </TabsContent>

                  <TabsContent value="network" className="mt-6 space-y-6">
                    <NetworkTab />
                  </TabsContent>

                  <TabsContent value="datacenter" className="mt-6 space-y-6">
                    {section === 'io-tag' ? (
                      <IOTagManagement 
                        ioPorts={ioPorts} 
                        setIoPorts={setIoPorts}
                        selectedPortId={portId}
                        selectedDeviceId={deviceItemId}
                      />
                    ) : section === 'calc-tag' ? (
                      <CalculationTagTab ioPorts={ioPorts} />
                    ) : (
                      <div className="rounded-lg border p-8">
                        <h2 className="text-lg font-semibold mb-4">Data Center Management</h2>
                        <p className="text-muted-foreground mb-4">
                          Configure and manage your data tags for the IoT gateway.
                        </p>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                          <Card 
                            className="p-4 cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleNavigation("?tab=datacenter&section=io-tag")}
                          >
                            <h3 className="font-medium flex items-center"><Tag className="mr-2 h-4 w-4" /> IO Tags</h3>
                            <p className="text-sm text-muted-foreground mt-1">Manage input/output data tags</p>
                          </Card>
                          <Card 
                            className="p-4 cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleNavigation("?tab=datacenter&section=user-tag")}
                          >
                            <h3 className="font-medium flex items-center"><UserCircle className="mr-2 h-4 w-4" /> User Tags</h3>
                            <p className="text-sm text-muted-foreground mt-1">Configure custom user-defined tags</p>
                          </Card>
                          <Card 
                            className="p-4 cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleNavigation("?tab=datacenter&section=calc-tag")}
                          >
                            <h3 className="font-medium flex items-center"><FileDigit className="mr-2 h-4 w-4" /> Calculation Tags</h3>
                            <p className="text-sm text-muted-foreground mt-1">Set up calculated data points</p>
                          </Card>
                          <Card 
                            className="p-4 cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleNavigation("?tab=datacenter&section=stats-tag")}
                          >
                            <h3 className="font-medium flex items-center"><BarChart className="mr-2 h-4 w-4" /> Stats Tags</h3>
                            <p className="text-sm text-muted-foreground mt-1">Configure statistical data points</p>
                          </Card>
                          <Card 
                            className="p-4 cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleNavigation("?tab=datacenter&section=system-tag")}
                          >
                            <h3 className="font-medium flex items-center"><Cog className="mr-2 h-4 w-4" /> System Tags</h3>
                            <p className="text-sm text-muted-foreground mt-1">Manage system-level tags</p>
                          </Card>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="security" className="mt-6 space-y-6">
                    <SecurityTab />
                  </TabsContent>

                  <TabsContent value="protocols" className="mt-6 space-y-6">
                    <ProtocolsTab />
                  </TabsContent>

                  <TabsContent value="mqtt" className="mt-6 space-y-6">
                    <MQTTForm />
                  </TabsContent>

                  <TabsContent value="logs" className="mt-6">
                    <LogsTab />
                  </TabsContent>

                  <TabsContent value="hardware" className="mt-6">
                    <HardwareTab />
                  </TabsContent>

                  <TabsContent value="configuration" className="mt-6">
                    <ConfigurationTab />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <RestartGatewayDialog open={restartDialogOpen} onOpenChange={setRestartDialogOpen} />
      <ExportConfigDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
      <ImportConfigDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
      <ResetConfigDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen} />
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

