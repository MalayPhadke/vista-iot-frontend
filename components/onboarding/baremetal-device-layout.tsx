"use client"

import { useState } from "react"
import { AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

export function BaremetalDeviceLayout() {
  const [ledStatus, setLedStatus] = useState({
    power: true,
    status: true,
    eth0: true,
    eth1: false,
    wifi: true,
    error: false,
  })
  const { toast } = useToast()

  const handleLedClick = (led: string) => {
    toast({
      title: `${led} LED`,
      description: getLedDescription(led),
    })
  }

  const getLedDescription = (led: string) => {
    switch (led) {
      case "power":
        return "Power LED indicates the device is receiving power."
      case "status":
        return "Status LED indicates the device is operating normally."
      case "eth0":
        return "ETH0 LED indicates activity on the WAN Ethernet port."
      case "eth1":
        return "ETH1 LED indicates activity on the LAN Ethernet port."
      case "wifi":
        return "WiFi LED indicates the wireless network is active."
      case "error":
        return "Error LED indicates a system fault or warning condition."
      default:
        return ""
    }
  }

  const handlePortClick = (port: string) => {
    toast({
      title: `${port} Port`,
      description: getPortDescription(port),
    })
  }

  const getPortDescription = (port: string) => {
    switch (port) {
      case "eth0":
        return "WAN Ethernet port for connecting to your internet service."
      case "eth1":
        return "LAN Ethernet port for connecting local devices."
      case "usb":
        return "USB port for connecting storage devices or peripherals."
      case "console":
        return "Console port for direct terminal access to the device."
      case "power":
        return "Power input port for connecting the power adapter."
      case "reset":
        return "Reset button to restart the device or reset to factory defaults."
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>IoT Gateway Hardware</CardTitle>
        <CardDescription>Interactive view of the physical device</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-3xl mx-auto bg-slate-800 rounded-lg p-6 aspect-[2/1]">
          {/* Device label */}
          <div className="absolute top-4 left-4 text-white">
            <div className="text-lg font-bold">IoT Gateway 5000</div>
            <div className="text-xs text-slate-400">Model: GW-5000</div>
          </div>

          {/* Status LEDs */}
          <div className="absolute top-4 right-4 flex space-x-3">
            <TooltipProvider>
              {Object.entries(ledStatus).map(([key, value]) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <button
                      className={`w-4 h-4 rounded-full ${
                        value
                          ? key === "error"
                            ? "bg-red-500 animate-pulse"
                            : key === "status"
                              ? "bg-green-500"
                              : key === "power"
                                ? "bg-blue-500"
                                : key === "wifi"
                                  ? "bg-purple-500"
                                  : "bg-yellow-500"
                          : "bg-slate-600"
                      }`}
                      onClick={() => handleLedClick(key)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{key} LED</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          {/* Ethernet ports */}
          <div className="absolute bottom-6 left-10 flex space-x-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="w-10 h-10 bg-slate-600 rounded-sm border-2 border-slate-500 flex items-center justify-center"
                    onClick={() => handlePortClick("eth0")}
                  >
                    <div className="text-xs text-white">ETH0</div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>WAN Ethernet Port</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="w-10 h-10 bg-slate-600 rounded-sm border-2 border-slate-500 flex items-center justify-center"
                    onClick={() => handlePortClick("eth1")}
                  >
                    <div className="text-xs text-white">ETH1</div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>LAN Ethernet Port</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* USB and Console ports */}
          <div className="absolute bottom-6 right-10 flex space-x-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="w-8 h-10 bg-slate-600 rounded-sm border-2 border-slate-500 flex items-center justify-center"
                    onClick={() => handlePortClick("usb")}
                  >
                    <div className="text-xs text-white">USB</div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>USB Port</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="w-12 h-6 bg-slate-600 rounded-sm border-2 border-slate-500 flex items-center justify-center"
                    onClick={() => handlePortClick("console")}
                  >
                    <div className="text-xs text-white">CONSOLE</div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Console Port</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Power and Reset */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col space-y-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="w-6 h-6 bg-slate-700 rounded-full border-2 border-slate-500 flex items-center justify-center"
                    onClick={() => handlePortClick("power")}
                  >
                    <div className="text-xs text-white">⏻</div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Power Button</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="w-4 h-4 bg-red-600 rounded-full" onClick={() => handlePortClick("reset")}>
                    <span className="sr-only">Reset</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset Button</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Antenna */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-slate-600 rounded-t-full"></div>

          {/* Status indicators */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="text-white text-sm mb-2">System Status</div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-white text-xs">Normal</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <span className="text-white text-xs">Warning</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-white text-xs">Error</span>
              </div>
            </div>
          </div>

          {/* Info button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
            onClick={() =>
              toast({
                title: "Device Information",
                description: "IoT Gateway 5000 is a high-performance industrial gateway for IoT applications.",
              })
            }
          >
            <Info className="h-4 w-4" />
          </Button>

          {/* Warning indicator */}
          {ledStatus.error && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center text-red-500 text-sm animate-pulse">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span>System error detected</span>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Device Controls</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setLedStatus({ ...ledStatus, power: !ledStatus.power })
                  toast({
                    title: ledStatus.power ? "Powering off device" : "Powering on device",
                    description: ledStatus.power ? "The device is shutting down..." : "The device is starting up...",
                  })
                }}
              >
                Power {ledStatus.power ? "Off" : "On"}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  toast({
                    title: "Restarting device",
                    description: "The device is restarting...",
                  })
                  setTimeout(() => {
                    setLedStatus({ ...ledStatus, status: false })
                    setTimeout(() => {
                      setLedStatus({ ...ledStatus, status: true })
                    }, 2000)
                  }, 1000)
                }}
              >
                Restart Device
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setLedStatus({ ...ledStatus, error: !ledStatus.error })
                  toast({
                    title: ledStatus.error ? "Clearing error state" : "Simulating error state",
                    description: ledStatus.error
                      ? "The error state has been cleared."
                      : "The device is now in an error state for demonstration.",
                  })
                }}
              >
                {ledStatus.error ? "Clear Error State" : "Simulate Error"}
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Network Controls</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setLedStatus({ ...ledStatus, eth0: !ledStatus.eth0 })
                  toast({
                    title: ledStatus.eth0 ? "Disabling WAN port" : "Enabling WAN port",
                    description: ledStatus.eth0 ? "The WAN port has been disabled." : "The WAN port has been enabled.",
                  })
                }}
              >
                {ledStatus.eth0 ? "Disable" : "Enable"} WAN Port
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setLedStatus({ ...ledStatus, eth1: !ledStatus.eth1 })
                  toast({
                    title: ledStatus.eth1 ? "Disabling LAN port" : "Enabling LAN port",
                    description: ledStatus.eth1 ? "The LAN port has been disabled." : "The LAN port has been enabled.",
                  })
                }}
              >
                {ledStatus.eth1 ? "Disable" : "Enable"} LAN Port
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setLedStatus({ ...ledStatus, wifi: !ledStatus.wifi })
                  toast({
                    title: ledStatus.wifi ? "Disabling WiFi" : "Enabling WiFi",
                    description: ledStatus.wifi ? "WiFi has been disabled." : "WiFi has been enabled.",
                  })
                }}
              >
                {ledStatus.wifi ? "Disable" : "Enable"} WiFi
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

