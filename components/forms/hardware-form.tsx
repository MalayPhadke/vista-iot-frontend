"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useConfigStore } from "@/lib/stores/configuration-store"
import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

const hardwareFormSchema = z.object({
  com_ports: z.object({
    com1: z.object({
      mode: z.enum(["rs232", "rs485"]),
      baudrate: z.number().min(1200).max(115200),
      data_bits: z.number().min(5).max(8),
      parity: z.enum(["none", "even", "odd"]),
      stop_bits: z.number().min(1).max(2),
      flow_control: z.enum(["none", "rts/cts", "xon/xoff"])
    }),
    com2: z.object({
      mode: z.enum(["rs232", "rs485"]),
      baudrate: z.number().min(1200).max(115200),
      data_bits: z.number().min(5).max(8),
      parity: z.enum(["none", "even", "odd"]),
      stop_bits: z.number().min(1).max(2),
      flow_control: z.enum(["none", "rts/cts", "xon/xoff"])
    })
  }),
  watchdog: z.object({
    enabled: z.boolean(),
    timeout: z.number().min(1).max(3600),
    action: z.enum(["restart", "shutdown", "custom"]),
    custom_command: z.string().optional()
  }),
  gpio: z.object({
    inputs: z.array(z.object({
      pin: z.number(),
      name: z.string(),
      mode: z.enum(["digital", "analog"]),
      pull: z.enum(["none", "up", "down"])
    })),
    outputs: z.array(z.object({
      pin: z.number(),
      name: z.string(),
      mode: z.enum(["digital", "pwm"]),
      initial_state: z.enum(["low", "high"])
    }))
  })
})

export function HardwareForm() {
  const { updateConfig, getConfig } = useConfigStore()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("com1")

  const form = useForm<z.infer<typeof hardwareFormSchema>>({
    resolver: zodResolver(hardwareFormSchema),
    defaultValues: {
      com_ports: getConfig().hardware.com_ports,
      watchdog: getConfig().hardware.watchdog,
      gpio: getConfig().hardware.gpio
    }
  })

  const onSubmit = async (values: z.infer<typeof hardwareFormSchema>) => {
    setIsSaving(true)
    try {
      updateConfig(['hardware'], values)
      
      toast.success('Hardware settings saved successfully!', {
        duration: 3000
      })
    } catch (error) {
      console.error('Error saving hardware settings:', error)
      toast.error('Failed to save hardware settings', {
        duration: 5000
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderSerialPortFields = (portName: "com1" | "com2") => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={`com_ports.${portName}.mode`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mode</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rs232">RS-232</SelectItem>
                <SelectItem value="rs485">RS-485</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`com_ports.${portName}.baudrate`}
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

      {/* Add other serial port fields (data_bits, parity, etc.) similar to Modbus form */}
    </div>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Serial Ports</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="com1">COM1</TabsTrigger>
                <TabsTrigger value="com2">COM2</TabsTrigger>
              </TabsList>
              <TabsContent value="com1">
                {renderSerialPortFields("com1")}
              </TabsContent>
              <TabsContent value="com2">
                {renderSerialPortFields("com2")}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Watchdog Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="watchdog.enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Watchdog</FormLabel>
                    <FormDescription>
                      Automatically restart device if system becomes unresponsive
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

            {form.watch("watchdog.enabled") && (
              <>
                <FormField
                  control={form.control}
                  name="watchdog.timeout"
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

                <FormField
                  control={form.control}
                  name="watchdog.action"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="restart">Restart</SelectItem>
                          <SelectItem value="shutdown">Shutdown</SelectItem>
                          <SelectItem value="custom">Custom Command</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {form.watch("watchdog.action") === "custom" && (
                  <FormField
                    control={form.control}
                    name="watchdog.custom_command"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Command</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter command" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>

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