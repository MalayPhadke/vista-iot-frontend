"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export function IECProtocolsForm() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "IEC protocol settings have been updated.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="iec101">
        <TabsList className="mb-4">
          <TabsTrigger value="iec101">IEC 60870-5-101</TabsTrigger>
          <TabsTrigger value="iec104">IEC 60870-5-104</TabsTrigger>
          <TabsTrigger value="iec61850">IEC 61850</TabsTrigger>
        </TabsList>

        <TabsContent value="iec101">
          <Card>
            <CardHeader>
              <CardTitle>IEC 60870-5-101</CardTitle>
              <CardDescription>Configure IEC 60870-5-101 settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="iec101-enabled">Enable IEC 60870-5-101</Label>
                <Switch id="iec101-enabled" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iec101-mode">Mode</Label>
                <Select defaultValue="master">
                  <SelectTrigger id="iec101-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="slave">Slave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="iec101-port">Serial Port</Label>
                  <Select defaultValue="ttyS0">
                    <SelectTrigger id="iec101-port">
                      <SelectValue placeholder="Select port" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ttyS0">ttyS0</SelectItem>
                      <SelectItem value="ttyS1">ttyS1</SelectItem>
                      <SelectItem value="ttyUSB0">ttyUSB0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iec101-baud">Baud Rate</Label>
                  <Select defaultValue="9600">
                    <SelectTrigger id="iec101-baud">
                      <SelectValue placeholder="Select baud rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9600">9600</SelectItem>
                      <SelectItem value="19200">19200</SelectItem>
                      <SelectItem value="38400">38400</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="iec104">
          <Card>
            <CardHeader>
              <CardTitle>IEC 60870-5-104</CardTitle>
              <CardDescription>Configure IEC 60870-5-104 settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="iec104-enabled">Enable IEC 60870-5-104</Label>
                <Switch id="iec104-enabled" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iec104-mode">Mode</Label>
                <Select defaultValue="server">
                  <SelectTrigger id="iec104-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="iec104-port">TCP Port</Label>
                  <Input id="iec104-port" placeholder="2404" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iec104-t1">T1 Timeout (s)</Label>
                  <Input id="iec104-t1" placeholder="15" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="iec61850">
          <Card>
            <CardHeader>
              <CardTitle>IEC 61850</CardTitle>
              <CardDescription>Configure IEC 61850 settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="iec61850-enabled">Enable IEC 61850</Label>
                <Switch id="iec61850-enabled" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iec61850-mode">Mode</Label>
                <Select defaultValue="server">
                  <SelectTrigger id="iec61850-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="iec61850-port">MMS Port</Label>
                <Input id="iec61850-port" placeholder="102" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

