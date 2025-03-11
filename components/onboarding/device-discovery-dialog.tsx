"use client"

import { useState } from "react"
import { Loader2, Search } from "lucide-react"
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
import { useToast } from "@/components/ui/use-toast"

interface DeviceDiscoveryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeviceDiscoveryDialog({ open, onOpenChange }: DeviceDiscoveryDialogProps) {
  const [ipAddress, setIpAddress] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  const handleDiscover = () => {
    if (!ipAddress) {
      toast({
        title: "IP address required",
        description: "Please enter an IP address to discover the device.",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    // Simulate device discovery
    setTimeout(() => {
      setIsSearching(false)
      toast({
        title: "Device discovered",
        description: `Successfully discovered device at ${ipAddress}.`,
      })
      onOpenChange(false)
      setIpAddress("")
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discover Device</DialogTitle>
          <DialogDescription>
            Enter the IP address of the device you want to discover on your network.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ip-address">IP Address</Label>
            <div className="flex gap-2">
              <Input
                id="ip-address"
                placeholder="192.168.1.100"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                disabled={isSearching}
              />
              <Button variant="outline" size="icon" disabled={isSearching}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSearching}>
            Cancel
          </Button>
          <Button onClick={handleDiscover} disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Discovering...
              </>
            ) : (
              "Discover Device"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

