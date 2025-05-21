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

  // Handle add port
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
    
    // Close dialog
    setShowAddPortForm(false)
    
    toast({
      title: "Port Added",
      description: `Port ${config.name} has been added successfully.`,
    })
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
    if (!deleteDeviceDialog.device || !deleteDeviceDialog.portId) return;

    try {
      // Find the port that contains the device
      const portToUpdate = ioPorts.find(port => port.id === deleteDeviceDialog.portId)
      
      if (portToUpdate && portToUpdate.devices) {
        // Remove the device from the port's devices array
        const updatedDevices = portToUpdate.devices.filter(
          device => device.id !== deleteDeviceDialog.device?.id
        )
        
        // Update the port with the updated devices
        const updatedPort = {
          ...portToUpdate,
          devices: updatedDevices
        }
        
        // Update the ioPorts array
        const updatedPorts = ioPorts.map(port => 
          port.id === deleteDeviceDialog.portId ? updatedPort : port
        )
        
        setIoPorts(updatedPorts)
        
        // Also update the devices state to keep them in sync
        setDevices(prev => ({
          ...prev,
          [deleteDeviceDialog.portId || '']: updatedDevices
        }))
        
        // Clear selection if the deleted device was selected
        if (selectedDevice?.device.id === deleteDeviceDialog.device.id) {
          setSelectedDevice(null)
        }
        
        // Close the dialog
        setDeleteDeviceDialog({isOpen: false, device: null, portId: null})
        
        toast({
          title: "Device Deleted",
          description: `Device ${deleteDeviceDialog.device.name} has been deleted successfully.`,
        })
      }
    } catch (error) {
      console.error("Error deleting device:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete device. Please try again.",
      })
    }
  }

  // Handle device selection for viewing/editing tags
  const handleDeviceSelect = (device: Device, portId: string) => {
    setSelectedDevice({device, portId});
    // Update URL to reflect the selection
    window.history.pushState({}, '', `?tab=datacenter&section=io-tag&port=${portId}&device=${device.id}`);
  }

  // Handle IO tag updates
  const handleUpdateTags = (portId: string, deviceId: string, updatedTags: IOTag[]) => {
    try {
      // Update the ioPorts array
      const updatedPorts = ioPorts.map(port => {
        if (port.id === portId) {
          // Find and update the device
          const updatedDevices = port.devices?.map(device => {
            if (device.id === deviceId) {
              return {
                ...device,
                tags: updatedTags
              }
            }
            return device
          }) || []
          
          return {
            ...port,
            devices: updatedDevices
          }
        }
        return port
      })
      
      setIoPorts(updatedPorts)
      
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
