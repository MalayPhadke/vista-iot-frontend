"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface DeviceConfigurationPanelProps {
  deviceId: string
  onComplete: () => void
}

export function DeviceConfigurationPanel({ deviceId, onComplete }: DeviceConfigurationPanelProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const { toast } = useToast()

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Configuration complete
      toast({
        title: "Configuration Complete",
        description: `Device ${deviceId} has been successfully configured.`,
      })
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Device Configuration - Step {currentStep} of 3</CardTitle>
        <CardDescription>
          {currentStep === 1 && "Configure basic device settings"}
          {currentStep === 2 && "Configure network settings"}
          {currentStep === 3 && "Configure security settings"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input id="device-name" defaultValue={`Gateway-${deviceId}`} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-location">Location</Label>
              <Input id="device-location" placeholder="e.g., Server Room" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device-type">Device Type</Label>
              <Select defaultValue="gateway">
                <SelectTrigger id="device-type">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gateway">IoT Gateway</SelectItem>
                  <SelectItem value="router">Router</SelectItem>
                  <SelectItem value="switch">Switch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-update">Enable Auto Updates</Label>
              <Switch id="auto-update" defaultChecked />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ip-mode">IP Configuration</Label>
              <Select defaultValue="dhcp">
                <SelectTrigger id="ip-mode">
                  <SelectValue placeholder="Select IP mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhcp">DHCP</SelectItem>
                  <SelectItem value="static">Static IP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ip-address">IP Address</Label>
              <Input id="ip-address" placeholder="192.168.1.100" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subnet-mask">Subnet Mask</Label>
              <Input id="subnet-mask" placeholder="255.255.255.0" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gateway">Default Gateway</Label>
              <Input id="gateway" placeholder="192.168.1.1" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dns">DNS Servers</Label>
              <Input id="dns" placeholder="8.8.8.8, 8.8.4.4" disabled />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input id="admin-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-firewall">Enable Firewall</Label>
              <Switch id="enable-firewall" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-ssh">Enable SSH Access</Label>
              <Switch id="enable-ssh" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-https">Force HTTPS</Label>
              <Switch id="enable-https" defaultChecked />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          Back
        </Button>
        <Button onClick={handleNext}>{currentStep < 3 ? "Next" : "Complete Setup"}</Button>
      </CardFooter>
    </Card>
  )
}

