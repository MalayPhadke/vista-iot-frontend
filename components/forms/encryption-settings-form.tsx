"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export function EncryptionSettingsForm() {
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "Encryption settings have been updated.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Encryption Settings</CardTitle>
          <CardDescription>Configure data encryption settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tls-enabled">Enable TLS/SSL</Label>
            <Switch id="tls-enabled" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tls-version">TLS Version</Label>
            <Select defaultValue="tls12">
              <SelectTrigger id="tls-version">
                <SelectValue placeholder="Select TLS version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tls11">TLS 1.1</SelectItem>
                <SelectItem value="tls12">TLS 1.2</SelectItem>
                <SelectItem value="tls13">TLS 1.3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cipher-suite">Cipher Suite</Label>
            <Select defaultValue="high">
              <SelectTrigger id="cipher-suite">
                <SelectValue placeholder="Select cipher suite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Security (AES-256)</SelectItem>
                <SelectItem value="medium">Medium Security (AES-128)</SelectItem>
                <SelectItem value="compatibility">Compatibility Mode</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cert-path">Certificate Path</Label>
            <Input id="cert-path" placeholder="/etc/ssl/certs/gateway.crt" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key-path">Private Key Path</Label>
            <Input id="key-path" placeholder="/etc/ssl/private/gateway.key" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

