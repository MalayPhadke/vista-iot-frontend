"use client"

import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, Download, FileSpreadsheet, Upload, X, AlertTriangle, ChevronDown, ChevronRight, Server, Cpu, Tag } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

// Edit IP Dialog Component
function EditIPDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [ipAddress, setIpAddress] = useState("")
  
  const handleSave = () => {
    // Logic to save the IP address would go here
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Edit IP
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-4 py-4">
          <Label htmlFor="ip-address" className="w-8">IP:</Label>
          <Input 
            id="ip-address" 
            value={ipAddress} 
            onChange={(e) => setIpAddress(e.target.value)} 
            placeholder="Enter IP address"
          />
        </div>
        
        <DialogFooter>
          <div className="flex gap-2">
            <Button type="button" onClick={handleSave}>OK</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Advanced Settings Dialog Component
function IEC104AdvancedSettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState("general")
  const [doAccessType, setDoAccessType] = useState("any")
  const [aoAccessType, setAoAccessType] = useState("any")
  const [editIPDialogOpen, setEditIPDialogOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState<"do" | "ao">("do")
  
  const handleAddIP = (section: "do" | "ao") => {
    setCurrentSection(section)
    setEditIPDialogOpen(true)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Edit IP Dialog */}
      <EditIPDialog 
        open={editIPDialogOpen} 
        onOpenChange={setEditIPDialogOpen} 
      />
      
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>IEC-104 Advance Setting</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="scope">Scope</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            {/* Top Row - Time-related Settings */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="t0" className="w-16">t0(s):</Label>
                <Input id="t0" defaultValue="30" className="max-w-[100px]" />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="t2" className="w-16">t2(s):</Label>
                <Input id="t2" defaultValue="10" className="max-w-[100px]" />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="k" className="w-16">k(APDUs):</Label>
                <Input id="k" defaultValue="12" className="max-w-[100px]" />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="t1" className="w-16">t1(s):</Label>
                <Input id="t1" defaultValue="15" className="max-w-[100px]" />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="t3" className="w-16">t3(s):</Label>
                <Input id="t3" defaultValue="30" className="max-w-[100px]" />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="w" className="w-16">w(APDUs):</Label>
                <Input id="w" defaultValue="8" className="max-w-[100px]" />
              </div>
            </div>
            
            {/* Middle Row - Length Settings and Time Tag */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="common-address-length" className="w-40">Common Address Length:</Label>
                <Input id="common-address-length" defaultValue="2" className="max-w-[100px]" />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="time-tag" className="w-24">Time Tag:</Label>
                <Select defaultValue="cp56">
                  <SelectTrigger id="time-tag" className="w-[180px]">
                    <SelectValue placeholder="Select time tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cp56">CP56 Time2a</SelectItem>
                    <SelectItem value="cp24">CP24 Time</SelectItem>
                    <SelectItem value="cp32">CP32 Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="info-address-length" className="w-40">Info Address Length:</Label>
                <Input id="info-address-length" defaultValue="3" className="max-w-[100px]" />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="transmit-cause-length" className="w-40">Transmit Cause Length:</Label>
                <Input id="transmit-cause-length" defaultValue="2" className="max-w-[100px]" />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="asdu-data-length" className="w-40">ASDU Data Length:</Label>
                <Input id="asdu-data-length" defaultValue="253" className="max-w-[100px]" />
              </div>
            </div>
            
            {/* Bottom - Description Text Area */}
            <div className="space-y-2">
              <Label htmlFor="description">Description:</Label>
              <Textarea id="description" className="min-h-[100px]" placeholder="Enter description here..." />
            </div>
          </TabsContent>
          
          <TabsContent value="scope" className="mt-4 space-y-6">
            {/* DO Access Control Section */}
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">DO Access Control</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="do-any-ip" 
                    name="do-access-type" 
                    value="any" 
                    checked={doAccessType === "any"}
                    onChange={() => setDoAccessType("any")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="do-any-ip">Any IP Address</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="do-specific-ip" 
                    name="do-access-type" 
                    value="specific" 
                    checked={doAccessType === "specific"}
                    onChange={() => setDoAccessType("specific")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="do-specific-ip">These IP Address</Label>
                </div>
                
                <div className="flex gap-4">
                  <Textarea 
                    className="flex-1 min-h-[100px]" 
                    placeholder="Enter IP addresses, one per line"
                    disabled={doAccessType === "any"}
                  />
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={doAccessType === "any"}
                      onClick={() => handleAddIP("do")}
                    >
                      Add
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={doAccessType === "any"}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AO Access Control Section */}
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">AO Access Control</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="ao-any-ip" 
                    name="ao-access-type" 
                    value="any" 
                    checked={aoAccessType === "any"}
                    onChange={() => setAoAccessType("any")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="ao-any-ip">Any IP Address</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="ao-specific-ip" 
                    name="ao-access-type" 
                    value="specific" 
                    checked={aoAccessType === "specific"}
                    onChange={() => setAoAccessType("specific")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="ao-specific-ip">These IP Address</Label>
                </div>
                
                <div className="flex gap-4">
                  <Textarea 
                    className="flex-1 min-h-[100px]" 
                    placeholder="Enter IP addresses, one per line"
                    disabled={aoAccessType === "any"}
                  />
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={aoAccessType === "any"}
                      onClick={() => handleAddIP("ao")}
                    >
                      Add
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={aoAccessType === "any"}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button">OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function IECProtocolsForm() {
  const { toast } = useToast()
  const [activeChannel, setActiveChannel] = useState(1)
  const [activeIOTab, setActiveIOTab] = useState("DI")
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false)
  const [tagSelectionDialogOpen, setTagSelectionDialogOpen] = useState(false)
  const [expandedPorts, setExpandedPorts] = useState<string[]>(['io-tag'])
  const [expandedDevices, setExpandedDevices] = useState<string[]>([])
  const [currentSection, setCurrentSection] = useState<"DI" | "AI" | "Counter" | "DO" | "AO">("DI")
  const [ioPorts, setIoPorts] = useState<any[]>([])
  
  // Fetch IO ports data from localStorage
  useEffect(() => {
    const fetchIoPorts = () => {
      try {
        const storedPorts = localStorage.getItem('io_ports_data')
        if (storedPorts) {
          const parsedPorts = JSON.parse(storedPorts)
          console.log('Fetched IO ports data:', parsedPorts)
          setIoPorts(parsedPorts)
        }
      } catch (error) {
        console.error('Error fetching IO ports data:', error)
      }
    }
    
    // Initial fetch
    fetchIoPorts()
    
    // Set up event listener for changes
    const handleIoPortsUpdate = (event: StorageEvent) => {
      if (event.key === 'io_ports_data' && event.newValue) {
        try {
          const updatedPorts = JSON.parse(event.newValue)
          console.log('IO ports data updated:', updatedPorts)
          setIoPorts(updatedPorts)
        } catch (error) {
          console.error('Error parsing updated IO ports data:', error)
        }
      }
    }
    
    window.addEventListener('storage', handleIoPortsUpdate)
    
    // Also check for updates every 2 seconds (as a fallback)
    const intervalId = setInterval(fetchIoPorts, 2000)
    
    return () => {
      window.removeEventListener('storage', handleIoPortsUpdate)
      clearInterval(intervalId)
    }
  }, [])
  
  // Sample data for the tables - using high ID value (999999) for the "Double click to edit" row
  const [diPoints, setDiPoints] = useState([
    { id: 999999, tagName: "Double click to edit", valueType: "", publicAddress: "", pointNumber: "", soe: "" }
  ])
  
  const [doPoints, setDoPoints] = useState([
    { id: 999999, tagName: "Double click to edit", valueType: "", publicAddress: "", pointNumber: "" }
  ])
  
  const [aiPoints, setAiPoints] = useState([
    { id: 999999, tagName: "Double click to edit", valueType: "", publicAddress: "", pointNumber: "", kValue: "", baseValue: "", changePercent: "" }
  ])
  
  const [counterPoints, setCounterPoints] = useState([
    { id: 999999, tagName: "Double click to edit", valueType: "", publicAddress: "", pointNumber: "", kValue: "", baseValue: "", changePercent: "" }
  ])
  
  const [aoPoints, setAoPoints] = useState([
    { id: 999999, tagName: "Double click to edit", valueType: "", publicAddress: "", pointNumber: "", kValue: "", baseValue: "" }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "IEC protocol settings have been updated.",
    })
  }
  
  const handleDiscard = () => {
    toast({
      title: "Changes discarded",
      description: "Your changes have been discarded.",
    })
  }
  
  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Exporting configuration to Excel.",
    })
  }
  
  const handleImport = () => {
    toast({
      title: "Import initiated",
      description: "Importing configuration from Excel.",
    })
  }
  
  const handleAdvancedSettings = () => {
    setAdvancedSettingsOpen(true)
  }
  
  const handleTagSelection = (section: "DI" | "AI" | "Counter" | "DO" | "AO") => {
    setCurrentSection(section)
    setTagSelectionDialogOpen(true)
  }
  
  // Toggle expansion of a port in the tree
  const togglePortExpansion = (portId: string) => {
    setExpandedPorts(prev => {
      if (prev.includes(portId)) {
        return prev.filter(id => id !== portId)
      } else {
        return [...prev, portId]
      }
    })
  }
  
  // Toggle expansion of a device in the tree
  const toggleDeviceExpansion = (deviceId: string) => {
    setExpandedDevices(prev => {
      if (prev.includes(deviceId)) {
        return prev.filter(id => id !== deviceId)
      } else {
        return [...prev, deviceId]
      }
    })
  }
  
  // Select a tag from the tree and add it to the current section
  const selectTagFromTree = (tag: any, deviceName: string, portName: string) => {
    // Create a formatted tag name that includes the device name
    const formattedTagName = `${deviceName}:${tag.name}`
    
    // Generate a unique ID for the new point
    const newPointId = Date.now()
    
    // Get the next point number based on section
    const getNextPointNumber = () => {
      switch (currentSection) {
        case "DI":
          // Find the highest point number in the existing points, excluding the "Double click to edit" row
          const highestDiPoint = Math.max(
            ...diPoints
              .filter(p => p.tagName !== "Double click to edit" && p.pointNumber)
              .map(p => parseInt(p.pointNumber) || 1)
          )
          // Return the next number, or 2 if there are no existing points
          return isFinite(highestDiPoint) ? (highestDiPoint + 1).toString() : "2"
        
        case "AI":
          // Find the highest point number in the existing AI points, starting from 1794
          const highestAiPoint = Math.max(
            ...aiPoints
              .filter(p => p.tagName !== "Double click to edit" && p.pointNumber)
              .map(p => parseInt(p.pointNumber) || 1793)
          )
          // Return the next number, or 1794 if there are no existing points
          return isFinite(highestAiPoint) ? (highestAiPoint + 1).toString() : "1794"
        
        case "Counter":
          // Find the highest point number in the existing Counter points, starting from 3074
          const highestCounterPoint = Math.max(
            ...counterPoints
              .filter(p => p.tagName !== "Double click to edit" && p.pointNumber)
              .map(p => parseInt(p.pointNumber) || 3073)
          )
          // Return the next number, or 3074 if there are no existing points
          return isFinite(highestCounterPoint) ? (highestCounterPoint + 1).toString() : "3074"
        
        case "DO":
          // Find the highest point number in the existing DO points, starting from 2818
          const highestDoPoint = Math.max(
            ...doPoints
              .filter(p => p.tagName !== "Double click to edit" && p.pointNumber)
              .map(p => parseInt(p.pointNumber) || 2817)
          )
          // Return the next number, or 2818 if there are no existing points
          return isFinite(highestDoPoint) ? (highestDoPoint + 1).toString() : "2818"
        
        case "AO":
          // Find the highest point number in the existing AO points, starting from 2946
          const highestAoPoint = Math.max(
            ...aoPoints
              .filter(p => p.tagName !== "Double click to edit" && p.pointNumber)
              .map(p => parseInt(p.pointNumber) || 2945)
          )
          // Return the next number, or 2946 if there are no existing points
          return isFinite(highestAoPoint) ? (highestAoPoint + 1).toString() : "2946"
        
        default:
          return tag.address || ""
      }
    }
    
    // Add the selected tag to the appropriate section based on currentSection
    switch (currentSection) {
      case "DI":
        setDiPoints(prev => {
          // Filter out the "Double click to edit" row
          const realPoints = prev.filter(p => p.tagName !== "Double click to edit")
          // Create the new point
          const newPoint = { 
            id: newPointId, 
            tagName: formattedTagName, 
            valueType: "M_SP_NA_1", // Default to single-point-information
            publicAddress: "2", // Default to 2 as requested
            pointNumber: getNextPointNumber(), 
            soe: "No SOE" // Default to No SOE
          }
          // Return all real points + new point + the "Double click to edit" row at the end
          return [
            ...realPoints,
            newPoint,
            { id: 999999, tagName: "Double click to edit", valueType: "", publicAddress: "", pointNumber: "", soe: "" }
          ]
        })
        break
      case "AI":
        setAiPoints(prev => {
          const realPoints = prev.filter(p => p.tagName !== "Double click to edit")
          return [
            ...realPoints,
            { 
              id: newPointId, 
              tagName: formattedTagName, 
              valueType: "M_ME_NA_1", // Default to normalized value
              publicAddress: "2", // Default to 2 as requested
              pointNumber: getNextPointNumber(), // Auto-increment from 1794
              kValue: "1", // Default to 1
              baseValue: "0", // Default to 1
              changePercent: "10" // Default to 10%
            },
            { id: 999999, tagName: "Double click to edit", valueType: "", publicAddress: "", pointNumber: "", kValue: "", baseValue: "", changePercent: "" }
          ]
        })
        break
      case "Counter":
        setCounterPoints(prev => {
          const realPoints = prev.filter(p => p.tagName !== "Double click to edit")
          return [
            ...realPoints,
            { 
              id: newPointId, 
              tagName: formattedTagName, 
              valueType: "M_IT_NA_1", // Default to Integrated totals
              publicAddress: "2", // Default to 2 as requested
              pointNumber: getNextPointNumber(), // Auto-increment from 3074
              kValue: "1", // Default to 1
              baseValue: "0", // Default to 0
              changePercent: "10" // Default to 10%
            },
            { id: 999999, tagName: "Double click to edit", valueType: "", publicAddress: "", pointNumber: "", kValue: "", baseValue: "", changePercent: "" }
          ]
        })
        break
      case "DO":
        setDoPoints(prev => {
          const realPoints = prev.filter(p => p.tagName !== "Double click to edit")
          return [
            ...realPoints,
            { 
              id: newPointId, 
              tagName: formattedTagName, 
              valueType: "C_SC_NA_1", // Default to Single command
              publicAddress: "2", // Default to 2 as requested
              pointNumber: getNextPointNumber() // Auto-increment from 2818
            },
            { id: 999999, tagName: "Double click to edit", valueType: "", publicAddress: "", pointNumber: "" }
          ]
        })
        break
      case "AO":
        setAoPoints(prev => {
          const realPoints = prev.filter(p => p.tagName !== "Double click to edit")
          return [
            ...realPoints,
            { 
              id: newPointId, 
              tagName: formattedTagName, 
              valueType: "C_SE_NA_1", // Default to set point command, normalized value
              publicAddress: "2", // Default to 2 as requested
              pointNumber: getNextPointNumber(), // Auto-increment from 2946
              kValue: "1", // Default to 1
              baseValue: "0" // Default to 0
            },
            { id: 999999, tagName: "Double click to edit", valueType: "", publicAddress: "", pointNumber: "", kValue: "", baseValue: "" }
          ]
        })
        break
    }
    
    // Show success toast
    toast({
      title: "Tag Added",
      description: `Added tag ${tag.name} from ${deviceName} (${portName}) to ${currentSection} section.`,
    })
    
    // Close the dialog
    setTagSelectionDialogOpen(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Advanced Settings Dialog */}
      <IEC104AdvancedSettingsDialog 
        open={advancedSettingsOpen} 
        onOpenChange={setAdvancedSettingsOpen} 
      />
      
      {/* Tag Selection Dialog */}
      <Dialog open={tagSelectionDialogOpen} onOpenChange={setTagSelectionDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Tag</DialogTitle>
            <DialogDescription>
              Choose a tag to add to your IEC 60870-5-104 configuration
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 h-[500px]">
            {/* Left side: Data Center Categories (1/4 width) */}
            <div className="w-1/4 border rounded-md overflow-auto">
              <div className="p-2 font-medium border-b">Data Center</div>
              <ScrollArea className="h-[450px]">
                <ul className="space-y-1 p-2">
                  {/* IO Tag Section */}
                  <li className="rounded hover:bg-muted">
                    <div 
                      className="flex items-center p-2 cursor-pointer"
                      onClick={() => togglePortExpansion('io-tag')}
                    >
                      {expandedPorts.includes('io-tag') ? 
                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                        <ChevronRight className="h-4 w-4 mr-1" />
                      }
                      <Tag className="h-4 w-4 mr-2" />
                      <span className="text-sm">IO Tag</span>
                    </div>
                    
                    {/* Show ports if IO Tag is expanded */}
                    {expandedPorts.includes('io-tag') && (
                      <ul className="ml-6 space-y-1">
                        {ioPorts.map(port => (
                          <li key={port.id} className="rounded hover:bg-muted">
                            <div 
                              className="flex items-center p-2 cursor-pointer"
                              onClick={() => togglePortExpansion(port.id)}
                            >
                              {expandedPorts.includes(port.id) ? 
                                <ChevronDown className="h-4 w-4 mr-1" /> : 
                                <ChevronRight className="h-4 w-4 mr-1" />
                              }
                              <Server className="h-4 w-4 mr-2" />
                              <span className="text-sm">{port.name}</span>
                            </div>
                            
                            {/* Show devices if port is expanded */}
                            {expandedPorts.includes(port.id) && (
                              <ul className="ml-6 space-y-1">
                                {port.devices?.map((device: any) => (
                                  <li key={device.id} className="rounded hover:bg-muted">
                                    <div 
                                      className="flex items-center p-2 cursor-pointer"
                                      onClick={() => toggleDeviceExpansion(device.id)}
                                    >
                                      {expandedDevices.includes(device.id) ? 
                                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                                        <ChevronRight className="h-4 w-4 mr-1" />
                                      }
                                      <Cpu className="h-4 w-4 mr-2" />
                                      <span className="text-sm">{device.name}</span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  
                  {/* Calculation Tag Section */}
                  <li className="rounded hover:bg-muted">
                    <div 
                      className="flex items-center p-2 cursor-pointer"
                      onClick={() => togglePortExpansion('calculation-tag')}
                    >
                      {expandedPorts.includes('calculation-tag') ? 
                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                        <ChevronRight className="h-4 w-4 mr-1" />
                      }
                      <Tag className="h-4 w-4 mr-2" />
                      <span className="text-sm">Calculation Tag</span>
                    </div>
                  </li>
                  
                  {/* User Tag Section */}
                  <li className="rounded hover:bg-muted">
                    <div 
                      className="flex items-center p-2 cursor-pointer"
                      onClick={() => togglePortExpansion('user-tag')}
                    >
                      {expandedPorts.includes('user-tag') ? 
                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                        <ChevronRight className="h-4 w-4 mr-1" />
                      }
                      <Tag className="h-4 w-4 mr-2" />
                      <span className="text-sm">User Tag</span>
                    </div>
                  </li>
                  
                  {/* System Tag Section */}
                  <li className="rounded hover:bg-muted">
                    <div 
                      className="flex items-center p-2 cursor-pointer"
                      onClick={() => togglePortExpansion('system-tag')}
                    >
                      {expandedPorts.includes('system-tag') ? 
                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                        <ChevronRight className="h-4 w-4 mr-1" />
                      }
                      <Tag className="h-4 w-4 mr-2" />
                      <span className="text-sm">System Tag</span>
                    </div>
                  </li>
                </ul>
              </ScrollArea>
            </div>
            
            {/* Right side: Device and Tag details (3/4 width) */}
            <div className="w-3/4 border rounded-md overflow-hidden">
              <div className="p-2 font-medium border-b">Available Tags</div>
              <ScrollArea className="h-[450px]">
                {/* Show IO tags if IO Tag and specific port and device are selected */}
                {expandedPorts.includes('io-tag') && expandedDevices.length > 0 && (
                  <div className="p-4 space-y-4">
                    {ioPorts
                      .filter(port => expandedPorts.includes(port.id))
                      .map(port => (
                        <div key={port.id} className="space-y-4">
                          {port.devices
                            .filter((device: any) => expandedDevices.includes(device.id))
                            .map((device: any) => (
                              <div key={device.id} className="border rounded-md p-4">
                                <div className="flex items-center mb-3">
                                  <Cpu className="h-5 w-5 mr-2" />
                                  <h3 className="text-md font-semibold">{device.name}</h3>
                                </div>
                                
                                <div className="space-y-2">
                                  {device.tags && device.tags.length > 0 ? (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Tag Name</TableHead>
                                          <TableHead>Data Type</TableHead>
                                          <TableHead>Address</TableHead>
                                          <TableHead>Description</TableHead>
                                          <TableHead></TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {device.tags.map((tag: any) => (
                                          <TableRow key={tag.id}>
                                            <TableCell>{tag.name}</TableCell>
                                            <TableCell>{tag.dataType}</TableCell>
                                            <TableCell>{tag.address}</TableCell>
                                            <TableCell>{tag.description}</TableCell>
                                            <TableCell>
                                              <Button 
                                                size="sm" 
                                                onClick={() => selectTagFromTree(tag, device.name, port.name)}
                                              >
                                                Select
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  ) : (
                                    <div className="text-center p-4 text-muted-foreground">
                                      No tags available for this device
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                )}
                
                {/* Show default placeholder */}
                <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground">
                  <Server className="h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p className="text-center">No IO ports or devices are configured. Configure IO ports and devices to view available tags.</p>
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagSelectionDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Tabs defaultValue="iec101">
        <TabsList className="mb-4">
          <TabsTrigger value="iec101">IEC 60870-5-101</TabsTrigger>
          <TabsTrigger value="iec104">IEC 60870-5-104</TabsTrigger>
          <TabsTrigger value="iec61850">IEC 61850</TabsTrigger>
        </TabsList>

        <TabsContent value="iec101">
          <Card>
            <CardHeader>
              <CardTitle>IEC 60870-5-101</CardTitle>
              <CardDescription>Configure IEC 60870-5-101 settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="iec101-enabled">Enable IEC 60870-5-101</Label>
                <Switch id="iec101-enabled" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iec101-mode">Mode</Label>
                <Select defaultValue="master">
                  <SelectTrigger id="iec101-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="slave">Slave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="iec101-port">Serial Port</Label>
                  <Select defaultValue="ttyS0">
                    <SelectTrigger id="iec101-port">
                      <SelectValue placeholder="Select port" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ttyS0">ttyS0</SelectItem>
                      <SelectItem value="ttyS1">ttyS1</SelectItem>
                      <SelectItem value="ttyUSB0">ttyUSB0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iec101-baud">Baud Rate</Label>
                  <Select defaultValue="9600">
                    <SelectTrigger id="iec101-baud">
                      <SelectValue placeholder="Select baud rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9600">9600</SelectItem>
                      <SelectItem value="19200">19200</SelectItem>
                      <SelectItem value="38400">38400</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="iec104">
          <div className="space-y-4">
            {/* Top Bar with Global Actions */}
            <div className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
              <div className="flex gap-2">
                <Button type="submit" variant="outline" className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  Apply
                </Button>
                <Button type="button" variant="outline" className="flex items-center gap-1" onClick={handleDiscard}>
                  <X className="h-4 w-4 text-red-500" />
                  Discard
                </Button>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex items-center gap-1" onClick={handleExport}>
                  <FileSpreadsheet className="h-4 w-4" />
                  Export To Microsoft Excel
                </Button>
                <Button type="button" variant="outline" className="flex items-center gap-1" onClick={handleImport}>
                  <FileSpreadsheet className="h-4 w-4" />
                  Import From Microsoft Excel
                </Button>
              </div>
            </div>
            
            {/* Channel Status/Selection */}
            <div className="p-4 bg-white border rounded-md">
              <div className="mb-2 font-medium">Channel Status:</div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((channel) => (
                  <Button 
                    key={channel}
                    type="button" 
                    variant={activeChannel === channel ? "default" : "outline"}
                    onClick={() => setActiveChannel(channel)}
                    className="w-10 h-10"
                  >
                    {channel}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Channel-Specific Settings */}
            <div className="p-4 bg-white border rounded-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="enable-channel" defaultChecked />
                  <Label htmlFor="enable-channel">Enable Channel</Label>
                </div>
                
                <div className="flex-1">
                  <Select defaultValue="channel1">
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="channel1">Channel 1</SelectItem>
                      <SelectItem value="channel2">Channel 2</SelectItem>
                      <SelectItem value="channel3">Channel 3</SelectItem>
                      <SelectItem value="channel4">Channel 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={handleAdvancedSettings}
                >
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Advance Setting
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="port">Port:</Label>
                  <Input id="port" defaultValue="2404" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asdu-address">ASDU Address:</Label>
                  <Input id="asdu-address" defaultValue="1" />
                </div>
              </div>
            </div>
            
            {/* I/O Point Type Tabs */}
            <div className="p-4 bg-white border rounded-md">
              <Tabs value={activeIOTab} onValueChange={setActiveIOTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="DI">DI</TabsTrigger>
                  <TabsTrigger value="AI">AI</TabsTrigger>
                  <TabsTrigger value="Counter">Counter</TabsTrigger>
                  <TabsTrigger value="DO">DO</TabsTrigger>
                  <TabsTrigger value="AO">AO</TabsTrigger>
                </TabsList>
                
                <TabsContent value="DI">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>TagName</TableHead>
                        <TableHead>ValueType</TableHead>
                        <TableHead>Public Address</TableHead>
                        <TableHead>Point Number</TableHead>
                        <TableHead>SOE</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {diPoints.map((point) => (
                        <TableRow key={point.id}>
                          <TableCell className="font-medium">*</TableCell>
                          <TableCell className="cursor-pointer" onDoubleClick={() => handleTagSelection("DI")}>{point.tagName}</TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.valueType
                            ) : (
                              <Select defaultValue={point.valueType || "M_SP_NA_1"}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="M_SP_NA_1">single-point-information(M_SP_NA_1)</SelectItem>
                                  <SelectItem value="M_DP_NA_1">double-point-information(M_DP_NA_1)</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.publicAddress
                            ) : (
                              <Input defaultValue={point.publicAddress || "2"} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.pointNumber
                            ) : (
                              <Input defaultValue={point.pointNumber} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.soe
                            ) : (
                              <Select defaultValue={point.soe || "No SOE"}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select SOE" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="No SOE">No SOE</SelectItem>
                                  <SelectItem value="SOE">SOE</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="AI">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>TagName</TableHead>
                        <TableHead>ValueType</TableHead>
                        <TableHead>Public Address</TableHead>
                        <TableHead>Point Number</TableHead>
                        <TableHead>KValue</TableHead>
                        <TableHead>BaseValue</TableHead>
                        <TableHead>Change(%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aiPoints.map((point) => (
                        <TableRow key={point.id}>
                          <TableCell className="font-medium">*</TableCell>
                          <TableCell className="cursor-pointer" onDoubleClick={() => handleTagSelection("AI")}>{point.tagName}</TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.valueType
                            ) : (
                              <Select defaultValue={point.valueType || "M_ME_NA_1"}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="M_ME_NA_1">Measured value, normalized value(M_ME_NA_1)</SelectItem>
                                  <SelectItem value="M_ME_NB_1">Measured value, scaled value(M_ME_NB_1)</SelectItem>
                                  <SelectItem value="M_ME_NC_1">Measured value, short floating point value(M_ME_NC_1)</SelectItem>
                                  <SelectItem value="M_ME_ND_1">Measured value, normalized value without quality descriptor(M_ME_ND_1)</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.publicAddress
                            ) : (
                              <Input defaultValue={point.publicAddress || "2"} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.pointNumber
                            ) : (
                              <Input defaultValue={point.pointNumber} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.kValue
                            ) : (
                              <Input defaultValue={point.kValue || "1"} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.baseValue
                            ) : (
                              <Input defaultValue={point.baseValue || "1"} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.changePercent
                            ) : (
                              <Input defaultValue={point.changePercent || "10"} className="w-full h-8" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="Counter">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>TagName</TableHead>
                        <TableHead>ValueType</TableHead>
                        <TableHead>Public Address</TableHead>
                        <TableHead>Point Number</TableHead>
                        <TableHead>KValue</TableHead>
                        <TableHead>BaseValue</TableHead>
                        <TableHead>Change(%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {counterPoints.map((point) => (
                        <TableRow key={point.id}>
                          <TableCell className="font-medium">*</TableCell>
                          <TableCell className="cursor-pointer" onDoubleClick={() => handleTagSelection("Counter")}>{point.tagName}</TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.valueType
                            ) : (
                              <Select defaultValue={point.valueType || "M_IT_NA_1"}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="M_IT_NA_1">Integrated totals(M_IT_NA_1)</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.publicAddress
                            ) : (
                              <Input defaultValue={point.publicAddress || "2"} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.pointNumber
                            ) : (
                              <Input defaultValue={point.pointNumber} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.kValue
                            ) : (
                              <Input defaultValue={point.kValue || "1"} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.baseValue
                            ) : (
                              <Input defaultValue={point.baseValue || "0"} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.changePercent
                            ) : (
                              <Input defaultValue={point.changePercent || "10"} className="w-full h-8" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="DO">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>TagName</TableHead>
                        <TableHead>ValueType</TableHead>
                        <TableHead>Public Address</TableHead>
                        <TableHead>Point Number</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doPoints.map((point) => (
                        <TableRow key={point.id}>
                          <TableCell className="font-medium">*</TableCell>
                          <TableCell className="cursor-pointer" onDoubleClick={() => handleTagSelection("DO")}>{point.tagName}</TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.valueType
                            ) : (
                              <Select defaultValue={point.valueType || "C_SC_NA_1"}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="C_SC_NA_1">Single command(C_SC_NA_1)</SelectItem>
                                  <SelectItem value="C_DC_NA_1">Double command(C_DC_NA_1)</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.publicAddress
                            ) : (
                              <Input defaultValue={point.publicAddress || "2"} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.pointNumber
                            ) : (
                              <Input defaultValue={point.pointNumber} className="w-full h-8" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="AO">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>TagName</TableHead>
                        <TableHead>ValueType</TableHead>
                        <TableHead>Public Address</TableHead>
                        <TableHead>Point Number</TableHead>
                        <TableHead>KValue</TableHead>
                        <TableHead>BaseValue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aoPoints.map((point) => (
                        <TableRow key={point.id}>
                          <TableCell className="font-medium">*</TableCell>
                          <TableCell className="cursor-pointer" onDoubleClick={() => handleTagSelection("AO")}>{point.tagName}</TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.valueType
                            ) : (
                              <Select defaultValue={point.valueType || "C_SE_NA_1"}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="C_RC_NA_1">regulating step command(C_RC_NA_1)</SelectItem>
                                  <SelectItem value="C_SE_NA_1">set point command, normalized value point number(C_SE_NA_1)</SelectItem>
                                  <SelectItem value="C_SE_NB_1">set point command, scaled value point number(C_SE_NB_1)</SelectItem>
                                  <SelectItem value="C_SE_NC_1">set point command, short floating point number(C_SE_NC_1)</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.publicAddress
                            ) : (
                              <Input defaultValue={point.publicAddress || "2"} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.pointNumber
                            ) : (
                              <Input defaultValue={point.pointNumber} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.kValue
                            ) : (
                              <Input defaultValue={point.kValue || "1"} className="w-full h-8" />
                            )}
                          </TableCell>
                          <TableCell>
                            {point.tagName === "Double click to edit" ? (
                              point.baseValue
                            ) : (
                              <Input defaultValue={point.baseValue || "0"} className="w-full h-8" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="iec61850">
          <Card>
            <CardHeader>
              <CardTitle>IEC 61850</CardTitle>
              <CardDescription>Configure IEC 61850 settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="iec61850-enabled">Enable IEC 61850</Label>
                <Switch id="iec61850-enabled" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iec61850-mode">Mode</Label>
                <Select defaultValue="server">
                  <SelectTrigger id="iec61850-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="iec61850-port">MMS Port</Label>
                <Input id="iec61850-port" placeholder="102" />
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

