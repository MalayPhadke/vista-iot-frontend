"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useConfigStore } from "@/lib/stores/configuration-store"
import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

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

export function ModbusForm() {
  const { updateConfig, getConfig } = useConfigStore()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"tcp" | "rtu">("tcp")

  const form = useForm<z.infer<typeof modbusFormSchema>>({
    resolver: zodResolver(modbusFormSchema),
    defaultValues: {
      enabled: getConfig().protocols.modbus.enabled,
      mode: getConfig().protocols.modbus.mode,
      tcp: getConfig().protocols.modbus.tcp,
      serial: getConfig().protocols.modbus.serial,
      slave_id: getConfig().protocols.modbus.slave_id
    }
  })

  const onSubmit = async (values: z.infer<typeof modbusFormSchema>) => {
    setIsSaving(true)
    try {
      updateConfig(['protocols', 'modbus'], {
        ...getConfig().protocols.modbus,
        ...values
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          </>
        )}

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
      </form>
    </Form>
  )
}

