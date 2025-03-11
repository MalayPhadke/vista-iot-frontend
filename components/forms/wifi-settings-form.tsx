"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useConfigStore } from "@/lib/stores/configuration-store"
import { useState } from "react"
import { RefreshCw } from "lucide-react"

const wifiFormSchema = z.object({
  enabled: z.boolean(),
  mode: z.enum(["client", "ap"]),
  ssid: z.string().min(1),
  security: z.enum(["none", "wep", "wpa2", "wpa3"]),
  password: z.string().optional(),
  channel: z.string(),
  band: z.enum(["2.4", "5"]),
  hidden: z.boolean().optional(),
  addressMode: z.enum(["static", "dhcp"]),
  ipAddress: z.string().optional(),
  netmask: z.string().optional(),
  gateway: z.string().optional(),
})

export function WifiSettingsForm() {
  const { updateConfig } = useConfigStore()
  const [isSaving, setIsSaving] = useState(false)
  const form = useForm<z.infer<typeof wifiFormSchema>>({
    resolver: zodResolver(wifiFormSchema),
    defaultValues: {
      enabled: true,
      mode: "client",
      ssid: "",
      security: "wpa2",
      password: "",
      channel: "auto",
      band: "2.4",
      hidden: false,
      addressMode: "dhcp",
      ipAddress: "",
      netmask: "",
      gateway: "",
    },
  })

  async function onSubmit(values: z.infer<typeof wifiFormSchema>) {
    setIsSaving(true)
    
    try {
      updateConfig(['network', 'interfaces', 'wlan0'], {
        type: 'wireless',
        enabled: values.enabled,
        mode: values.mode,
        wifi: {
          ssid: values.ssid,
          security: {
            mode: values.security,
            password: values.password || '',
          },
          channel: values.channel,
          band: values.band,
          hidden: values.hidden ?? false,
        },
        ipv4: {
          mode: values.addressMode,
          ...(values.addressMode === 'static' && {
            address: values.ipAddress || '',
            netmask: values.netmask || '',
            gateway: values.gateway || '',
          }),
        },
      })

      toast.success('WiFi settings saved successfully!', {
        duration: 3000,
      })
    } catch (error) {
      console.error('Error saving WiFi settings:', error)
      toast.error('Failed to save WiFi settings. Please try again.', {
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
                  Enable WiFi
                </FormLabel>
                <FormDescription>
                  Enable or disable the WiFi interface
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client Mode</SelectItem>
                  <SelectItem value="ap">Access Point</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ssid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Network name" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="security"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select security type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="wep">WEP</SelectItem>
                  <SelectItem value="wpa2">WPA2</SelectItem>
                  <SelectItem value="wpa3">WPA3</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {form.watch("security") !== "none" && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="addressMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select address mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="dhcp">DHCP</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {form.watch("addressMode") === "static" && (
          <>
            <FormField
              control={form.control}
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="IP Address" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="netmask"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Netmask</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Netmask" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gateway"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gateway</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Gateway" />
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

