"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useConfigStore } from "@/lib/stores/configuration-store"
import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

const ethernetFormSchema = z.object({
  interface: z.string(),
  enabled: z.boolean(),
  mode: z.enum(["static", "dhcp"]),
  ipAddress: z.string().optional(),
  subnetMask: z.string().optional(),
  gateway: z.string().optional(),
  dns1: z.string().optional(),
  dns2: z.string().optional(),
  speed: z.enum(["auto", "10", "100", "1000"]),
  duplex: z.enum(["auto", "full", "half"]),
})

export function EthernetSettingsForm() {
  const { updateConfig } = useConfigStore()
  const [isSaving, setIsSaving] = useState(false)
  const form = useForm<z.infer<typeof ethernetFormSchema>>({
    resolver: zodResolver(ethernetFormSchema),
    defaultValues: {
      interface: "eth0",
      enabled: true,
      mode: "dhcp",
      speed: "auto",
      duplex: "auto",
    },
  })

  async function onSubmit(values: z.infer<typeof ethernetFormSchema>) {
    setIsSaving(true)
    try {
      updateConfig(['network', 'interfaces', values.interface], {
        type: 'ethernet',
        enabled: values.enabled,
        link: {
          speed: values.speed,
          duplex: values.duplex,
        },
        ipv4: {
          mode: values.mode,
          ...(values.mode === 'static' && {
            address: values.ipAddress,
            netmask: values.subnetMask,
            gateway: values.gateway,
          }),
        },
      })

      toast.success('Ethernet settings saved successfully!', {
        duration: 3000,
      })
    } catch (error) {
      console.error('Error saving Ethernet settings:', error)
      toast.error('Failed to save Ethernet settings. Please try again.', {
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="interface"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interface</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interface" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth0">ETH0</SelectItem>
                  <SelectItem value="eth1">ETH1</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Enable Interface
                </FormLabel>
                <FormDescription>
                  Enable or disable this ethernet interface
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Add more fields for IP configuration, speed, duplex, etc. */}
        
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