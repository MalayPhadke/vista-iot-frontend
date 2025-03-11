"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export function DHCPServerForm() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "DHCP server settings have been updated.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>DHCP Server</CardTitle>
          <CardDescription>Configure DHCP server settings for the LAN</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dhcp-enabled">Enable DHCP Server</Label>
            <Switch id="dhcp-enabled" defaultChecked />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-ip">Start IP Address</Label>
              <Input id="start-ip" placeholder="10.0.0.100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-ip">End IP Address</Label>
              <Input id="end-ip" placeholder="10.0.0.200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lease-time">Lease Time (hours)</Label>
              <Input id="lease-time" placeholder="24" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input id="domain" placeholder="local" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dns">DNS Servers (comma separated)</Label>
            <Input id="dns" placeholder="8.8.8.8, 8.8.4.4" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

