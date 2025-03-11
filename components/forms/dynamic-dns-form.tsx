"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export function DynamicDNSForm() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "Dynamic DNS settings have been updated.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Dynamic DNS</CardTitle>
          <CardDescription>Configure Dynamic DNS service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="ddns-enabled">Enable Dynamic DNS</Label>
            <Switch id="ddns-enabled" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ddns-provider">Service Provider</Label>
            <Select defaultValue="dyndns">
              <SelectTrigger id="ddns-provider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dyndns">DynDNS</SelectItem>
                <SelectItem value="noip">No-IP</SelectItem>
                <SelectItem value="freedns">FreeDNS</SelectItem>
                <SelectItem value="cloudflare">Cloudflare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ddns-domain">Domain Name</Label>
            <Input id="ddns-domain" placeholder="yourdomain.dyndns.org" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ddns-username">Username</Label>
              <Input id="ddns-username" placeholder="username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ddns-password">Password</Label>
              <Input id="ddns-password" type="password" placeholder="••••••••" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ddns-update">Update Interval (minutes)</Label>
            <Input id="ddns-update" type="number" placeholder="60" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

