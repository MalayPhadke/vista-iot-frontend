"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"

export interface DeviceConfig {
  id: string
  enabled: boolean
  name: string
  deviceType: string
  unitNumber: number
  tagWriteType: string
  description: string
  addDeviceNameAsPrefix: boolean
  useAsciiProtocol: number
  packetDelay: number
  digitalBlockSize: number
  analogBlockSize: number
}

interface DeviceFormProps {
  onSubmit?: (config: DeviceConfig) => void
  existingConfig?: DeviceConfig
  portId: string
}

export function DeviceForm({ onSubmit, existingConfig, portId }: DeviceFormProps) {
  const [enabled, setEnabled] = useState(existingConfig?.enabled ?? true)
  const [name, setName] = useState(existingConfig?.name || "NewDevice")
  const [nameError, setNameError] = useState(true) // Start with error for default name
  const [deviceType, setDeviceType] = useState(existingConfig?.deviceType || "Modbus RTU")
  const [unitNumber, setUnitNumber] = useState(existingConfig?.unitNumber || 1)
  const [tagWriteType, setTagWriteType] = useState(existingConfig?.tagWriteType || "Single Write")
  const [description, setDescription] = useState(existingConfig?.description || "")
  const [addDeviceNameAsPrefix, setAddDeviceNameAsPrefix] = useState(existingConfig?.addDeviceNameAsPrefix ?? true)
  
  // Extension properties
  const [useAsciiProtocol, setUseAsciiProtocol] = useState(existingConfig?.useAsciiProtocol || 0)
  const [packetDelay, setPacketDelay] = useState(existingConfig?.packetDelay || 20)
  const [digitalBlockSize, setDigitalBlockSize] = useState(existingConfig?.digitalBlockSize || 512)
  const [analogBlockSize, setAnalogBlockSize] = useState(existingConfig?.analogBlockSize || 64)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    setNameError(newName === "NewDevice" || newName.trim() === "")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (nameError) {
      toast({
        title: "Validation Error",
        description: "Please provide a valid device name",
        variant: "destructive",
      })
      return
    }

    const config: DeviceConfig = {
      id: existingConfig?.id || `device-${Date.now()}`,
      enabled,
      name,
      deviceType,
      unitNumber,
      tagWriteType,
      description,
      addDeviceNameAsPrefix,
      useAsciiProtocol,
      packetDelay,
      digitalBlockSize,
      analogBlockSize
    }

    if (onSubmit) {
      onSubmit(config)
    }

    toast({
      title: "Device Configuration Saved",
      description: `Successfully saved configuration for ${name}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingConfig ? "Edit Device" : "Add New Device"}</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[70vh] overflow-y-auto pr-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-md font-medium mb-4">General Information</h3>
              
              {/* Enable option */}
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="enabled" 
                  checked={enabled} 
                  onCheckedChange={(checked) => setEnabled(checked as boolean)} 
                />
                <Label htmlFor="enabled">Enable</Label>
              </div>
              
              {/* Name with validation indicator */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="name" className="flex items-center">
                  Name
                  {nameError && (
                    <span className="ml-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                    </span>
                  )}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  className={nameError ? "border-destructive" : ""}
                />
                {nameError && (
                  <p className="text-xs text-destructive">Please enter a unique device name</p>
                )}
              </div>
              
              {/* Device Type dropdown */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="deviceType">Device Type</Label>
                <Select value={deviceType} onValueChange={setDeviceType}>
                  <SelectTrigger id="deviceType">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Modbus RTU">Modbus RTU</SelectItem>
                    <SelectItem value="Advantech ADAM 2000 Series (Modbus RTU)">Advantech ADAM 2000 Series (Modbus RTU)</SelectItem>
                    <SelectItem value="Advantech ADAM 4000 Series (ADAM ASCII/Modbus RTU)">Advantech ADAM 4000 Series (ADAM ASCII/Modbus RTU)</SelectItem>
                    <SelectItem value="Advantech WebCon 2000 Series">Advantech WebCon 2000 Series</SelectItem>
                    <SelectItem value="Advantech WebOP HMI (Modbus RTU)">Advantech WebOP HMI (Modbus RTU)</SelectItem>
                    <SelectItem value="Delta DVP Series PLC (Modbus RTU)">Delta DVP Series PLC (Modbus RTU)</SelectItem>
                    <SelectItem value="M System, Modbus Compatible, RX Series (Modbus RTU)">M System, Modbus Compatible, RX Series (Modbus RTU)</SelectItem>
                    <SelectItem value="Schneider ION6200 (Modbus RTU)">Schneider ION6200 (Modbus RTU)</SelectItem>
                    <SelectItem value="WAGO I/O System 750">WAGO I/O System 750</SelectItem>
                    <SelectItem value="YASKAWA MP900 series, MemoBus Modbus compatible (Modbus RTU)">YASKAWA MP900 series, MemoBus Modbus compatible (Modbus RTU)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Device Model */}
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="deviceModel" disabled />
                <Label htmlFor="deviceModel" className="flex-1">Device Model</Label>
                <Button variant="outline" disabled className="text-muted-foreground">
                  Double Click to Select Device Template
                </Button>
                <Button variant="outline" size="icon" disabled>...</Button>
              </div>
              
              {/* Unit Number */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="unitNumber">Unit Number</Label>
                <Input
                  id="unitNumber"
                  type="number"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(Number(e.target.value))}
                  min={0}
                />
              </div>
              
              {/* Tag Write Type dropdown */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="tagWriteType">Tag Write Type</Label>
                <Select value={tagWriteType} onValueChange={setTagWriteType}>
                  <SelectTrigger id="tagWriteType">
                    <SelectValue placeholder="Select tag write type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Write">Single Write</SelectItem>
                    <SelectItem value="Block Write">Block Write</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Description */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a description (optional)"
                  rows={3}
                />
              </div>
              
              {/* Add device name as prefix to IO tags */}
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="addDeviceNameAsPrefix" 
                  checked={addDeviceNameAsPrefix} 
                  onCheckedChange={(checked) => setAddDeviceNameAsPrefix(checked as boolean)} 
                />
                <Label htmlFor="addDeviceNameAsPrefix">Add device name as prefix to IO tags</Label>
              </div>
              
              {/* Bulk Copy button */}
              <Button type="button" variant="outline" className="mt-2">Bulk Copy</Button>
            </div>
            
            {/* Extension Properties */}
            <div className="border rounded-md p-4">
              <h3 className="text-md font-medium mb-4">Extension Properties</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Use ASCII Protocol */}
                <div className="space-y-2">
                  <Label htmlFor="useAsciiProtocol">Use ASCII Protocol</Label>
                  <Input
                    id="useAsciiProtocol"
                    type="number"
                    value={useAsciiProtocol}
                    onChange={(e) => setUseAsciiProtocol(Number(e.target.value))}
                    min={0}
                  />
                </div>
                
                {/* Packet Delay */}
                <div className="space-y-2">
                  <Label htmlFor="packetDelay">Packet Delay (ms)</Label>
                  <Input
                    id="packetDelay"
                    type="number"
                    value={packetDelay}
                    onChange={(e) => setPacketDelay(Number(e.target.value))}
                    min={0}
                  />
                </div>
                
                {/* Digital block size */}
                <div className="space-y-2">
                  <Label htmlFor="digitalBlockSize">Digital block size</Label>
                  <Input
                    id="digitalBlockSize"
                    type="number"
                    value={digitalBlockSize}
                    onChange={(e) => setDigitalBlockSize(Number(e.target.value))}
                    min={0}
                  />
                </div>
                
                {/* Analog block size */}
                <div className="space-y-2">
                  <Label htmlFor="analogBlockSize">Analog block size</Label>
                  <Input
                    id="analogBlockSize"
                    type="number"
                    value={analogBlockSize}
                    onChange={(e) => setAnalogBlockSize(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => {
              // Reset or cancel form
              if (onSubmit && existingConfig) {
                onSubmit(existingConfig);
              }
            }}>
              {existingConfig ? "Discard Changes" : "Cancel"}
            </Button>
            <Button type="submit">
              {existingConfig ? "Apply Changes" : "Add Device"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
