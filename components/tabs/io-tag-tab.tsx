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
  Pencil
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
    const devicesByPort: Record<string, Device[]> = {};
    ioPorts.forEach(port => {
      devicesByPort[port.id] = port.devices || [];
    });
    setDevices(devicesByPort);
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
  
  // Toggle port expansion
  const togglePortExpansion = (portId: string) => {
    setExpandedPorts(prev => ({
      ...prev,
      [portId]: !prev[portId]
    }));
  }
  
  // Toggle device expansion
  const toggleDeviceExpansion = (portId: string, deviceId: string) => {
    const key = `${portId}-${deviceId}`;
    setExpandedDevices(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  // Add new IO Port
  const handleAddPort = (config: any) => {
    const newPort = {
      id: `port-${Date.now()}`,
      ...config,
      devices: []
    };
    
    setIoPorts(prev => [...prev, newPort]);
    setShowAddPortForm(false);
    
    toast({
      title: "Port Added",
      description: `${config.name} has been added successfully.`,
    });
  }
  
  // Update existing IO Port
  const handleUpdatePort = (config: any) => {
    setIoPorts(prev => prev.map(port => {
      if (port.id === editingPort?.id) {
        return { ...port, ...config };
      }
      return port;
    }));
    
    setEditingPort(null);
    
    toast({
      title: "Port Updated",
      description: `${config.name} has been updated successfully.`,
    });
  }
  
  // Delete IO Port
  const handleDeletePort = () => {
    if (!deletePortDialog.port) return;
    
    setIoPorts(prev => prev.filter(port => port.id !== deletePortDialog.port?.id));
    
    // If the deleted port was selected, clear the selection
    if (selectedPort?.id === deletePortDialog.port.id) {
      setSelectedPort(null);
      setSelectedDevice(null);
    }
    
    setDeletePortDialog({isOpen: false, port: null});
    
    toast({
      title: "Port Deleted",
      description: `${deletePortDialog.port.name} has been deleted successfully.`,
    });
  }
  
  // Handle port selection
  const handlePortSelect = (port: Port) => {
    setSelectedPort(port);
    setSelectedDevice(null);
  }
  
  // Handle showing add device form for a specific port
  const handleShowAddDeviceForm = (portId: string) => {
    setAddingDeviceForPort(portId);
    setShowAddDeviceForm(true);
  }
  
  // Handle device form submission for adding a new device
  const handleAddDevice = (config: any, portId: string) => {
    const newDevice = {
      id: `device-${Date.now()}`,
      ...config,
      tags: [
        // Add a default tag for the new device
        {
          id: `tag-${Date.now()}`,
          name: "Default_Tag",
          dataType: "UINT16",
          address: "40001",
          description: "Default tag created automatically"
        }
      ]
    };
    
    // Update devices state
    setDevices(prev => {
      const updatedDevices = {...prev};
      if (updatedDevices[portId]) {
        updatedDevices[portId] = [...updatedDevices[portId], newDevice];
      } else {
        updatedDevices[portId] = [newDevice];
      }
      return updatedDevices;
    });
    
    // Update ioPorts state
    setIoPorts(prev => prev.map(port => {
      if (port.id === portId) {
        return {
          ...port,
          devices: [...(port.devices || []), newDevice]
        };
      }
      return port;
    }));
    
    setShowAddDeviceForm(false);
    setAddingDeviceForPort(null);
    
    toast({
      title: "Device Added",
      description: `${config.name} has been added successfully.`,
    });
  }
  
  // Handle edit device form submission
  const handleUpdateDevice = (config: any, portId: string) => {
    // Update devices state
    setDevices(prev => {
      const updatedDevices = {...prev};
      if (updatedDevices[portId]) {
        updatedDevices[portId] = updatedDevices[portId].map((device: Device) => 
          device.id === editingDevice.id ? {...device, ...config} : device
        );
      }
      return updatedDevices;
    });
    
    // Update ioPorts state
    setIoPorts(prev => prev.map(port => {
      if (port.id === portId) {
        return {
          ...port,
          devices: (port.devices || []).map((device: Device) => 
            device.id === editingDevice.id ? {...device, ...config} : device
          )
        };
      }
      return port;
    }));
    
    setEditingDevice(null);
    
    toast({
      title: "Device Updated",
      description: `${config.name} has been updated successfully.`,
    });
  }
  
  // Handle device deletion
  const handleDeleteDevice = () => {
    if (!deleteDeviceDialog.device || !deleteDeviceDialog.portId) return;
    
    // Update devices state
    setDevices(prev => {
      const updatedDevices = {...prev};
      if (updatedDevices[deleteDeviceDialog.portId!]) {
        updatedDevices[deleteDeviceDialog.portId!] = updatedDevices[deleteDeviceDialog.portId!].filter(
          (device: Device) => device.id !== deleteDeviceDialog.device?.id
        );
      }
      return updatedDevices;
    });
    
    // Update ioPorts state
    setIoPorts(prev => prev.map(port => {
      if (port.id === deleteDeviceDialog.portId) {
        return {
          ...port,
          devices: (port.devices || []).filter(
            (device: Device) => device.id !== deleteDeviceDialog.device?.id
          )
        };
      }
      return port;
    }));
    
    if (selectedDevice?.device.id === deleteDeviceDialog.device.id) {
      setSelectedDevice(null);
    }
    
    setDeleteDeviceDialog({isOpen: false, device: null, portId: null});
    
    toast({
      title: "Device Deleted",
      description: `${deleteDeviceDialog.device.name} has been deleted successfully.`,
    });
  }
  
  // Handle device selection
  const handleDeviceSelect = (device: Device, portId: string) => {
    setSelectedDevice({device, portId});
    
    // Update URL to include the device ID
    window.history.pushState(
      {}, 
      '', 
      `?tab=datacenter&section=io-tag&portId=${portId}&deviceId=${device.id}`
    );
  }
  
  // Handle IO tag updates
  const handleUpdateTags = (portId: string, deviceId: string, updatedTags: IOTag[]) => {
    // Update devices state
    setDevices(prev => {
      const updatedDevices = {...prev};
      if (updatedDevices[portId]) {
        updatedDevices[portId] = updatedDevices[portId].map((device: Device) => 
          device.id === deviceId ? {...device, tags: updatedTags} : device
        );
      }
      return updatedDevices;
    });
    
    // Update ioPorts state
    setIoPorts(prev => prev.map(port => {
      if (port.id === portId) {
        return {
          ...port,
          devices: (port.devices || []).map((device: Device) => 
            device.id === deviceId ? {...device, tags: updatedTags} : device
          )
        };
      }
      return port;
    }));
    
    toast({
      title: "Tags Updated",
      description: `Successfully updated IO tags for device`
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>IO Tag Management</CardTitle>
            <CardDescription>
              Configure communication ports, devices, and IO tags for your gateway
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddPortForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Port
          </Button>
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
            <DialogTitle>Edit Port Configuration</DialogTitle>
            <DialogDescription>
              Modify settings for {editingPort?.name}
            </DialogDescription>
          </DialogHeader>
          {editingPort && (
            <IOPortForm 
              onSubmit={handleUpdatePort} 
              initialValues={editingPort}
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
              portType={ioPorts.find(p => p.id === addingDeviceForPort)?.type || ""}
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
              initialValues={{
                name: editingDevice.name,
                type: editingDevice.type,
                enabled: editingDevice.enabled,
                unitNumber: editingDevice.unitNumber,
                description: editingDevice.description,
                tagWriteType: editingDevice.tagWriteType,
                addDeviceNameAsPrefix: editingDevice.addDeviceNameAsPrefix,
                extensionProperties: editingDevice.extensionProperties
              }}
              portType={editingDevice.port.type}
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
