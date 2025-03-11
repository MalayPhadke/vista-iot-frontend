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

export function DNP3Form() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "DNP3 settings have been updated.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="server">
        <TabsList className="mb-4">
          <TabsTrigger value="server">Server Mode</TabsTrigger>
          <TabsTrigger value="client">Client Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="server">
          <Card>
            <CardHeader>
              <CardTitle>DNP3 Server</CardTitle>
              <CardDescription>Configure DNP3 server settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dnp3-server-enabled">Enable DNP3 Server</Label>
                <Switch id="dnp3-server-enabled" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dnp3-local-address">Local Address</Label>
                  <Input id="dnp3-local-address" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dnp3-port">TCP Port</Label>
                  <Input id="dnp3-port" placeholder="20000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dnp3-unsolicited">Unsolicited Response Mode</Label>
                <Select defaultValue="disabled">
                  <SelectTrigger id="dnp3-unsolicited">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="enabled">Enabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="client">
          <Card>
            <CardHeader>
              <CardTitle>DNP3 Client</CardTitle>
              <CardDescription>Configure DNP3 client settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dnp3-client-enabled">Enable DNP3 Client</Label>
                <Switch id="dnp3-client-enabled" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dnp3-remote-address">Remote Address</Label>
                  <Input id="dnp3-remote-address" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dnp3-remote-ip">Remote IP</Label>
                  <Input id="dnp3-remote-ip" placeholder="192.168.1.100" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dnp3-remote-port">Remote Port</Label>
                  <Input id="dnp3-remote-port" placeholder="20000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dnp3-poll-interval">Poll Interval (ms)</Label>
                  <Input id="dnp3-poll-interval" placeholder="5000" />
                </div>
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

