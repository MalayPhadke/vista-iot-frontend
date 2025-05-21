"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  Server,
  Terminal,
  Cpu,
  Tags,
  ChevronDown,
  Pencil,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Import your form components
import { IOPortForm } from "@/components/forms/io-tag-form"
import { DeviceForm } from "@/components/forms/device-form"
import { IOTagDetailView } from "@/components/forms/io-tag-detail"

// Helper function to get display name for port types
function getTypeDisplayName(type: string): string {
  const typeMap: Record<string, string> = {
    "builtin": "Built-in Serial Port",
    "serial": "Serial Port",
    "tcpip": "TCP/IP",
    "api": "API Connection",
    "modbus-rtu": "Modbus RTU",
    "modbus-tcp": "Modbus TCP",
    "opc-ua": "OPC UA",
    "mqtt": "MQTT Client"
  };
  
  return typeMap[type.toLowerCase()] || type;
}

// Type definitions
interface ExtensionProperties {
  useAsciiProtocol?: number;
  packetDelay?: number;
  digitalBlockSize?: number;
  analogBlockSize?: number;
}

interface Device {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  unitNumber: number;
  description: string;
  tagWriteType?: string;
  addDeviceNameAsPrefix?: boolean;
  extensionProperties?: ExtensionProperties;
  tags?: IOTag[];
}

interface Port {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  devices?: Device[];
  description: string;
  scanTime: number;
  timeOut: number;
  retryCount: number;
  autoRecoverTime: number;
  scanMode: string;
  serialSettings?: any;
}

interface IOTag {
  id: string;
  name: string;
  dataType: string;
  address: string;
  description: string;
}

interface IOTagManagementProps {
  ioPorts: Port[];
  setIoPorts: React.Dispatch<React.SetStateAction<Port[]>>;
  selectedPortId?: string | null;
  selectedDeviceId?: string | null;
}

export default function IOTagManagement({ 
  ioPorts = [], 
  setIoPorts, 
  selectedPortId = null, 
  selectedDeviceId = null 
}: IOTagManagementProps) {
  const { toast } = useToast()
  const [showAddPortForm, setShowAddPortForm] = useState(false)
  const [editingPort, setEditingPort] = useState<Port | null>(null)
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false)
  const [selectedPort, setSelectedPort] = useState<Port | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<{device: Device, portId: string} | null>(null)
  const [addingDeviceForPort, setAddingDeviceForPort] = useState<string | null>(null)
  const [editingDevice, setEditingDevice] = useState<any | null>(null)
  const [deletePortDialog, setDeletePortDialog] = useState<{isOpen: boolean, port: Port | null}>({isOpen: false, port: null})
  const [deleteDeviceDialog, setDeleteDeviceDialog] = useState<{isOpen: boolean, device: Device | null, portId: string | null}>({isOpen: false, device: null, portId: null})
  
  // Track expanded ports and devices
  const [expandedPorts, setExpandedPorts] = useState<Record<string, boolean>>({})
  const [expandedDevices, setExpandedDevices] = useState<Record<string, boolean>>({})
  // Organize devices by port
  const [devices, setDevices] = useState<Record<string, Device[]>>({})
  
  // Initialize devices state from ioPorts
  useEffect(() => {
    ioPorts.forEach(port => {
      setDevices(prev => ({
        ...prev,
        [port.id]: port.devices || []
      }))
    })
    
    // Store the ioPorts data in localStorage for sharing with other components
    try {
      localStorage.setItem('io_ports_data', JSON.stringify(ioPorts))
    } catch (error) {
      console.error('Error storing IO ports data in localStorage:', error)
    }
  }, [ioPorts]);

  // Handle changes to selectedPortId and selectedDeviceId
  useEffect(() => {
    // Reset selections if no port ID is provided
    if (!selectedPortId) {
      setSelectedPort(null);
      setSelectedDevice(null);
      return;
    }
    
    // Find the selected port
    const port = ioPorts.find(p => p.id === selectedPortId);
    if (!port) return;
    
    // Set the selected port and expand it
    setSelectedPort(port);
    setExpandedPorts(prev => ({...prev, [port.id]: true}));
    
    // If selectedDeviceId is provided, set the selected device
    if (selectedDeviceId && port.devices) {
      const device = port.devices.find((d: Device) => d.id === selectedDeviceId);
      if (device) {
        setSelectedDevice({device, portId: port.id});
        setExpandedDevices(prev => ({...prev, [`${port.id}-${device.id}`]: true}));
      } else {
        // If device not found, clear device selection
        setSelectedDevice(null);
      }
    } else {
      // If no device ID provided, clear device selection
      setSelectedDevice(null);
    }
  }, [ioPorts, selectedPortId, selectedDeviceId]);

  // Handle add calculation tag
  const handleAddPort = (config: any) => {
    // Create a new port with a unique ID
    const newPort: Port = {
      id: `port-${Date.now()}`,
      ...config,
      devices: [],
      enabled: true
    }
    
    // Update state
    const updatedPorts = [...ioPorts, newPort]
    setIoPorts(updatedPorts)
    
    // Sync to localStorage for other components
    try {
      localStorage.setItem('io_ports_data', JSON.stringify(updatedPorts))
    } catch (error) {
      console.error('Error storing updated IO ports data in localStorage:', error)
    }
    
    // Close dialog
    setShowAddPortForm(false)
    
    toast({
      title: "Port Added",
      description: `Port ${config.name} has been added successfully.`,
    })
  }

  // Handle device selection for viewing/editing tags
  const handleDeviceSelect = (device: Device, portId: string) => {
    setSelectedDevice({device, portId});
    // Update URL to reflect the selection - match the sidebar navigation URL pattern
    window.history.pushState({}, '', `?tab=datacenter&section=io-tag&portId=${portId}&deviceId=${device.id}`);
  }
  
  // Update existing IO Port
  const handleUpdatePort = (config: any) => {
    // Find the port to update
    const portToUpdate = ioPorts.find(port => port.id === config.id)
    
    if (portToUpdate) {
      // Update the port properties while preserving its devices
      const updatedPort = {
        ...portToUpdate,
        ...config,
        devices: portToUpdate.devices // Preserve existing devices
      }
      
      // Update the ioPorts array
      const updatedPorts = ioPorts.map(port => port.id === config.id ? {
        ...updatedPort
      } : port)
      
      setIoPorts(updatedPorts)
      
      // Close dialog
      setEditingPort(null)
      
      toast({
        title: "Port Updated",
        description: `Port ${config.name} has been updated successfully.`,
      })
    }
  }

  // Handle delete IO Port
  const handleDeletePort = () => {
    if (!deletePortDialog.port) return;

    try {
      // Remove the port from the list
      const updatedPorts = ioPorts.filter(port => port.id !== deletePortDialog.port?.id)
      setIoPorts(updatedPorts)
      
      // Sync to localStorage for other components
      localStorage.setItem('io_ports_data', JSON.stringify(updatedPorts))
      
      // Remove the port's devices from the devices state
      setDevices(prev => {
        const newDevices = { ...prev }
        delete newDevices[deletePortDialog.port?.id || ''] 
        return newDevices
      })
      
      // Clear selection if the deleted port was selected
      if (selectedPort?.id === deletePortDialog.port.id) {
        setSelectedPort(null)
      }
      
      // Close the dialog
      setDeletePortDialog({isOpen: false, port: null})
      
      toast({
        title: "Port Deleted",
        description: `Port ${deletePortDialog.port.name} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting port:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete port. Please try again.",
      })
    }
  }

  // Handle showing add device form for a specific port
  const handleShowAddDeviceForm = (portId: string) => {
    setAddingDeviceForPort(portId);
    setShowAddDeviceForm(true);
  }

  // Handle device form submission for adding a new device
  const handleAddDevice = (config: any, portId: string) => {
    try {
      // Create a new device with a unique ID
      const newDevice: Device = {
        id: `device-${Date.now()}`,
        ...config,
        tags: [],
        enabled: true
      }
      
      // Update the devices state for the selected port
      setDevices(prev => ({
        ...prev,
        [portId]: [...(prev[portId] || []), newDevice]
      }))
      
      // Also update the ioPorts state to keep them in sync
      const updatedPorts = ioPorts.map(port => {
        if (port.id === portId) {
          return {
            ...port,
            devices: [...(port.devices || []), newDevice]
          }
        }
        return port
      })
      
      setIoPorts(updatedPorts)
      
      // Sync to localStorage for other components
      try {
        localStorage.setItem('io_ports_data', JSON.stringify(updatedPorts))
      } catch (error) {
        console.error('Error storing updated IO ports data in localStorage:', error)
      }
      
      // Close the dialog
      setShowAddDeviceForm(false)
      setAddingDeviceForPort(null)
      
      toast({
        title: "Device Added",
        description: `Device ${config.name} has been added successfully.`,
      })
    } catch (error) {
      console.error("Error adding device:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add device. Please try again.",
      })
    }
  }

  // Handle updating device configuration
  const handleUpdateDevice = (config: any, portId: string) => {
    // Find the port that contains the device
    const portToUpdate = ioPorts.find(port => port.id === portId)
    
    if (portToUpdate && portToUpdate.devices) {
      // Find the device to update
      const deviceToUpdate = portToUpdate.devices.find(device => device.id === config.id)
      
      if (deviceToUpdate) {
        // Update the device properties while preserving its tags
        const updatedDevice = {
          ...deviceToUpdate,
          ...config,
          tags: deviceToUpdate.tags // Preserve existing tags
        }
        
        // Update the devices array for this port
        const updatedDevices = portToUpdate.devices.map(device => 
          device.id === config.id ? updatedDevice : device
        )
        
        // Update the port with the updated devices
        const updatedPort = {
          ...portToUpdate,
          devices: updatedDevices
        }
        
        // Update the ioPorts array
        const updatedPorts = ioPorts.map(port => 
          port.id === portId ? updatedPort : port
        )
        
        setIoPorts(updatedPorts)
        
        // Close dialog
        setEditingDevice(null)
        
        toast({
          title: "Device Updated",
          description: `Device ${config.name} has been updated successfully.`,
        })
      }
    }
  }

  // Handle device deletion
  const handleDeleteDevice = () => {
    if (!deleteDeviceDialog.device || !deleteDeviceDialog.portId) return
    
    try {
      const deviceId = deleteDeviceDialog.device.id
      const portId = deleteDeviceDialog.portId
      
      // Update the devices state
      setDevices(prev => {
        const updatedDevices = (prev[portId] || []).filter(d => d.id !== deviceId)
        
        return {
          ...prev,
          [portId]: updatedDevices
        }
      })
      
      // Update ioPorts state
      const updatedPorts = ioPorts.map(port => {
        if (port.id === portId) {
          return {
            ...port,
            devices: (port.devices || []).filter(d => d.id !== deviceId)
          }
        }
        return port
      })
      
      setIoPorts(updatedPorts)
      
      // Sync to localStorage for other components
      try {
        localStorage.setItem('io_ports_data', JSON.stringify(updatedPorts))
      } catch (error) {
        console.error('Error storing updated IO ports data in localStorage:', error)
      }
      
      // Clear selection if the deleted device was selected
      if (selectedDevice?.device.id === deviceId) {
        setSelectedDevice(null)
      }
      
      // Close the dialog
      setDeleteDeviceDialog({isOpen: false, device: null, portId: null})
      
      toast({
        title: "Device Deleted",
        description: `Device ${deleteDeviceDialog.device.name} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting device:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete device. Please try again.",
      })
    }
  }

  // Handle IO tag updates
  const handleUpdateTags = (portId: string, deviceId: string, updatedTags: IOTag[]) => {
    try {
      // Update the device tags in the devices state
      setDevices(prev => {
        const portDevices = [...(prev[portId] || [])]
        const deviceIndex = portDevices.findIndex(d => d.id === deviceId)
        
        if (deviceIndex >= 0) {
          portDevices[deviceIndex] = {
            ...portDevices[deviceIndex],
            tags: updatedTags
          }
        }
        
        return {
          ...prev,
          [portId]: portDevices
        }
      })
      
      // Update ioPorts state
      const updatedPorts = ioPorts.map(port => {
        if (port.id === portId) {
          const updatedDevices = [...(port.devices || [])]
          const deviceIndex = updatedDevices.findIndex(d => d.id === deviceId)
          
          if (deviceIndex >= 0) {
            updatedDevices[deviceIndex] = {
              ...updatedDevices[deviceIndex],
              tags: updatedTags
            }
          }
          
          return {
            ...port,
            devices: updatedDevices
          }
        }
        return port
      })
      
      setIoPorts(updatedPorts)
      
      // Sync to localStorage for other components
      try {
        localStorage.setItem('io_ports_data', JSON.stringify(updatedPorts))
      } catch (error) {
        console.error('Error storing updated IO ports data in localStorage:', error)
      }
      
      toast({
        title: "Tags Updated",
        description: `Tags have been updated successfully.`,
      })
    } catch (error) {
      console.error("Error updating tags:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tags. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            {selectedPort ? (
              <>
                <CardTitle>Devices</CardTitle>
                <CardDescription>
                  Manage devices for port: {selectedPort.name}
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle>IO Ports</CardTitle>
                <CardDescription>
                  Configure communication ports for your IO tags
                </CardDescription>
              </>
            )}
          </div>
          {!selectedPort && (
            <Button onClick={() => setShowAddPortForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Port
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {ioPorts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No communication ports configured yet</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setShowAddPortForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Port
              </Button>
            </div>
          ) : (
            <div className="w-full">
              {/* Selected device info banner */}
              {selectedDevice && selectedPort && (
                <div className="bg-muted mb-6 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Terminal className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedPort.name} / {selectedDevice.device.name}</h3>
                      <p className="text-xs text-muted-foreground">Managing IO Tags for this device</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        window.history.pushState({}, '', `?tab=datacenter&section=io-tag`);
                        setSelectedDevice(null);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedDevice ? (
                <div className="border rounded-lg p-4">
                  <IOTagDetailView 
                    device={selectedDevice.device} 
                    portId={selectedDevice.portId} 
                    onUpdate={handleUpdateTags}
                  />
                </div>
              ) : !selectedPort ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {ioPorts.map((port) => (
                    <Card 
                      key={port.id} 
                      className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
                      onClick={() => {
                        window.history.pushState({}, '', `?tab=datacenter&section=io-tag&portId=${port.id}`);
                        setSelectedPort(port);
                      }}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{port.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Type:</span>
                            <span className="text-sm font-medium">{getTypeDisplayName(port.type)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Scan Mode:</span>
                            <span className="text-sm font-medium">{port.scanMode}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Switch
                              checked={port.enabled}
                              onCheckedChange={(checked: boolean) => {
                                // Prevent the card click when toggling the switch
                                const e = window.event;
                                if (e) {
                                  e.stopPropagation();
                                }
                                const updatedPort = { ...port, enabled: checked };
                                handleUpdatePort(updatedPort);
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            // This is redundant since the whole card is clickable, but keeping for clarity
                            e.stopPropagation();
                            window.history.pushState({}, '', `?tab=datacenter&section=io-tag&portId=${port.id}`);
                            setSelectedPort(port);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPort(port);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletePortDialog({ isOpen: true, port });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : selectedPort ? (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedPort.name}</h3>
                      <p className="text-sm text-muted-foreground">{getTypeDisplayName(selectedPort.type)}</p>
                    </div>
                    <div className="flex space-x-2">
                      {/* Edit and Delete buttons */}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setEditingPort(selectedPort)}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setDeletePortDialog({ isOpen: true, port: selectedPort })}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Port details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <div className="flex items-center mt-1">
                        <div className={`h-2 w-2 rounded-full mr-2 ${selectedPort.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <p className="text-sm">{selectedPort.enabled ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm mt-1">{getTypeDisplayName(selectedPort.type)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Scan Time</p>
                      <p className="text-sm mt-1">{selectedPort.scanTime} ms</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Timeout</p>
                      <p className="text-sm mt-1">{selectedPort.timeOut} ms</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Retry Count</p>
                      <p className="text-sm mt-1">{selectedPort.retryCount}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Auto Recover Time</p>
                      <p className="text-sm mt-1">{selectedPort.autoRecoverTime} s</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Scan Mode</p>
                      <p className="text-sm mt-1">{selectedPort.scanMode}</p>
                    </div>
                  </div>
                  
                  {/* Serial settings if applicable */}
                  {selectedPort.type.includes("serial") && selectedPort.serialSettings && (
                    <div>
                      <h4 className="font-medium mb-3">Serial Port Settings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Port</p>
                          <p className="text-sm mt-1">{selectedPort.serialSettings.port}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Baud Rate</p>
                          <p className="text-sm mt-1">{selectedPort.serialSettings.baudRate}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Data Bits</p>
                          <p className="text-sm mt-1">{selectedPort.serialSettings.dataBit}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Stop Bits</p>
                          <p className="text-sm mt-1">{selectedPort.serialSettings.stopBit}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Parity</p>
                          <p className="text-sm mt-1">{selectedPort.serialSettings.parity}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Flow Control</p>
                          <div className="flex space-x-4 mt-1">
                            <div className="flex items-center">
                              <p className="text-xs mr-1">RTS:</p>
                              <p className="text-xs">{selectedPort.serialSettings.rts ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="flex items-center">
                              <p className="text-xs mr-1">DTR:</p>
                              <p className="text-xs">{selectedPort.serialSettings.dtr ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Devices in this port */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Devices</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleShowAddDeviceForm(selectedPort.id)}
                      >
                        <Plus className="h-3 w-3" />
                        Add Device
                      </Button>
                    </div>
                    
                    {devices[selectedPort.id]?.length > 0 ? (
                      <div className="space-y-2">
                        {devices[selectedPort.id].map((device: Device) => (
                          <div 
                            key={device.id} 
                            className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/30 cursor-pointer"
                            onClick={() => handleDeviceSelect(device, selectedPort.id)}
                          >
                            <div className="flex items-center">
                              <Cpu className="h-4 w-4 mr-2 text-primary" />
                              <div>
                                <p className="text-sm font-medium">{device.name}</p>
                                <p className="text-xs text-muted-foreground">{device.type} - Unit {device.unitNumber}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className={`h-2 w-2 rounded-full ${device.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingDevice({
                                    ...device,
                                    port: selectedPort
                                  });
                                }}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteDeviceDialog({ isOpen: true, device: device, portId: selectedPort.id });
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 border rounded-md text-muted-foreground">
                        <p>No devices configured for this port</p>
                        <Button 
                          variant="link"
                          onClick={() => handleShowAddDeviceForm(selectedPort.id)}
                        >
                          Add your first device
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <Terminal className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select from Sidebar</h3>
                  <p className="text-muted-foreground max-w-md mb-6">Select a port or device from the sidebar to manage IO Tags</p>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setShowAddPortForm(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add New Port
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Port Dialog */}
      <Dialog open={showAddPortForm} onOpenChange={setShowAddPortForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Communication Port</DialogTitle>
            <DialogDescription>
              Configure a new port for device communications
            </DialogDescription>
          </DialogHeader>
          <IOPortForm onSubmit={handleAddPort} />
        </DialogContent>
      </Dialog>

      {/* Edit Port Dialog */}
      <Dialog open={!!editingPort} onOpenChange={(open) => !open && setEditingPort(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Port</DialogTitle>
            <DialogDescription>
              Modify settings for {editingPort?.name}
            </DialogDescription>
          </DialogHeader>
          {editingPort && (
            <IOPortForm 
              onSubmit={handleUpdatePort} 
              existingConfig={editingPort}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Port Confirmation Dialog */}
      <AlertDialog open={deletePortDialog.isOpen} onOpenChange={(open) => !open && setDeletePortDialog({isOpen: false, port: null})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Port</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletePortDialog.port?.name}? This action cannot be undone.
              All devices and tags associated with this port will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePort}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Device Dialog */}
      <Dialog open={showAddDeviceForm} onOpenChange={setShowAddDeviceForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Configure a new device for {ioPorts.find(p => p.id === addingDeviceForPort)?.name}
            </DialogDescription>
          </DialogHeader>
          {addingDeviceForPort && (
            <DeviceForm 
              onSubmit={(config) => handleAddDevice(config, addingDeviceForPort)} 
              portId={addingDeviceForPort}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog open={!!editingDevice} onOpenChange={(open) => !open && setEditingDevice(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>
              Modify settings for {editingDevice?.name}
            </DialogDescription>
          </DialogHeader>
          {editingDevice && (
            <DeviceForm 
              onSubmit={(config) => handleUpdateDevice(config, editingDevice.port.id)} 
              existingConfig={{
                id: editingDevice.id,
                name: editingDevice.name,
                deviceType: editingDevice.type,
                enabled: editingDevice.enabled,
                unitNumber: editingDevice.unitNumber,
                description: editingDevice.description,
                tagWriteType: editingDevice.tagWriteType || 'Single Write',
                addDeviceNameAsPrefix: editingDevice.addDeviceNameAsPrefix || false,
                useAsciiProtocol: editingDevice.extensionProperties?.useAsciiProtocol || 0,
                packetDelay: editingDevice.extensionProperties?.packetDelay || 20,
                digitalBlockSize: editingDevice.extensionProperties?.digitalBlockSize || 512,
                analogBlockSize: editingDevice.extensionProperties?.analogBlockSize || 64
              }}
              portId={editingDevice.port.id}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Device Confirmation Dialog */}
      <AlertDialog open={deleteDeviceDialog.isOpen} onOpenChange={(open) => !open && setDeleteDeviceDialog({isOpen: false, device: null, portId: null})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteDeviceDialog.device?.name}? This action cannot be undone.
              All tags associated with this device will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDevice}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
