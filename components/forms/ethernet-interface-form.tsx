"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export function EthernetInterfaceForm() {
  const { toast } = useToast()
  const [addressType, setAddressType] = useState("dhcp")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "Ethernet interface settings have been updated.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ethernet Interface (eth0)</CardTitle>
            <CardDescription>Configure WAN interface settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Connection Type</Label>
              <RadioGroup defaultValue="dhcp" value={addressType} onValueChange={setAddressType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dhcp" id="dhcp" />
                  <Label htmlFor="dhcp">DHCP (Automatic IP)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="static" id="static" />
                  <Label htmlFor="static">Static IP</Label>
                </div>
              </RadioGroup>
            </div>

            {addressType === "static" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ip-address">IP Address</Label>
                    <Input id="ip-address" placeholder="192.168.1.100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subnet-mask">Subnet Mask</Label>
                    <Input id="subnet-mask" placeholder="255.255.255.0" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gateway">Default Gateway</Label>
                    <Input id="gateway" placeholder="192.168.1.1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dns">DNS Server</Label>
                    <Input id="dns" placeholder="8.8.8.8" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="mtu">MTU</Label>
              <Input id="mtu" placeholder="1500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speed">Speed/Duplex</Label>
              <Select defaultValue="auto">
                <SelectTrigger id="speed">
                  <SelectValue placeholder="Select speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-negotiate</SelectItem>
                  <SelectItem value="100full">100Mbps Full Duplex</SelectItem>
                  <SelectItem value="100half">100Mbps Half Duplex</SelectItem>
                  <SelectItem value="10full">10Mbps Full Duplex</SelectItem>
                  <SelectItem value="10half">10Mbps Half Duplex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ethernet Interface (eth1)</CardTitle>
            <CardDescription>Configure LAN interface settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lan-ip">IP Address</Label>
              <Input id="lan-ip" placeholder="10.0.0.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lan-subnet">Subnet Mask</Label>
              <Input id="lan-subnet" placeholder="255.255.255.0" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}

