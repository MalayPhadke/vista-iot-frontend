"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Database, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComPortsForm } from "@/components/forms/com-ports-form"
import { WatchdogForm } from "@/components/forms/watchdog-form"

export default function HardwareTab() {
  const searchParams = useSearchParams()
  const [activeHardwareTab, setActiveHardwareTab] = useState(() => {
    return searchParams.get("section") || "com-ports"
  })

  useEffect(() => {
    const section = searchParams.get("section")
    if (section) {
      setActiveHardwareTab(section)
    }
  }, [searchParams])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hardware Configuration</CardTitle>
        <CardDescription>Configure device hardware settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeHardwareTab} onValueChange={setActiveHardwareTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="com-ports">COM Ports</TabsTrigger>
            <TabsTrigger value="watchdog">Watchdog</TabsTrigger>
          </TabsList>

          <TabsContent value="com-ports">
            <ComPortsForm />
          </TabsContent>

          <TabsContent value="watchdog">
            <WatchdogForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 