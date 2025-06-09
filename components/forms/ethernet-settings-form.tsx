"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useConfigStore } from "@/lib/stores/configuration-store"
// import { useState } from "react" // Removed isSaving
// import { RefreshCw } from "lucide-react" // Removed
// import { toast } from "sonner" // Removed

const ethernetFormSchema = z.object({
  enabled: z.boolean(),
  // mode: z.enum(["dhcp", "static"]), // Moved to ipv4.mode
  ipv4: z.object({
    mode: z.enum(["dhcp", "static"]),
    static: z.object({
      address: z.string().optional(),
      netmask: z.string().optional(),
      gateway: z.string().optional()
    }),
    dns: z.object({
      primary: z.string().optional(),
      secondary: z.string().optional()
    })
  }),
  link: z.object({
    speed: z.enum(["auto", "10", "100", "1000"]),
    duplex: z.enum(["auto", "full", "half"])
  })
})

export function EthernetSettingsForm() {
  const { updateConfig, getConfig } = useConfigStore()
  // const [isSaving, setIsSaving] = useState(false) // Removed
  const interfacePath = ['network', 'interfaces', 'eth0'] // Define base path for eth0

  const form = useForm<z.infer<typeof ethernetFormSchema>>({
    resolver: zodResolver(ethernetFormSchema),
    defaultValues: {
      enabled: getConfig().network.interfaces.eth0.enabled,
      ipv4: { // mode is now nested here
        mode: getConfig().network.interfaces.eth0.ipv4.mode,
        static: getConfig().network.interfaces.eth0.ipv4.static,
        dns: getConfig().network.interfaces.eth0.ipv4.dns,
      },
      link: getConfig().network.interfaces.eth0.link
    },
    mode: "onChange",
  })

  // const onSubmit = async (values: z.infer<typeof ethernetFormSchema>) => { // Removed
  //   setIsSaving(true)
  //   try {
  //     // Construct the payload carefully if mode was at root
  //     const payload = {
  //       ...getConfig().network.interfaces.eth0,
  //       enabled: values.enabled,
  //       link: values.link,
  //       ipv4: {
  //         ...getConfig().network.interfaces.eth0.ipv4,
  //         mode: values.ipv4.mode, // Assuming mode is now correctly under ipv4 in form values
  //         static: values.ipv4.static,
  //         dns: values.ipv4.dns,
  //       }
  //     };
  //     updateConfig(interfacePath, payload)
      
  //     toast.success('Ethernet settings saved successfully!', {
  //       duration: 3000
  //     })
  //   } catch (error) {
  //     console.error('Error saving ethernet settings:', error)
  //     toast.error('Failed to save ethernet settings', {
  //       duration: 5000
  //     })
  //   } finally {
  //     setIsSaving(false)
  //   }
  // }

  return (
    <Form {...form}>
      <form className="space-y-6"> {/* Removed onSubmit */}
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Enable Interface</FormLabel>
                <FormDescription>
                  Enable or disable the ethernet interface
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value)
                    updateConfig([...interfacePath, 'enabled'], value)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ipv4.mode" // Updated name
          render={({ field }) => (
            <FormItem>
              <FormLabel>IP Configuration Mode</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  updateConfig([...interfacePath, 'ipv4', 'mode'], value)
                }}
                defaultValue={field.value}
              >
                <FormControl> {/* Added FormControl for SelectTrigger */}
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dhcp">DHCP</SelectItem>
                  <SelectItem value="static">Static IP</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {form.watch("ipv4.mode") === "static" && ( // Updated watch path
          <>
            <FormField
              control={form.control}
              name="ipv4.static.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="192.168.1.100"
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        updateConfig([...interfacePath, 'ipv4', 'static', 'address'], e.target.value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ipv4.static.netmask"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subnet Mask</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="255.255.255.0"
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        updateConfig([...interfacePath, 'ipv4', 'static', 'netmask'], e.target.value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ipv4.static.gateway"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gateway</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="192.168.1.1"
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        updateConfig([...interfacePath, 'ipv4', 'static', 'gateway'], e.target.value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="ipv4.dns.primary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary DNS</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="8.8.8.8"
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        updateConfig([...interfacePath, 'ipv4', 'dns', 'primary'], e.target.value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ipv4.dns.secondary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary DNS</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="8.8.4.4"
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        updateConfig([...interfacePath, 'ipv4', 'dns', 'secondary'], e.target.value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="link.speed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Speed</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  updateConfig([...interfacePath, 'link', 'speed'], value)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select speed" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="10">10 Mbps</SelectItem>
                  <SelectItem value="100">100 Mbps</SelectItem>
                  <SelectItem value="1000">1 Gbps</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link.duplex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duplex Mode</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  updateConfig([...interfacePath, 'link', 'duplex'], value)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duplex mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="half">Half</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* <Button type="submit" disabled={isSaving}> // Removed
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button> */}
      </form>
    </Form>
  )
}