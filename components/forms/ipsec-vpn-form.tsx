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

export function IPSecVPNForm() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "IPSec VPN settings have been updated.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="site-to-site">
        <TabsList className="mb-4">
          <TabsTrigger value="site-to-site">Site-to-Site</TabsTrigger>
          <TabsTrigger value="client">Client VPN</TabsTrigger>
        </TabsList>

        <TabsContent value="site-to-site">
          <Card>
            <CardHeader>
              <CardTitle>Site-to-Site VPN</CardTitle>
              <CardDescription>Configure IPSec site-to-site VPN tunnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="vpn-enabled">Enable VPN</Label>
                <Switch id="vpn-enabled" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remote-gateway">Remote Gateway</Label>
                <Input id="remote-gateway" placeholder="203.0.113.1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="local-subnet">Local Subnet</Label>
                  <Input id="local-subnet" placeholder="10.0.0.0/24" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remote-subnet">Remote Subnet</Label>
                  <Input id="remote-subnet" placeholder="192.168.1.0/24" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pre-shared-key">Pre-shared Key</Label>
                <Input id="pre-shared-key" type="password" placeholder="••••••••" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phase1-encryption">Phase 1 Encryption</Label>
                  <Select defaultValue="aes256">
                    <SelectTrigger id="phase1-encryption">
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes128">AES-128</SelectItem>
                      <SelectItem value="aes256">AES-256</SelectItem>
                      <SelectItem value="3des">3DES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phase2-encryption">Phase 2 Encryption</Label>
                  <Select defaultValue="aes256">
                    <SelectTrigger id="phase2-encryption">
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes128">AES-128</SelectItem>
                      <SelectItem value="aes256">AES-256</SelectItem>
                      <SelectItem value="3des">3DES</SelectItem>
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

        <TabsContent value="client">
          <Card>
            <CardHeader>
              <CardTitle>Client VPN</CardTitle>
              <CardDescription>Configure IPSec client VPN access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="client-vpn-enabled">Enable Client VPN</Label>
                <Switch id="client-vpn-enabled" />
              </div>

              <p className="text-muted-foreground">Client VPN settings will be available when enabled.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

