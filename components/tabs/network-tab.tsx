"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Database, Network, RefreshCw, Wifi } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EthernetInterfaceForm } from "@/components/forms/ethernet-interface-form"
import { DHCPServerForm } from "@/components/forms/dhcp-server-form"
import { StaticRoutesForm } from "@/components/forms/static-routes-form"
import { PortForwardingForm } from "@/components/forms/port-forwarding-form"
import { DynamicDNSForm } from "@/components/forms/dynamic-dns-form"
import { WifiSettingsForm } from "@/components/forms/wifi-settings-form"

export default function NetworkTab() {
  const searchParams = useSearchParams()
  const [activeNetworkTab, setActiveNetworkTab] = useState(() => {
    return searchParams.get("section") || "interfaces"
  })

  // Update active tab when section changes in URL
  useEffect(() => {
    const section = searchParams.get("section")
    if (section) {
      setActiveNetworkTab(section)
    }
  }, [searchParams])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Configuration</CardTitle>
        <CardDescription>Configure network interfaces and routing</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeNetworkTab} onValueChange={setActiveNetworkTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="interfaces">Interfaces</TabsTrigger>
            <TabsTrigger value="dhcp">DHCP</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="port-forwarding">Port Forwarding</TabsTrigger>
            <TabsTrigger value="ddns">Dynamic DNS</TabsTrigger>
            <TabsTrigger value="wifi">WiFi</TabsTrigger>
          </TabsList>

          <TabsContent value="interfaces">
            <EthernetInterfaceForm />
          </TabsContent>

          <TabsContent value="dhcp">
            <DHCPServerForm />
          </TabsContent>

          <TabsContent value="routing">
            <StaticRoutesForm />
          </TabsContent>

          <TabsContent value="port-forwarding">
            <PortForwardingForm />
          </TabsContent>

          <TabsContent value="ddns">
            <DynamicDNSForm />
          </TabsContent>

          <TabsContent value="wifi">
            <WifiSettingsForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

