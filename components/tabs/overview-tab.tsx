import { BarChartIcon as Bar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function OverviewTab() {
  return (
    <>
      {/* Status summary */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Overall status of your IoT Gateway</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <div className="font-medium">Network</div>
                <div className="text-sm text-muted-foreground">Connected</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <div className="font-medium">VPN</div>
                <div className="text-sm text-muted-foreground">Connected</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div>
                <div className="font-medium">Modbus</div>
                <div className="text-sm text-muted-foreground">Partial</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <div className="font-medium">OPC-UA</div>
                <div className="text-sm text-muted-foreground">Connected</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div>
                <div className="font-medium">DNP3.0</div>
                <div className="text-sm text-muted-foreground">Disconnected</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <div className="font-medium">Watchdog</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface summary */}
      <Card>
        <CardHeader>
          <CardTitle>Network Interfaces</CardTitle>
          <CardDescription>Status of network interfaces and connectivity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2 md:grid-cols-4">
              <div className="font-medium">Interface</div>
              <div className="font-medium">IP Address</div>
              <div className="font-medium">Status</div>
              <div className="font-medium">Traffic</div>
            </div>
            <div className="grid gap-2 md:grid-cols-4 border-t pt-2">
              <div>eth0 (WAN)</div>
              <div>192.168.1.100</div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                Connected
              </div>
              <div>
                <div className="flex items-center text-sm">
                  <Bar className="h-3 w-3 mr-1 text-green-500" />
                  <span>TX: 1.2 MB/s</span>
                </div>
                <div className="flex items-center text-sm">
                  <Bar className="h-3 w-3 mr-1 rotate-180 text-blue-500" />
                  <span>RX: 256 KB/s</span>
                </div>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-4 border-t pt-2">
              <div>eth1 (LAN)</div>
              <div>10.0.0.1</div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                Connected
              </div>
              <div>
                <div className="flex items-center text-sm">
                  <Bar className="h-3 w-3 mr-1 text-green-500" />
                  <span>TX: 350 KB/s</span>
                </div>
                <div className="flex items-center text-sm">
                  <Bar className="h-3 w-3 mr-1 rotate-180 text-blue-500" />
                  <span>RX: 2.1 MB/s</span>
                </div>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-4 border-t pt-2">
              <div>wlan0</div>
              <div>10.0.0.2</div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                Limited
              </div>
              <div>
                <div className="flex items-center text-sm">
                  <Bar className="h-3 w-3 mr-1 text-green-500" />
                  <span>TX: 50 KB/s</span>
                </div>
                <div className="flex items-center text-sm">
                  <Bar className="h-3 w-3 mr-1 rotate-180 text-blue-500" />
                  <span>RX: 120 KB/s</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="ml-auto">
            View All Interfaces
          </Button>
        </CardFooter>
      </Card>

      {/* Industrial protocols */}
      <Card>
        <CardHeader>
          <CardTitle>Protocol Status</CardTitle>
          <CardDescription>Status of configured industrial protocols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2 md:grid-cols-4">
              <div className="font-medium">Protocol</div>
              <div className="font-medium">Mode</div>
              <div className="font-medium">Status</div>
              <div className="font-medium">Connections</div>
            </div>
            <div className="grid gap-2 md:grid-cols-4 border-t pt-2">
              <div>Modbus TCP</div>
              <div>Server</div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                Running
              </div>
              <div>3 active</div>
            </div>
            <div className="grid gap-2 md:grid-cols-4 border-t pt-2">
              <div>Modbus RTU</div>
              <div>Client</div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                Partial
              </div>
              <div>1 active, 2 failed</div>
            </div>
            <div className="grid gap-2 md:grid-cols-4 border-t pt-2">
              <div>OPC-UA</div>
              <div>Server</div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                Running
              </div>
              <div>1 active</div>
            </div>
            <div className="grid gap-2 md:grid-cols-4 border-t pt-2">
              <div>DNP3.0</div>
              <div>Server</div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                Stopped
              </div>
              <div>0 active</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="ml-auto">
            Manage Protocols
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}

