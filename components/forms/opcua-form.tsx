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

export function OPCUAForm() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "OPC-UA settings have been updated.",
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
              <CardTitle>OPC-UA Server</CardTitle>
              <CardDescription>Configure OPC-UA server settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="opcua-server-enabled">Enable OPC-UA Server</Label>
                <Switch id="opcua-server-enabled" defaultChecked />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opcua-endpoint">Endpoint URL</Label>
                  <Input id="opcua-endpoint" placeholder="opc.tcp://0.0.0.0:4840" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opcua-security">Security Policy</Label>
                  <Select defaultValue="none">
                    <SelectTrigger id="opcua-security">
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="basic128rsa15">Basic128Rsa15</SelectItem>
                      <SelectItem value="basic256">Basic256</SelectItem>
                      <SelectItem value="basic256sha256">Basic256Sha256</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="opcua-auth">Authentication</Label>
                <Select defaultValue="anonymous">
                  <SelectTrigger id="opcua-auth">
                    <SelectValue placeholder="Select authentication" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anonymous">Anonymous</SelectItem>
                    <SelectItem value="username">Username/Password</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
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
              <CardTitle>OPC-UA Client</CardTitle>
              <CardDescription>Configure OPC-UA client settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="opcua-client-enabled">Enable OPC-UA Client</Label>
                <Switch id="opcua-client-enabled" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opcua-server-url">Server URL</Label>
                <Input id="opcua-server-url" placeholder="opc.tcp://server:4840" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opcua-username">Username</Label>
                  <Input id="opcua-username" placeholder="username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opcua-password">Password</Label>
                  <Input id="opcua-password" type="password" placeholder="••••••••" />
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

