"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, FileSpreadsheet, MoreHorizontal, ChevronDown, ChevronRight, Server, Cpu, Tag, UserCircle, FileDigit, BarChart, Cog } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define the IO Tag interface
interface IOTag {
  id: string;
  name: string;
  dataType: string;
  address: string;
  description: string;
}

// Define the IO Port interface
interface Port {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  devices: Device[];
  description?: string;
  scanTime?: number;
  timeOut?: number;
  retryCount?: number;
  autoRecoverTime?: number;
  scanMode?: string;
  serialSettings?: any;
}

// Define the Device interface for IO Ports
interface Device {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  unitNumber?: number;
  description?: string;
  tagWriteType?: string;
  addDeviceNameAsPrefix?: boolean;
  extensionProperties?: any;
  tags?: IOTag[];
}

export function DNP3Form() {
  const { toast } = useToast()
  const [sessionEnabled, setSessionEnabled] = useState({
    session1: true,
    session2: false,
    session3: false,
    session4: false
  })
  const [activeSession, setActiveSession] = useState("session1")
  
  // State for tag selection dialog
  const [tagSelectionDialogOpen, setTagSelectionDialogOpen] = useState(false)
  const [selectedPointIdForTag, setSelectedPointIdForTag] = useState<number | null>(null)
  
  // IO tags tree structure
  const [ioPorts, setIoPorts] = useState<Port[]>([])
  const [expandedPorts, setExpandedPorts] = useState<string[]>([])
  const [expandedDevices, setExpandedDevices] = useState<string[]>([])
  
  // Session configuration data
  const [sessionConfig, setSessionConfig] = useState({
    session1: {
      slaveAddress: "4",
      masterAddress: "3",
      binaryInput: "8",
      binaryOutput: "4",
      analogInput: "8",
      analogOutput: "0",
      counter: "0",
      doubleBit: "0"
    },
    session2: {
      slaveAddress: "5",
      masterAddress: "4",
      binaryInput: "0",
      binaryOutput: "0",
      analogInput: "0",
      analogOutput: "0",
      counter: "0",
      doubleBit: "0"
    },
    session3: {
      slaveAddress: "6",
      masterAddress: "5",
      binaryInput: "0",
      binaryOutput: "0",
      analogInput: "0",
      analogOutput: "0",
      counter: "0",
      doubleBit: "0"
    },
    session4: {
      slaveAddress: "7",
      masterAddress: "6",
      binaryInput: "0",
      binaryOutput: "0",
      analogInput: "0",
      analogOutput: "0",
      counter: "0",
      doubleBit: "0"
    }
  })
  
  // Define deadband type options
  const deadbandTypes = [
    { value: "disable", label: "Disable" },
    { value: "value", label: "Value" },
    { value: "value-over-tag", label: "Value over tag value" },
    { value: "percent", label: "Percent" },
    { value: "percent-over-tag", label: "Percent over tag value" }
  ]

  // DNP3 points data for the table
  const [dnp3Points, setDnp3Points] = useState([
    { id: 1, point: "AI.000", assignClass: "Class 2", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 2, point: "AI.001", assignClass: "Class 2", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 3, point: "AI.002", assignClass: "Class 2", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 4, point: "AI.003", assignClass: "Class 2", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 5, point: "AI.004", assignClass: "Class 2", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 6, point: "AI.005", assignClass: "Class 2", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 7, point: "AI.006", assignClass: "Class 2", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 8, point: "AI.007", assignClass: "Class 2", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 9, point: "BI.000", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 10, point: "BI.001", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 11, point: "BI.002", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 12, point: "BI.003", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 13, point: "BI.004", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 14, point: "BI.005", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 15, point: "BI.006", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 16, point: "BI.007", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 17, point: "BO.000", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 18, point: "BO.001", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 19, point: "BO.002", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" },
    { id: 20, point: "BO.003", assignClass: "Class 1", tagName: "Double click to edit", eventHighLimit: "0", eventLowLimit: "0", eventDeadband: "disable", deadbandValue: "0", deadbandPercent: "0", selectedTag: "" }
  ])
  
  // State for deadband dialog
  const [deadbandDialogOpen, setDeadbandDialogOpen] = useState(false)
  const [selectedPointId, setSelectedPointId] = useState<number | null>(null)
  const [deadbandType, setDeadbandType] = useState("disable")
  const [deadbandValue, setDeadbandValue] = useState("0")
  const [deadbandPercent, setDeadbandPercent] = useState("0")
  const [valueOverTag, setValueOverTag] = useState("")
  const [percentOverTag, setPercentOverTag] = useState("")
  
  // State for deadband tag selection dialog
  const [deadbandTagDialogOpen, setDeadbandTagDialogOpen] = useState(false)
  const [deadbandTagType, setDeadbandTagType] = useState<"value-over-tag" | "percent-over-tag" | null>(null)
  
  // Handle class assignment change
  const handleClassChange = (id: number, value: string) => {
    setDnp3Points(points => 
      points.map(point => 
        point.id === id ? { ...point, assignClass: value } : point
      )
    )
  }
  
  // Handle event limit changes
  const handleEventLimitChange = (id: number, field: 'eventHighLimit' | 'eventLowLimit', value: string) => {
    setDnp3Points(points => 
      points.map(point => 
        point.id === id ? { ...point, [field]: value } : point
      )
    )
  }

  // Open deadband dialog
  const openDeadbandDialog = (id: number) => {
    const point = dnp3Points.find(p => p.id === id)
    if (point) {
      setSelectedPointId(id)
      
      // Parse the deadband type and tag value
      let deadbandTypeValue = point.eventDeadband || "disable";
      
      // Check if the deadband type is formatted as "value:tag" or "percent:tag"
      if (deadbandTypeValue.startsWith('value:')) {
        // Set deadband type to value-over-tag
        setDeadbandType('value-over-tag');
        // Extract the tag value (everything after "value:")
        setValueOverTag(deadbandTypeValue.substring(6));
      } else if (deadbandTypeValue.startsWith('percent:')) {
        // Set deadband type to percent-over-tag
        setDeadbandType('percent-over-tag');
        // Extract the tag value (everything after "percent:")
        setPercentOverTag(deadbandTypeValue.substring(8));
      } else {
        // Use the deadband type as is
        setDeadbandType(deadbandTypeValue);
        
        // Set the appropriate tag based on the deadband type
        if (deadbandTypeValue === 'value-over-tag') {
          setValueOverTag(point.selectedTag || "");
        } else if (deadbandTypeValue === 'percent-over-tag') {
          setPercentOverTag(point.selectedTag || "");
        }
      }
      
      setDeadbandValue(point.deadbandValue || "0")
      setDeadbandPercent(point.deadbandPercent || "0")
      setDeadbandDialogOpen(true)
    }
  }

  // Render deadband cell
  const renderDeadbandCell = (point: any) => {
    let displayValue = "Disabled";
    const deadbandType = point.eventDeadband || "disable";
    
    if (deadbandType === "value") {
      displayValue = `Value: ${point.deadbandValue}`;
    } else if (deadbandType === "percent") {
      displayValue = `Percent: ${point.deadbandPercent}%`;
    } else if (deadbandType === "value-over-tag") {
      displayValue = `Value over tag: ${point.selectedTag || "None"}`;
    } else if (deadbandType === "percent-over-tag") {
      displayValue = `Percent over tag: ${point.selectedTag || "None"}`;
    } else if (deadbandType.startsWith("value:")) {
      // Display the formatted value:tag format
      displayValue = `Value over tag: ${deadbandType.substring(6)}`;
    } else if (deadbandType.startsWith("percent:")) {
      // Display the formatted percent:tag format
      displayValue = `Percent over tag: ${deadbandType.substring(8)}`;
    }
    
    return (
      <div 
        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
        onDoubleClick={() => openDeadbandDialog(point.id)}
      >
        {displayValue}
      </div>
    );
  }

  // Open deadband tag selection dialog
  const openDeadbandTagDialog = (type: "value-over-tag" | "percent-over-tag") => {
    setDeadbandTagType(type)
    setDeadbandTagDialogOpen(true)
  }
  
  // Select a tag for deadband
  const selectDeadbandTag = (tag: IOTag, deviceName: string, portName: string) => {
    // Format the tag name as <device_name>:<io_tag_name>
    const formattedTagName = `${deviceName}:${tag.name}`
    
    // Set the appropriate tag state based on the deadband type
    if (deadbandTagType === 'value-over-tag') {
      setValueOverTag(formattedTagName)
    } else if (deadbandTagType === 'percent-over-tag') {
      setPercentOverTag(formattedTagName)
    }
    
    // Close the tag selection dialog
    setDeadbandTagDialogOpen(false)
    
    // Show success toast
    toast({
      title: "Tag selected",
      description: `Tag ${formattedTagName} has been assigned to the deadband reference.`,
    })
  }
  
  // Save deadband settings
  const saveDeadbandSettings = () => {
    if (selectedPointId) {
      setDnp3Points(points => 
        points.map(point => {
          // Format the eventDeadband value based on the type
          let formattedDeadbandType = deadbandType;
          if (deadbandType === 'value-over-tag' && valueOverTag) {
            formattedDeadbandType = `value:${valueOverTag}`;
          } else if (deadbandType === 'percent-over-tag' && percentOverTag) {
            formattedDeadbandType = `percent:${percentOverTag}`;
          }
          
          return point.id === selectedPointId ? { 
            ...point, 
            eventDeadband: formattedDeadbandType,
            deadbandValue: deadbandValue,
            deadbandPercent: deadbandPercent,
            selectedTag: deadbandType === 'value-over-tag' ? valueOverTag : 
                        deadbandType === 'percent-over-tag' ? percentOverTag : ""
          } : point;
        })
      )
      setDeadbandDialogOpen(false)
    }
  }

  // Get description based on deadband type
  const getDeadbandDescription = (type: string) => {
    switch (type) {
      case 'disable':
        return "Disable trigger events."
      case 'value':
        return "The deadband value is a specific value. When the change of the corresponding tag value exceeds this value, the event will be triggered."
      case 'value-over-tag':
        return "Additional configuration tag are required for this deadband. When the AI value changes beyond this tag's value, the event will be triggered."
      case 'percent':
      case 'percent-over-tag':
        return "The deadband value is a percentage, and the value is expressed as a decimal. When the change of the tag value exceeds the product of the original value and the deadband value, the event will be triggered."
      default:
        return ""
    }
  }

  // Load IO ports data from localStorage
  useEffect(() => {
    const fetchIoPorts = async () => {
      try {
        const storedPorts = localStorage.getItem('io_ports_data')
        if (storedPorts) {
          setIoPorts(JSON.parse(storedPorts))
        } else {
          // Sample data if no data exists in localStorage
          const samplePorts: Port[] = [
            {
              id: "port1",
              name: "Modbus TCP Port",
              type: "Modbus TCP",
              enabled: true,
              devices: [
                {
                  id: "device1",
                  name: "Energy Meter",
                  type: "Modbus Device",
                  enabled: true,
                  unitNumber: 1,
                  tags: [
                    { id: "tag1", name: "Voltage", dataType: "Float", address: "40001", description: "Voltage reading" },
                    { id: "tag2", name: "Current", dataType: "Float", address: "40003", description: "Current reading" },
                    { id: "tag3", name: "Power", dataType: "Float", address: "40005", description: "Power reading" }
                  ]
                },
                {
                  id: "device2",
                  name: "Temperature Controller",
                  type: "Modbus Device",
                  enabled: true,
                  unitNumber: 2,
                  tags: [
                    { id: "tag4", name: "Temperature", dataType: "Float", address: "40001", description: "Temperature reading" },
                    { id: "tag5", name: "Setpoint", dataType: "Float", address: "40003", description: "Temperature setpoint" }
                  ]
                }
              ]
            },
            {
              id: "port2",
              name: "Modbus RTU Port",
              type: "Modbus RTU",
              enabled: true,
              devices: [
                {
                  id: "device3",
                  name: "Flow Meter",
                  type: "Modbus Device",
                  enabled: true,
                  unitNumber: 1,
                  tags: [
                    { id: "tag6", name: "Flow Rate", dataType: "Float", address: "40001", description: "Flow rate reading" },
                    { id: "tag7", name: "Total Flow", dataType: "Float", address: "40003", description: "Total flow reading" }
                  ]
                }
              ]
            }
          ];
          
          setIoPorts(samplePorts);
          localStorage.setItem('io_ports_data', JSON.stringify(samplePorts));
        }
      } catch (error) {
        console.error('Error fetching IO ports data:', error)
      }
    }
    
    fetchIoPorts()
  }, [])
  
  // Toggle expansion of a port in the tree
  const togglePortExpansion = (portId: string) => {
    setExpandedPorts(prev => {
      if (prev.includes(portId)) {
        return prev.filter(id => id !== portId);
      } else {
        return [...prev, portId];
      }
    });
  }
  
  // Toggle expansion of a device in the tree
  const toggleDeviceExpansion = (deviceId: string) => {
    setExpandedDevices(prev => {
      if (prev.includes(deviceId)) {
        return prev.filter(id => id !== deviceId);
      } else {
        return [...prev, deviceId];
      }
    });
  }
  
  // Open tag selection dialog
  const openTagSelectionDialog = (pointId: number) => {
    setSelectedPointIdForTag(pointId)
    setTagSelectionDialogOpen(true)
  }
  
  // Select a tag from the tree and add it to the current DNP3 point
  const selectTagFromTree = (tag: IOTag, deviceName: string, portName: string) => {
    if (selectedPointIdForTag !== null) {
      // Update the DNP3 point with the selected tag using the format <device_name>:<io_tag_name>
      setDnp3Points(points => 
        points.map(point => 
          point.id === selectedPointIdForTag ? { 
            ...point, 
            tagName: `${deviceName}:${tag.name}`,
            selectedTag: tag.id
          } : point
        )
      )
      
      // Close the tag selection dialog
      setTagSelectionDialogOpen(false)
      setSelectedPointIdForTag(null)
      
      // Show success toast
      toast({
        title: "Tag assigned",
        description: `Tag ${deviceName}:${tag.name} has been assigned to the DNP3 point.`,
      })
    }
  }

  const handleApply = () => {
    toast({
      title: "Settings applied",
      description: "DNP3 settings have been applied.",
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
      description: "Exporting configuration to Microsoft Excel.",
    })
  }

  const handleImport = () => {
    toast({
      title: "Import initiated",
      description: "Importing configuration from Microsoft Excel.",
    })
  }

  const handleClearSession = () => {
    toast({
      title: "Session cleared",
      description: "The session has been cleared.",
    })
  }

  const handleDuplicateSession = () => {
    // Copy all field values from session1 to the current session
    setSessionConfig(prev => ({
      ...prev,
      [activeSession]: {
        ...prev.session1
      }
    }))
    
    toast({
      title: "Session duplicated",
      description: `Values from Session 1 have been copied to ${activeSession.replace('session', 'Session ')}`,
    })
  }

  const handleMoreParameters = () => {
    toast({
      title: "More parameters",
      description: "Opening additional parameters dialog.",
    })
  }

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleApply}
          >
            <Check className="h-4 w-4 text-green-500" />
            Apply
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleDiscard}
          >
            <X className="h-4 w-4 text-red-500" />
            Discard
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleExport}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export To Microsoft Excel
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleImport}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Import From Microsoft Excel
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Channel Settings */}
            <div>
              <h3 className="text-sm font-medium mb-2">Channel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="port-number">Port Number:</Label>
                  <Input id="port-number" defaultValue="20000" />
                </div>
              </div>
            </div>

            {/* No Session Status field as requested */}

            {/* Sessions */}
            <div>
              <h3 className="text-sm font-medium mb-2">Sessions</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <Label htmlFor="session-list">Session List:</Label>
                    </div>
                    <div className="flex-1">
                      <Select 
                        value={activeSession}
                        onValueChange={(value) => setActiveSession(value)}
                      >
                        <SelectTrigger id="session-list">
                          <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="session1">Session 1</SelectItem>
                          <SelectItem value="session2">Session 2</SelectItem>
                          <SelectItem value="session3">Session 3</SelectItem>
                          <SelectItem value="session4">Session 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="enable">Enable</Label>
                      <Switch 
                        id="enable" 
                        checked={sessionEnabled[activeSession as keyof typeof sessionEnabled]}
                        onCheckedChange={(checked) => {
                          setSessionEnabled({
                            ...sessionEnabled,
                            [activeSession]: checked
                          })
                        }}
                      />
                    </div>
                  </div>
                  
                  {sessionEnabled[activeSession as keyof typeof sessionEnabled] && (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="l2-slave-address">L2 Slave Address:</Label>
                          <Input 
                            id="l2-slave-address" 
                            className="w-16" 
                            value={sessionConfig[activeSession as keyof typeof sessionConfig].slaveAddress} 
                            onChange={(e) => {
                              setSessionConfig(prev => ({
                                ...prev,
                                [activeSession]: {
                                  ...prev[activeSession as keyof typeof prev],
                                  slaveAddress: e.target.value
                                }
                              }))
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="l2-master-address">L2 Master Address:</Label>
                          <Input 
                            id="l2-master-address" 
                            className="w-16" 
                            value={sessionConfig[activeSession as keyof typeof sessionConfig].masterAddress}
                            onChange={(e) => {
                              setSessionConfig(prev => ({
                                ...prev,
                                [activeSession]: {
                                  ...prev[activeSession as keyof typeof prev],
                                  masterAddress: e.target.value
                                }
                              }))
                            }}
                          />
                        </div>
                        {activeSession !== "session1" && (
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={handleDuplicateSession}
                          >
                            Duplicate From Session1
                          </Button>
                        )}
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleClearSession}
                        >
                          Clear Session
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleMoreParameters}
                        >
                          More Parameters...
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {sessionEnabled[activeSession as keyof typeof sessionEnabled] && (
                  <>
                    {/* Input/Output Types */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="binary-input" defaultChecked />
                          <Label htmlFor="binary-input">Binary Input Number(BI):</Label>
                          <Input 
                            value={sessionConfig[activeSession as keyof typeof sessionConfig].binaryInput} 
                            onChange={(e) => {
                              setSessionConfig(prev => ({
                                ...prev,
                                [activeSession]: {
                                  ...prev[activeSession as keyof typeof prev],
                                  binaryInput: e.target.value
                                }
                              }))
                            }}
                            className="w-20" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="binary-output" defaultChecked />
                          <Label htmlFor="binary-output">Binary Output Number(BO):</Label>
                          <Input 
                            value={sessionConfig[activeSession as keyof typeof sessionConfig].binaryOutput} 
                            onChange={(e) => {
                              setSessionConfig(prev => ({
                                ...prev,
                                [activeSession]: {
                                  ...prev[activeSession as keyof typeof prev],
                                  binaryOutput: e.target.value
                                }
                              }))
                            }}
                            className="w-20" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="analog-input" defaultChecked />
                          <Label htmlFor="analog-input">Analog Input Number(AI):</Label>
                          <Input 
                            value={sessionConfig[activeSession as keyof typeof sessionConfig].analogInput} 
                            onChange={(e) => {
                              setSessionConfig(prev => ({
                                ...prev,
                                [activeSession]: {
                                  ...prev[activeSession as keyof typeof prev],
                                  analogInput: e.target.value
                                }
                              }))
                            }}
                            className="w-20" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="analog-output" defaultChecked />
                          <Label htmlFor="analog-output">Analog Output Number(AO):</Label>
                          <Input 
                            value={sessionConfig[activeSession as keyof typeof sessionConfig].analogOutput} 
                            onChange={(e) => {
                              setSessionConfig(prev => ({
                                ...prev,
                                [activeSession]: {
                                  ...prev[activeSession as keyof typeof prev],
                                  analogOutput: e.target.value
                                }
                              }))
                            }}
                            className="w-20" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="counter" defaultChecked />
                          <Label htmlFor="counter">Counter Number(CTR):</Label>
                          <Input 
                            value={sessionConfig[activeSession as keyof typeof sessionConfig].counter} 
                            onChange={(e) => {
                              setSessionConfig(prev => ({
                                ...prev,
                                [activeSession]: {
                                  ...prev[activeSession as keyof typeof prev],
                                  counter: e.target.value
                                }
                              }))
                            }}
                            className="w-20" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="double-bit" defaultChecked />
                          <Label htmlFor="double-bit">Doublebit Input Number(DBI):</Label>
                          <Input 
                            value={sessionConfig[activeSession as keyof typeof sessionConfig].doubleBit} 
                            onChange={(e) => {
                              setSessionConfig(prev => ({
                                ...prev,
                                [activeSession]: {
                                  ...prev[activeSession as keyof typeof prev],
                                  doubleBit: e.target.value
                                }
                              }))
                            }}
                            className="w-20" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Points Table */}
                    <div className="mt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px] text-center">#</TableHead>
                            <TableHead className="w-[100px]">DNP3 Point</TableHead>
                            <TableHead className="w-[120px]">Assign Class</TableHead>
                            <TableHead className="w-[180px]">TagName</TableHead>
                            <TableHead className="w-[120px]">Event High Limit</TableHead>
                            <TableHead className="w-[120px]">Event Low Limit</TableHead>
                            <TableHead className="w-[120px]">Event Deadband</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dnp3Points.map((point, index) => (
                            <TableRow 
                              key={point.id}
                              className={index % 2 === 0 ? 'bg-white' : 
                                point.point.startsWith('AI') ? 'bg-orange-100' : 
                                point.point.startsWith('BI') ? 'bg-blue-100' : 
                                point.point.startsWith('BO') ? 'bg-green-100' : ''}
                            >
                              <TableCell className="text-center">{point.id}</TableCell>
                              <TableCell>{point.point}</TableCell>
                              <TableCell>
                                <Select 
                                  value={point.assignClass} 
                                  onValueChange={(value) => handleClassChange(point.id, value)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Select class" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Class 1">Class 1</SelectItem>
                                    <SelectItem value="Class 2">Class 2</SelectItem>
                                    <SelectItem value="Class 3">Class 3</SelectItem>
                                    <SelectItem value="Class 4">Class 4</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell 
                                className="text-blue-400 cursor-pointer hover:bg-gray-100" 
                                onDoubleClick={() => openTagSelectionDialog(point.id)}
                              >
                                {point.tagName}
                              </TableCell>
                              <TableCell>
                                <Input 
                                  className="h-8"
                                  value={point.eventHighLimit}
                                  onChange={(e) => handleEventLimitChange(point.id, 'eventHighLimit', e.target.value)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  className="h-8"
                                  value={point.eventLowLimit}
                                  onChange={(e) => handleEventLimitChange(point.id, 'eventLowLimit', e.target.value)}
                                />
                              </TableCell>
                              <TableCell 
                                className="cursor-pointer hover:bg-gray-100"
                                onDoubleClick={() => openDeadbandDialog(point.id)}
                              >
                                {point.eventDeadband}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tag Selection Dialog */}
      <Dialog open={tagSelectionDialogOpen} onOpenChange={setTagSelectionDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Tag</DialogTitle>
            <DialogDescription>
              Choose a tag to add to your DNP3 configuration
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-auto">
            {/* Left panel - Data Center */}
            <div className="border rounded-md p-4 md:col-span-1 overflow-auto">
              <h3 className="font-medium mb-4">Data Center</h3>
              <div className="space-y-1">
                {/* IO Tag */}
                <div className="flex items-center">
                  <button 
                    className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                    onClick={() => togglePortExpansion('io-tag')}
                  >
                    {expandedPorts.includes('io-tag') ? 
                      <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                    }
                    <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>IO Tag</span>
                  </button>
                </div>
                
                {expandedPorts.includes('io-tag') && (
                  <div className="ml-6 space-y-1">
                    {ioPorts.map(port => (
                      <div key={port.id}>
                        <button 
                          className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                          onClick={() => togglePortExpansion(port.id)}
                        >
                          {expandedPorts.includes(port.id) ? 
                            <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                            <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                          }
                          <Server className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{port.name}</span>
                        </button>
                        
                        {expandedPorts.includes(port.id) && (
                          <div className="ml-6 space-y-1">
                            {port.devices.map(device => (
                              <div key={device.id}>
                                <button 
                                  className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                                  onClick={() => toggleDeviceExpansion(device.id)}
                                >
                                  {expandedDevices.includes(device.id) ? 
                                    <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                                    <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                                  }
                                  <Cpu className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span>{device.name}</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Calculation Tag */}
                <div className="flex items-center">
                  <button 
                    className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                    onClick={() => togglePortExpansion('calculation-tag')}
                  >
                    {expandedPorts.includes('calculation-tag') ? 
                      <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                    }
                    <FileDigit className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Calculation Tag</span>
                  </button>
                </div>
                
                {/* User Tag */}
                <div className="flex items-center">
                  <button 
                    className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                    onClick={() => togglePortExpansion('user-tag')}
                  >
                    {expandedPorts.includes('user-tag') ? 
                      <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                    }
                    <UserCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>User Tag</span>
                  </button>
                </div>
                
                {/* System Tag */}
                <div className="flex items-center">
                  <button 
                    className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                    onClick={() => togglePortExpansion('system-tag')}
                  >
                    {expandedPorts.includes('system-tag') ? 
                      <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                    }
                    <Cog className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>System Tag</span>
                  </button>
                </div>
                
                {/* Stats Tag */}
                <div className="flex items-center">
                  <button 
                    className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                    onClick={() => togglePortExpansion('stats-tag')}
                  >
                    {expandedPorts.includes('stats-tag') ? 
                      <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                    }
                    <BarChart className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Stats Tag</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right panel - Available Tags */}
            <div className="border rounded-md p-4 md:col-span-2 overflow-auto">
              <h3 className="font-medium mb-4">Available Tags</h3>
              
              {expandedDevices.length > 0 && (
                <div>
                  {ioPorts.map(port => (
                    port.devices
                      .filter(device => expandedDevices.includes(device.id))
                      .map(device => (
                        <div key={device.id} className="mb-4">
                          <div className="flex items-center mb-2">
                            <Cpu className="h-5 w-5 mr-2" />
                            <h4 className="font-medium">DEVICE {device.unitNumber || 1}</h4>
                          </div>
                          
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
                              {device.tags?.map(tag => (
                                <TableRow key={tag.id}>
                                  <TableCell>{tag.name}</TableCell>
                                  <TableCell>{tag.dataType}</TableCell>
                                  <TableCell>{tag.address}</TableCell>
                                  <TableCell>{tag.description}</TableCell>
                                  <TableCell>
                                    <Button 
                                      className="bg-blue-500 hover:bg-blue-600 text-white"
                                      onClick={() => selectTagFromTree(tag, device.name, port.name)}
                                    >
                                      Select
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ))
                  ))}
                </div>
              )}
              
              {expandedDevices.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Select a device from the Data Center to view available tags
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => setTagSelectionDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Deadband Dialog */}
      <Dialog open={deadbandDialogOpen} onOpenChange={setDeadbandDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Event Deadband</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="deadband-type">Deadband Type</Label>
              <Select 
                value={deadbandType} 
                onValueChange={setDeadbandType}
              >
                <SelectTrigger id="deadband-type">
                  <SelectValue placeholder="Select deadband type" />
                </SelectTrigger>
                <SelectContent>
                  {deadbandTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Value input for 'value' type */}
            {deadbandType === 'value' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="value">Value</Label>
                <Input 
                  id="value" 
                  value={deadbandValue} 
                  onChange={(e) => setDeadbandValue(e.target.value)} 
                />
              </div>
            )}

            {/* Tag selection for 'value-over-tag' type */}
            {deadbandType === 'value-over-tag' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="select-tag">Select Tag</Label>
                <div className="flex">
                  <Input 
                    id="select-tag" 
                    value={valueOverTag} 
                    onChange={(e) => setValueOverTag(e.target.value)} 
                    className="flex-1"
                    readOnly
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="ml-2"
                    onClick={() => openDeadbandTagDialog('value-over-tag')}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Percent input for 'percent' type */}
            {deadbandType === 'percent' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="percent">Percent(%)</Label>
                <Input 
                  id="percent" 
                  value={deadbandPercent} 
                  onChange={(e) => setDeadbandPercent(e.target.value)} 
                />
              </div>
            )}

            {/* Tag selection for 'percent-over-tag' type */}
            {deadbandType === 'percent-over-tag' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="select-tag-percent">Select Tag</Label>
                <div className="flex">
                  <Input 
                    id="select-tag-percent" 
                    value={percentOverTag} 
                    onChange={(e) => setPercentOverTag(e.target.value)} 
                    className="flex-1"
                    readOnly
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="ml-2"
                    onClick={() => openDeadbandTagDialog('percent-over-tag')}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                readOnly 
                value={getDeadbandDescription(deadbandType)}
                className="h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeadbandDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveDeadbandSettings}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deadband Tag Selection Dialog */}
      <Dialog open={deadbandTagDialogOpen} onOpenChange={setDeadbandTagDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Tag</DialogTitle>
            <DialogDescription>
              Choose a tag to add to your DNP3 configuration
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-auto">
            {/* Left panel - Data Center */}
            <div className="border rounded-md p-4 md:col-span-1 overflow-auto">
              <h3 className="font-medium mb-4">Data Center</h3>
              <div className="space-y-1">
                {/* IO Tag */}
                <div className="flex items-center">
                  <button 
                    className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                    onClick={() => togglePortExpansion('io-tag')}
                  >
                    {expandedPorts.includes('io-tag') ? 
                      <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                    }
                    <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>IO Tag</span>
                  </button>
                </div>
                
                {expandedPorts.includes('io-tag') && (
                  <div className="ml-6 space-y-1">
                    {ioPorts.map(port => (
                      <div key={port.id}>
                        <button 
                          className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                          onClick={() => togglePortExpansion(port.id)}
                        >
                          {expandedPorts.includes(port.id) ? 
                            <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                            <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                          }
                          <Server className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{port.name}</span>
                        </button>
                        
                        {expandedPorts.includes(port.id) && (
                          <div className="ml-6 space-y-1">
                            {port.devices.map(device => (
                              <div key={device.id}>
                                <button 
                                  className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                                  onClick={() => toggleDeviceExpansion(device.id)}
                                >
                                  {expandedDevices.includes(device.id) ? 
                                    <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                                    <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                                  }
                                  <Cpu className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span>{device.name}</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Calculation Tag */}
                <div className="flex items-center">
                  <button 
                    className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                    onClick={() => togglePortExpansion('calculation-tag')}
                  >
                    {expandedPorts.includes('calculation-tag') ? 
                      <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                    }
                    <FileDigit className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Calculation Tag</span>
                  </button>
                </div>
                
                {/* User Tag */}
                <div className="flex items-center">
                  <button 
                    className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                    onClick={() => togglePortExpansion('user-tag')}
                  >
                    {expandedPorts.includes('user-tag') ? 
                      <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                    }
                    <UserCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>User Tag</span>
                  </button>
                </div>
                
                {/* System Tag */}
                <div className="flex items-center">
                  <button 
                    className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                    onClick={() => togglePortExpansion('system-tag')}
                  >
                    {expandedPorts.includes('system-tag') ? 
                      <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                    }
                    <Cog className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>System Tag</span>
                  </button>
                </div>
                
                {/* Stats Tag */}
                <div className="flex items-center">
                  <button 
                    className="flex items-center w-full text-left hover:bg-gray-100 p-1 rounded"
                    onClick={() => togglePortExpansion('stats-tag')}
                  >
                    {expandedPorts.includes('stats-tag') ? 
                      <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" /> : 
                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                    }
                    <BarChart className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Stats Tag</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right panel - Available Tags */}
            <div className="border rounded-md p-4 md:col-span-2 overflow-auto">
              <h3 className="font-medium mb-4">Available Tags</h3>
              
              {expandedDevices.length > 0 && (
                <div>
                  {ioPorts.map(port => (
                    port.devices
                      .filter(device => expandedDevices.includes(device.id))
                      .map(device => (
                        <div key={device.id} className="mb-4">
                          <div className="flex items-center mb-2">
                            <Cpu className="h-5 w-5 mr-2" />
                            <h4 className="font-medium">DEVICE {device.unitNumber || 1}</h4>
                          </div>
                          
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
                              {device.tags?.map(tag => (
                                <TableRow key={tag.id}>
                                  <TableCell>{tag.name}</TableCell>
                                  <TableCell>{tag.dataType}</TableCell>
                                  <TableCell>{tag.address}</TableCell>
                                  <TableCell>{tag.description}</TableCell>
                                  <TableCell>
                                    <Button 
                                      className="bg-blue-500 hover:bg-blue-600 text-white"
                                      onClick={() => selectDeadbandTag(tag, device.name, port.name)}
                                    >
                                      Select
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ))
                  ))}
                </div>
              )}
              
              {expandedDevices.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Select a device from the Data Center to view available tags
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => setDeadbandTagDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
