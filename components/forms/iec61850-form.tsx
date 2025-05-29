"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, X, Plus, Trash, Download, Upload, ChevronDown, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"

export function IEC61850Form() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("scl-view")
  const [devices, setDevices] = useState<any[]>([
    { id: "device1", name: "LDevice1", inst: "LDevice1", logical: "LDevice1", path: "LDevice1", icdType: "", opc: "" }
  ])
  const [selectedDevice, setSelectedDevice] = useState<string | null>("device1")
  const [tags, setTags] = useState<any[]>([])
  
  // Toggle state variables
  const [serviceEnabled, setServiceEnabled] = useState(false)
  const [securityEnabled, setSecurityEnabled] = useState(false)
  const [gooseEnabled, setGooseEnabled] = useState(false)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings applied",
      description: "IEC 61850 settings have been saved successfully.",
    })
  }

  // Handle discard changes
  const handleDiscard = () => {
    toast({
      title: "Changes discarded",
      description: "Your changes have been discarded.",
    })
  }

  // Handle export to ICD file
  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Exporting configuration to ICD file.",
    })
  }

  // Handle import from ICD file
  const handleImport = () => {
    toast({
      title: "Import initiated",
      description: "Importing configuration from ICD file.",
    })
  }

  // Add a new device
  const handleAddDevice = () => {
    const newDeviceNumber = devices.length + 1
    const defaultName = `LDevice${newDeviceNumber}`
    const newDevice = {
      id: `device${newDeviceNumber}`,
      name: defaultName,
      inst: defaultName,
      logical: defaultName,
      path: defaultName,
      icdType: "",
      opc: ""
    }
    setDevices([...devices, newDevice])
    setSelectedDevice(`device${newDeviceNumber}`)
  }

  // Delete a device
  const handleDeleteDevice = (deviceId: string) => {
    setDevices(devices.filter(device => device.id !== deviceId))
    if (selectedDevice === deviceId) {
      setSelectedDevice(null)
    }
  }

  // Add a new tag
  const handleAddTag = () => {
    const newTag = {
      id: `tag${tags.length + 1}`,
      name: "",
      logicalNode: "",
      path: "",
      icdType: "",
      opc: "",
      val: ""
    }
    setTags([...tags, newTag])
  }

  // Delete a tag
  const handleDeleteTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Top Action Bar */}
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
            <Download className="h-4 w-4" />
            Export to ICD file
          </Button>
          <Button type="button" variant="outline" className="flex items-center gap-1" onClick={handleImport}>
            <Upload className="h-4 w-4" />
            Import from ICD file
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Label htmlFor="enable-61850-service" className="flex-grow font-medium">Enable 61850 Service</Label>
              <Switch 
                id="enable-61850-service" 
                checked={serviceEnabled}
                onCheckedChange={setServiceEnabled}
              />
            </div>

            {serviceEnabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="port">Port:</Label>
                    <Input id="port" defaultValue="102" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ied-name">IED Name:</Label>
                    <Input id="ied-name" defaultValue="IED1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-connections">Max Connections:</Label>
                    <Input id="max-connections" defaultValue="10" />
                  </div>
                </div>
                
                {/* Security and GOOSE toggles side by side */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="enable-security" className="flex-grow">Enable Security</Label>
                    <Switch 
                      id="enable-security" 
                      checked={securityEnabled}
                      onCheckedChange={setSecurityEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="enable-goose" className="flex-grow">Enable GOOSE</Label>
                    <Switch 
                      id="enable-goose" 
                      checked={gooseEnabled}
                      onCheckedChange={setGooseEnabled}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password:</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      disabled={!securityEnabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goose-lan">GOOSE LAN:</Label>
                    <Input 
                      id="goose-lan" 
                      defaultValue="LAN1" 
                      disabled={!gooseEnabled}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Device List - Only visible when service is enabled */}
      {serviceEnabled && (
        <div className="space-y-2">
          <div className="flex items-center border-b">
            {devices.map((device) => (
              <div 
                key={device.id} 
                className={`flex items-center px-3 py-2 cursor-pointer border-r ${selectedDevice === device.id ? 'bg-gray-100' : ''}`}
              >
                <span 
                  className="mr-2"
                  onClick={() => setSelectedDevice(device.id)}
                >
                  {device.name || `LDevice${device.id.replace('device', '')}`}
                </span>
                <X 
                  className="h-4 w-4 text-gray-500 hover:text-red-500" 
                  onClick={() => handleDeleteDevice(device.id)}
                />
              </div>
            ))}
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="p-2 h-auto"
              onClick={handleAddDevice}
            >
              <Plus className="h-5 w-5 text-green-500" />
            </Button>
          </div>

          <div className="flex-1">
            <Input 
              placeholder="LDevice Name" 
              value={devices.find(d => d.id === selectedDevice)?.name || ""}
              onChange={(e) => {
                if (selectedDevice) {
                  setDevices(devices.map(d => 
                    d.id === selectedDevice ? { ...d, name: e.target.value, inst: e.target.value } : d
                  ))
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Data Center Section - Only visible when service is enabled */}

      
      {/* Tabs - Only visible when service is enabled */}
      {serviceEnabled && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="scl-view">SCL View</TabsTrigger>
            <TabsTrigger value="tag-list">Tag List</TabsTrigger>
            <TabsTrigger value="data-set">Data Set</TabsTrigger>
            <TabsTrigger value="report-control">Report Control</TabsTrigger>
            <TabsTrigger value="goose-list">GOOSE List</TabsTrigger>
          </TabsList>

        {/* SCL View Tab */}
        <TabsContent value="scl-view">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4 text-green-500" />
                Add LN
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4 text-green-500" />
                Add DOI
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Trash className="h-4 w-4 text-red-500" />
                Delete LN
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Trash className="h-4 w-4 text-red-500" />
                Delete DOI
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Val</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Logical Node</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>CDC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDevice ? (
                  <TableRow>
                    <TableCell>{devices.find(d => d.id === selectedDevice)?.name || ""}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{devices.find(d => d.id === selectedDevice)?.logical || ""}</TableCell>
                    <TableCell>{devices.find(d => d.id === selectedDevice)?.path || ""}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Select a device to view details
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tag List Tab */}
        <TabsContent value="tag-list">
          <div className="space-y-4">
            <div className="flex gap-2">
            <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleAddTag}
              >
                <Plus className="h-4 w-4 text-green-500" />
                Export
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4 text-green-500" />
                Import
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Val</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Logical Node</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>CDC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.length > 0 ? (
                  tags.map(tag => (
                    <TableRow key={tag.id}>
                      <TableCell>{tag.name}</TableCell>
                      <TableCell>{tag.dataSet}</TableCell>
                      <TableCell>{tag.buffer}</TableCell>
                      <TableCell>{tag.bufferTime}</TableCell>
                      <TableCell>{tag.desc}</TableCell>
                      <TableCell>{tag.reportEnabled}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Data Set Tab */}
        <TabsContent value="data-set">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4 text-green-500" />
                Add
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4 text-red-500" />
                Delete
              </Button>
            </div>
            
            <div className="border p-2 text-center font-medium bg-gray-50">
              FCDA List
            </div>
          </div>
        </TabsContent>

        {/* Report Control Tab */}
        <TabsContent value="report-control">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4 text-green-500" />
                Add
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4 text-red-500" />
                Delete
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>DataSet</TableHead>
                  <TableHead>Buffer</TableHead>
                  <TableHead>BufferTime</TableHead>
                  <TableHead>Desc</TableHead>
                  <TableHead>Report Enabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No data available
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* GOOSE List Tab */}
        <TabsContent value="goose-list">
          <div className="space-y-4">
            {gooseEnabled ? (
              <>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4 text-green-500" />
                    Add
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4 text-red-500" />
                    Delete
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Goose ID</TableHead>
                      <TableHead>Data Set</TableHead>
                      <TableHead>Config Revision</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No data available
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500 border rounded-md">
                Enable GOOSE in the General Settings to configure GOOSE List
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      )}
    </form>
  )
}
