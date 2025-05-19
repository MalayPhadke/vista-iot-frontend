"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useConfigStore } from "@/lib/stores/configuration-store"
import { useState, useEffect } from "react"
import { RefreshCw, Plus, X, FileSpreadsheet, Download, Upload, Check, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const modbusFormSchema = z.object({
  enabled: z.boolean(),
  mode: z.enum(["tcp", "rtu"]),
  tcp: z.object({
    port: z.number().min(1).max(65535),
    max_connections: z.number().min(1).max(100),
    timeout: z.number().min(1).max(3600)
  }),
  serial: z.object({
    port: z.string(),
    baudrate: z.number().min(1200).max(115200),
    data_bits: z.number().min(5).max(8),
    parity: z.enum(["none", "even", "odd"]),
    stop_bits: z.number().min(1).max(2)
  }),
  slave_id: z.number().min(1).max(247)
})

type ModbusFormValues = z.infer<typeof modbusFormSchema>

// Define the tag interface
interface ModbusTag {
  id: string;
  name: string;
  tagType: string;
  address: string;
  modbusAddress: string;
  dataType: string;
  littleEndian: boolean;
  reverseWord: boolean;
}

// Define the device interface
interface ModbusDevice {
  id: string;
  deviceId: number;
  name: string;
  tags: ModbusTag[];
}

interface ModbusFormProps {
  separateAdvancedConfig?: boolean;
}

export function ModbusForm({ separateAdvancedConfig = false }: ModbusFormProps) {
  const { updateConfig, getConfig } = useConfigStore()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"tcp" | "rtu">("tcp")
  
  // State for the advanced configuration
  const [configTabs, setConfigTabs] = useState([
    { id: "server1", name: "Modbus Server(Meter)*", active: true },
    { id: "tag1", name: "3D Tag(Meter-Crane.1)", active: false },
    { id: "tag2", name: "Power Tag(Meter-CSS)", active: false },
  ])
  
  // State for IO Tag ports
  const [ioPorts, setIoPorts] = useState([
    { id: "com1", name: "COM1", type: "Serial Port", active: true },
    { id: "com2", name: "COM2", type: "Serial Port", active: false },
    { id: "com3", name: "COM3", type: "Serial Port", active: false },
    { id: "com4", name: "COM4", type: "Serial Port", active: false },
    { id: "ethernet", name: "Ethernet", type: "TCP/IP", active: false },
  ])
  
  // Function to handle port selection
  const handlePortSelect = (portId: string) => {
    setIoPorts(prev => prev.map(port => ({
      ...port,
      active: port.id === portId
    })))
  }
  
  // State for Modbus TCP settings
  const [modbusTcpEnabled, setModbusTcpEnabled] = useState(true)
  const [modbusTcpPort, setModbusTcpPort] = useState(502)
  const [modbusTcpMaxUsers, setModbusTcpMaxUsers] = useState(4)
  const [modbusTcpIdleTime, setModbusTcpIdleTime] = useState(120)
  const [modbusRtuOverTcp, setModbusRtuOverTcp] = useState(false)
  
  // State for Modbus RTU settings
  const [modbusRtuEnabled, setModbusRtuEnabled] = useState(false)
  const [modbusRtuPort, setModbusRtuPort] = useState("COM1")
  const [modbusRtuBaudRate, setModbusRtuBaudRate] = useState(9600)
  const [modbusRtuDataBit, setModbusRtuDataBit] = useState(8)
  const [modbusRtuStopBit, setModbusRtuStopBit] = useState(1)
  const [modbusRtuParity, setModbusRtuParity] = useState<"none" | "even" | "odd">("none")
  
  // State for device and tags
  const [devices, setDevices] = useState<ModbusDevice[]>([
    {
      id: "device1",
      deviceId: 1,
      name: "Energy Meter",
      tags: [
        { id: "tag1", name: "Voltage", tagType: "Input Register", address: "30001", modbusAddress: "0", dataType: "Float", littleEndian: true, reverseWord: false },
        { id: "tag2", name: "Current", tagType: "Input Register", address: "30003", modbusAddress: "2", dataType: "Float", littleEndian: true, reverseWord: false },
        { id: "tag3", name: "Power", tagType: "Input Register", address: "30005", modbusAddress: "4", dataType: "Float", littleEndian: true, reverseWord: false },
      ]
    },
    {
      id: "device2",
      deviceId: 2,
      name: "PLC Controller",
      tags: [
        { id: "tag4", name: "Status", tagType: "Coil", address: "00001", modbusAddress: "0", dataType: "Boolean", littleEndian: false, reverseWord: false },
        { id: "tag5", name: "Mode", tagType: "Holding Register", address: "40001", modbusAddress: "0", dataType: "Int16", littleEndian: true, reverseWord: false },
      ]
    }
  ])
  
  const [selectedDevice, setSelectedDevice] = useState<ModbusDevice | null>(devices[0])
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>(1)

  const form = useForm<ModbusFormValues>({
    resolver: zodResolver(modbusFormSchema),
    defaultValues: {
      enabled: false,
      mode: "tcp",
      tcp: {
        port: 502,
        max_connections: 5,
        timeout: 60
      },
      serial: {
        port: "/dev/ttyUSB0",
        baudrate: 9600,
        data_bits: 8,
        parity: "none",
        stop_bits: 1
      },
      slave_id: 1
    }
  })

  useEffect(() => {
    const config = getConfig()?.protocols?.modbus;
    if (config) {
      form.reset({
        enabled: config.enabled || false,
        mode: (config.mode as "tcp" | "rtu") || "tcp",
        tcp: {
          port: config.tcp?.port || 502,
          max_connections: config.tcp?.max_connections || 5,
          timeout: config.tcp?.timeout || 60
        },
        serial: {
          port: config.serial?.port || "/dev/ttyUSB0",
          baudrate: config.serial?.baudrate || 9600,
          data_bits: config.serial?.data_bits || 8,
          parity: (config.serial?.parity as "none" | "even" | "odd") || "none",
          stop_bits: config.serial?.stop_bits || 1
        },
        slave_id: config.slave_id || 1
      });
      setActiveTab((config.mode as "tcp" | "rtu") || "tcp");
    }
  }, [getConfig, form]);

  const onSubmit = async (values: ModbusFormValues) => {
    setIsSaving(true)
    try {
      updateConfig(['protocols', 'modbus'], {
        enabled: values.enabled,
        mode: values.mode,
        tcp: values.tcp,
        serial: values.serial,
        slave_id: values.slave_id
      })
      toast.success('Modbus settings saved successfully!', {
        duration: 3000
      })
    } catch (error) {
      console.error('Error saving Modbus settings:', error)
      toast.error('Failed to save Modbus settings', {
        duration: 5000
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Helper functions
  const handleTabChange = (tabId: string) => {
    setConfigTabs(prev => prev.map(tab => ({
      ...tab,
      active: tab.id === tabId
    })))
  }
  
  const handleDeviceIdChange = (value: number) => {
    setSelectedDeviceId(value)
    const device = devices.find(d => d.deviceId === value)
    if (device) {
      setSelectedDevice(device)
    }
  }
  
  const addNewTag = () => {
    if (!selectedDevice) return
    
    const newTag: ModbusTag = {
      id: `tag-${Date.now()}`,
      name: `New_Tag_${selectedDevice.tags.length + 1}`,
      tagType: "Holding Register",
      address: "40001",
      modbusAddress: "40001",
      dataType: "Float",
      littleEndian: true,
      reverseWord: false
    }
    
    // Update the selected device with the new tag
    const updatedDevice = {
      ...selectedDevice,
      tags: [...selectedDevice.tags, newTag]
    }
    
    // Update the devices list
    setDevices(prev => prev.map(d => 
      d.id === updatedDevice.id ? updatedDevice : d
    ))
    
    setSelectedDevice(updatedDevice)
  }
  
  const deleteTag = (tagId: string) => {
    if (!selectedDevice) return
    
    // Update the selected device by removing the tag
    const updatedDevice = {
      ...selectedDevice,
      tags: selectedDevice.tags.filter(tag => tag.id !== tagId)
    }
    
    // Update the devices list
    setDevices(prev => prev.map(d => 
      d.id === updatedDevice.id ? updatedDevice : d
    ))
    
    setSelectedDevice(updatedDevice)
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Modbus</FormLabel>
                    <FormDescription>
                      Enable or disable Modbus protocol
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {form.watch("enabled") && (
          <>
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modbus Mode</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value)
                      setActiveTab(value as "tcp" | "rtu")
                    }} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tcp">Modbus TCP</SelectItem>
                      <SelectItem value="rtu">Modbus RTU</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Save button moved below slave ID field */}

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "tcp" | "rtu")}>
              <TabsList>
                <TabsTrigger value="tcp">TCP Settings</TabsTrigger>
                <TabsTrigger value="rtu">RTU Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="tcp" className="space-y-4">
                <FormField
                  control={form.control}
                  name="tcp.port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TCP Port</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          placeholder="502"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tcp.max_connections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Connections</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          placeholder="5"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tcp.timeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeout (seconds)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          placeholder="30"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="rtu" className="space-y-4">
                <FormField
                  control={form.control}
                  name="serial.port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Port</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select port" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ttyS0">/dev/ttyS0</SelectItem>
                          <SelectItem value="ttyS1">/dev/ttyS1</SelectItem>
                          <SelectItem value="ttyUSB0">/dev/ttyUSB0</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serial.baudrate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Baud Rate</FormLabel>
                      <Select 
                        onValueChange={(v) => field.onChange(parseInt(v))} 
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select baud rate" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200].map(rate => (
                            <SelectItem key={rate} value={rate.toString()}>
                              {rate} bps
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serial.data_bits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Bits</FormLabel>
                      <Select 
                        onValueChange={(v) => field.onChange(parseInt(v))} 
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select data bits" />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 6, 7, 8].map(bits => (
                            <SelectItem key={bits} value={bits.toString()}>
                              {bits}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serial.parity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="even">Even</SelectItem>
                          <SelectItem value="odd">Odd</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serial.stop_bits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stop Bits</FormLabel>
                      <Select 
                        onValueChange={(v) => field.onChange(parseInt(v))} 
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stop bits" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="slave_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slave ID</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                      placeholder="1"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end mt-6 mb-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>

          </>
        )}

        {/* If not separate, render advanced config inside the form */}
        {form.watch("enabled") && !separateAdvancedConfig && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Advanced Modbus Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Configuration Tabs */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {configTabs.map((tab) => (
                    <div 
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium ${tab.active ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                      {tab.name}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="h-9 px-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Modbus TCP Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Modbus TCP Settings</CardTitle>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">Enable</span>
                          <Switch 
                            checked={modbusTcpEnabled} 
                            onCheckedChange={setModbusTcpEnabled} 
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {modbusTcpEnabled && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="tcp-port">Port</Label>
                              <Input 
                                id="tcp-port" 
                                type="number" 
                                value={modbusTcpPort} 
                                onChange={(e) => setModbusTcpPort(parseInt(e.target.value))} 
                                placeholder="502" 
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="tcp-max-users">Max Users</Label>
                              <Input 
                                id="tcp-max-users" 
                                type="number" 
                                value={modbusTcpMaxUsers} 
                                onChange={(e) => setModbusTcpMaxUsers(parseInt(e.target.value))} 
                                placeholder="4" 
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="tcp-idle-time">Idle Time (s)</Label>
                              <Input 
                                id="tcp-idle-time" 
                                type="number" 
                                value={modbusTcpIdleTime} 
                                onChange={(e) => setModbusTcpIdleTime(parseInt(e.target.value))} 
                                placeholder="120" 
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                              <Checkbox 
                                id="rtu-over-tcp" 
                                checked={modbusRtuOverTcp} 
                                onCheckedChange={(checked) => 
                                  setModbusRtuOverTcp(checked === true)}
                              />
                              <Label htmlFor="rtu-over-tcp">RTU over TCP</Label>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Modbus RTU Settings */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Modbus RTU Settings</CardTitle>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">Enable</span>
                          <Switch 
                            checked={modbusRtuEnabled} 
                            onCheckedChange={setModbusRtuEnabled} 
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {modbusRtuEnabled && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="rtu-port">Port</Label>
                              <Select 
                                value={modbusRtuPort} 
                                onValueChange={setModbusRtuPort}
                              >
                                <SelectTrigger id="rtu-port">
                                  <SelectValue placeholder="Select port" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="COM1">COM1</SelectItem>
                                  <SelectItem value="COM2">COM2</SelectItem>
                                  <SelectItem value="COM3">COM3</SelectItem>
                                  <SelectItem value="COM4">COM4</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="rtu-baudrate">Baud Rate</Label>
                              <Select 
                                value={modbusRtuBaudRate.toString()} 
                                onValueChange={(v) => setModbusRtuBaudRate(parseInt(v))}
                              >
                                <SelectTrigger id="rtu-baudrate">
                                  <SelectValue placeholder="Select baud rate" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200].map(rate => (
                                    <SelectItem key={rate} value={rate.toString()}>
                                      {rate}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="rtu-databit">Data Bit</Label>
                              <Select 
                                value={modbusRtuDataBit.toString()} 
                                onValueChange={(v) => setModbusRtuDataBit(parseInt(v))}
                              >
                                <SelectTrigger id="rtu-databit">
                                  <SelectValue placeholder="Data bit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[5, 6, 7, 8].map(bit => (
                                    <SelectItem key={bit} value={bit.toString()}>
                                      {bit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="rtu-stopbit">Stop Bit</Label>
                              <Select 
                                value={modbusRtuStopBit.toString()} 
                                onValueChange={(v) => setModbusRtuStopBit(parseInt(v))}
                              >
                                <SelectTrigger id="rtu-stopbit">
                                  <SelectValue placeholder="Stop bit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="rtu-parity">Parity</Label>
                              <Select 
                                value={modbusRtuParity} 
                                onValueChange={(value: "none" | "even" | "odd") => setModbusRtuParity(value)}
                              >
                                <SelectTrigger id="rtu-parity">
                                  <SelectValue placeholder="Parity" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="even">Even</SelectItem>
                                  <SelectItem value="odd">Odd</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Device Configuration */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Device Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="device-id">Device ID</Label>
                          <Select 
                            value={selectedDeviceId.toString()} 
                            onValueChange={(v) => handleDeviceIdChange(parseInt(v))}
                          >
                            <SelectTrigger id="device-id">
                              <SelectValue placeholder="Select device ID" />
                            </SelectTrigger>
                            <SelectContent>
                              {devices.map(device => (
                                <SelectItem key={device.id} value={device.deviceId.toString()}>
                                  {device.deviceId} - {device.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="device-name">Device Name</Label>
                          <Input 
                            id="device-name" 
                            value={selectedDevice?.name || ''} 
                            onChange={(e) => {
                              if (selectedDevice) {
                                const updatedDevice = { ...selectedDevice, name: e.target.value }
                                setSelectedDevice(updatedDevice)
                                setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                              }
                            }} 
                            placeholder="Device name" 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tag Table */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Tag Configuration</CardTitle>
                      <Button variant="outline" size="sm" onClick={addNewTag}>
                        <Plus className="h-4 w-4 mr-1" /> Add Tag
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Tag Type</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Data Type</TableHead>
                            <TableHead className="w-[100px]">Options</TableHead>
                            <TableHead className="w-[70px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedDevice?.tags.map((tag) => (
                            <TableRow key={tag.id}>
                              <TableCell>
                                <Input 
                                  value={tag.name} 
                                  onChange={(e) => {
                                    if (selectedDevice) {
                                      const updatedTags = selectedDevice.tags.map(t => 
                                        t.id === tag.id ? { ...t, name: e.target.value } : t
                                      )
                                      const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                      setSelectedDevice(updatedDevice)
                                      setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                    }
                                  }} 
                                  className="h-8" 
                                />
                              </TableCell>
                              <TableCell>
                                <Select 
                                  value={tag.tagType} 
                                  onValueChange={(value) => {
                                    if (selectedDevice) {
                                      const updatedTags = selectedDevice.tags.map(t => 
                                        t.id === tag.id ? { ...t, tagType: value } : t
                                      )
                                      const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                      setSelectedDevice(updatedDevice)
                                      setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                    }
                                  }}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Coil">Coil</SelectItem>
                                    <SelectItem value="Discrete Input">Discrete Input</SelectItem>
                                    <SelectItem value="Holding Register">Holding Register</SelectItem>
                                    <SelectItem value="Input Register">Input Register</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input 
                                  value={tag.address} 
                                  onChange={(e) => {
                                    if (selectedDevice) {
                                      const updatedTags = selectedDevice.tags.map(t => 
                                        t.id === tag.id ? { ...t, address: e.target.value, modbusAddress: e.target.value } : t
                                      )
                                      const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                      setSelectedDevice(updatedDevice)
                                      setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                    }
                                  }} 
                                  className="h-8" 
                                />
                              </TableCell>
                              <TableCell>
                                <Select 
                                  value={tag.dataType} 
                                  onValueChange={(value) => {
                                    if (selectedDevice) {
                                      const updatedTags = selectedDevice.tags.map(t => 
                                        t.id === tag.id ? { ...t, dataType: value } : t
                                      )
                                      const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                      setSelectedDevice(updatedDevice)
                                      setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                    }
                                  }}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Boolean">Boolean</SelectItem>
                                    <SelectItem value="Int16">Int16</SelectItem>
                                    <SelectItem value="UInt16">UInt16</SelectItem>
                                    <SelectItem value="Int32">Int32</SelectItem>
                                    <SelectItem value="UInt32">UInt32</SelectItem>
                                    <SelectItem value="Float">Float</SelectItem>
                                    <SelectItem value="Double">Double</SelectItem>
                                    <SelectItem value="String">String</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`little-endian-${tag.id}`} 
                                      checked={tag.littleEndian} 
                                      onCheckedChange={(checked) => {
                                        if (selectedDevice) {
                                          const updatedTags = selectedDevice.tags.map(t => 
                                            t.id === tag.id ? { ...t, littleEndian: checked === true } : t
                                          )
                                          const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                          setSelectedDevice(updatedDevice)
                                          setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                        }
                                      }} 
                                    />
                                    <Label htmlFor={`little-endian-${tag.id}`} className="text-xs">Little Endian</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`reverse-word-${tag.id}`} 
                                      checked={tag.reverseWord} 
                                      onCheckedChange={(checked) => {
                                        if (selectedDevice) {
                                          const updatedTags = selectedDevice.tags.map(t => 
                                            t.id === tag.id ? { ...t, reverseWord: checked === true } : t
                                          )
                                          const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                          setSelectedDevice(updatedDevice)
                                          setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                        }
                                      }} 
                                    />
                                    <Label htmlFor={`reverse-word-${tag.id}`} className="text-xs">Reverse Word</Label>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => deleteTag(tag.id)}
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Discard Changes</Button>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-1" /> Import
                </Button>
                <Button>
                  <Check className="h-4 w-4 mr-1" /> Apply Changes
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {/* Save button moved above the advanced configuration section */}
      </form>

      {/* If separate, render advanced config outside the form */}
      {form.watch("enabled") && separateAdvancedConfig && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Advanced Modbus Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* IO Tags Ports Navigation */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b mb-4">
                {ioPorts.map(port => (
                  <Badge 
                    key={port.id}
                    variant={port.active ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => handlePortSelect(port.id)}
                  >
                    {port.name} ({port.type})
                  </Badge>
                ))}
              </div>

              {/* Modbus TCP and RTU Configuration */}
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">Modbus Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Modbus TCP Configuration (Left Side) */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Modbus TCP Configuration</h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="modbus-tcp-enabled" />
                          <Label htmlFor="modbus-tcp-enabled">Modbus TCP</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Configure the system as a Modbus TCP server over Ethernet networks
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tcp-port">Port Number</Label>
                            <Input id="tcp-port" type="number" defaultValue="502" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tcp-max-users">Max Users</Label>
                            <Input id="tcp-max-users" type="number" defaultValue="4" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tcp-idle-time">Idle Time (s)</Label>
                          <Input id="tcp-idle-time" type="number" defaultValue="120" />
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox id="modbus-rtu-over-tcp" />
                          <Label htmlFor="modbus-rtu-over-tcp">Modbus RTU Over TCP</Label>
                        </div>
                      </div>
                    </div>

                    {/* Modbus RTU Configuration (Right Side) */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Modbus RTU Configuration</h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="modbus-rtu-enabled" />
                          <Label htmlFor="modbus-rtu-enabled">Modbus RTU</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Configure the system to communicate with Modbus devices over a serial interface
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="rtu-port">Port</Label>
                          <Select defaultValue="COM1">
                            <SelectTrigger id="rtu-port">
                              <SelectValue placeholder="Select port" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COM1">COM1</SelectItem>
                              <SelectItem value="COM2">COM2</SelectItem>
                              <SelectItem value="COM3">COM3</SelectItem>
                              <SelectItem value="COM4">COM4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="rtu-baud-rate">Baud Rate</Label>
                          <Select defaultValue="9600">
                            <SelectTrigger id="rtu-baud-rate">
                              <SelectValue placeholder="Select baud rate" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1200">1200</SelectItem>
                              <SelectItem value="2400">2400</SelectItem>
                              <SelectItem value="4800">4800</SelectItem>
                              <SelectItem value="9600">9600</SelectItem>
                              <SelectItem value="19200">19200</SelectItem>
                              <SelectItem value="38400">38400</SelectItem>
                              <SelectItem value="57600">57600</SelectItem>
                              <SelectItem value="115200">115200</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="rtu-data-bit">Data Bit</Label>
                            <Select defaultValue="8">
                              <SelectTrigger id="rtu-data-bit">
                                <SelectValue placeholder="Data bit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7">7</SelectItem>
                                <SelectItem value="8">8</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="rtu-stop-bit">Stop Bit</Label>
                            <Select defaultValue="1">
                              <SelectTrigger id="rtu-stop-bit">
                                <SelectValue placeholder="Stop bit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="rtu-parity">Parity</Label>
                            <Select defaultValue="none">
                              <SelectTrigger id="rtu-parity">
                                <SelectValue placeholder="Parity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="even">Even</SelectItem>
                                <SelectItem value="odd">Odd</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tag Table */}
              <Card>
                <CardHeader className="py-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">Tag Configuration</CardTitle>
                  <Button variant="outline" size="sm" onClick={addNewTag}>
                    <Plus className="h-4 w-4 mr-1" /> Add Tag
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Data Type</TableHead>
                          <TableHead>Options</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDevice?.tags.map(tag => (
                          <TableRow key={tag.id}>
                            <TableCell>
                              <Input 
                                value={tag.name} 
                                onChange={(e) => {
                                  if (selectedDevice) {
                                    const updatedTags = selectedDevice.tags.map(t => 
                                      t.id === tag.id ? { ...t, name: e.target.value } : t
                                    )
                                    const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                    setSelectedDevice(updatedDevice)
                                    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                  }
                                }} 
                                className="h-8" 
                              />
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={tag.tagType} 
                                onValueChange={(value) => {
                                  if (selectedDevice) {
                                    const updatedTags = selectedDevice.tags.map(t => 
                                      t.id === tag.id ? { ...t, tagType: value } : t
                                    )
                                    const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                    setSelectedDevice(updatedDevice)
                                    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                  }
                                }}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Coil">Coil</SelectItem>
                                  <SelectItem value="Discrete Input">Discrete Input</SelectItem>
                                  <SelectItem value="Holding Register">Holding Register</SelectItem>
                                  <SelectItem value="Input Register">Input Register</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={tag.address} 
                                onChange={(e) => {
                                  if (selectedDevice) {
                                    const updatedTags = selectedDevice.tags.map(t => 
                                      t.id === tag.id ? { ...t, address: e.target.value, modbusAddress: e.target.value } : t
                                    )
                                    const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                    setSelectedDevice(updatedDevice)
                                    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                  }
                                }} 
                                className="h-8" 
                              />
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={tag.dataType} 
                                onValueChange={(value) => {
                                  if (selectedDevice) {
                                    const updatedTags = selectedDevice.tags.map(t => 
                                      t.id === tag.id ? { ...t, dataType: value } : t
                                    )
                                    const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                    setSelectedDevice(updatedDevice)
                                    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                  }
                                }}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Boolean">Boolean</SelectItem>
                                  <SelectItem value="Int16">Int16</SelectItem>
                                  <SelectItem value="UInt16">UInt16</SelectItem>
                                  <SelectItem value="Int32">Int32</SelectItem>
                                  <SelectItem value="UInt32">UInt32</SelectItem>
                                  <SelectItem value="Float">Float</SelectItem>
                                  <SelectItem value="Double">Double</SelectItem>
                                  <SelectItem value="String">String</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`little-endian-${tag.id}`} 
                                    checked={tag.littleEndian} 
                                    onCheckedChange={(checked) => {
                                      if (selectedDevice) {
                                        const updatedTags = selectedDevice.tags.map(t => 
                                          t.id === tag.id ? { ...t, littleEndian: checked === true } : t
                                        )
                                        const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                        setSelectedDevice(updatedDevice)
                                        setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                      }
                                    }} 
                                  />
                                  <Label htmlFor={`little-endian-${tag.id}`} className="text-xs">Little Endian</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`reverse-word-${tag.id}`} 
                                    checked={tag.reverseWord} 
                                    onCheckedChange={(checked) => {
                                      if (selectedDevice) {
                                        const updatedTags = selectedDevice.tags.map(t => 
                                          t.id === tag.id ? { ...t, reverseWord: checked === true } : t
                                        )
                                        const updatedDevice = { ...selectedDevice, tags: updatedTags }
                                        setSelectedDevice(updatedDevice)
                                        setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d))
                                      }
                                    }} 
                                  />
                                  <Label htmlFor={`reverse-word-${tag.id}`} className="text-xs">Reverse Word</Label>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => deleteTag(tag.id)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Discard Changes</Button>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-1" /> Export
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-1" /> Import
                    </Button>
                    <Button>
                      <Check className="h-4 w-4 mr-1" /> Apply Changes
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </Form>
  )
}

