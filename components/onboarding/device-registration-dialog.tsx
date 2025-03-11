"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface DeviceRegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: any
}

export function DeviceRegistrationDialog({ open, onOpenChange, device }: DeviceRegistrationDialogProps) {
  const [deviceName, setDeviceName] = useState("")
  const [deviceId, setDeviceId] = useState("")
  const [ipAddress, setIpAddress] = useState("")
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (device) {
      setDeviceName(device.name || "")
      setDeviceId(device.id || "")
      setIpAddress(device.ip || "")
      setComments("")
    }
  }, [device])

  const generateDeviceId = () => {
    const randomId = `gw-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`
    setDeviceId(randomId)
  }

  const handleSubmit = () => {
    if (!deviceName || !deviceId || !ipAddress) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate registration
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Device registered",
        description: `Successfully registered device ${deviceName}.`,
      })
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{device?.configured ? "Edit Device" : "Register New Device"}</DialogTitle>
          <DialogDescription>
            {device?.configured
              ? "Update the device information in your inventory."
              : "Register this device to your inventory for management."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="device-name" className="text-right">
              Name
            </Label>
            <Input
              id="device-name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="device-id" className="text-right">
              Device ID
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input id="device-id" value={deviceId} onChange={(e) => setDeviceId(e.target.value)} className="flex-1" />
              <Button variant="outline" onClick={generateDeviceId} type="button">
                Generate
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ip-address" className="text-right">
              IP Address
            </Label>
            <Input
              id="ip-address"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comments" className="text-right">
              Comments
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="col-span-3"
              placeholder="Optional notes about this device"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Device"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

