"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useConfigStore } from "@/lib/stores/configuration-store"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/components/ui/use-toast" // No longer needed for save

const dhcpServerFormSchema = z.object({
  enabled: z.boolean(),
  startIP: z.string().ip({ message: "Invalid IP address" }),
  endIP: z.string().ip({ message: "Invalid IP address" }),
  leaseTime: z.number().min(1, { message: "Lease time must be at least 1 hour" }),
  domain: z.string().optional(),
  dnsServers: z.string().optional(), // Assuming comma-separated string for now
})

type DhcpServerFormValues = z.infer<typeof dhcpServerFormSchema>

// Define a default structure for DHCP server config if not present in global config
const defaultDhcpServerConfig: DhcpServerFormValues = {
  enabled: false,
  startIP: "192.168.1.100",
  endIP: "192.168.1.200",
  leaseTime: 24,
  domain: "local",
  dnsServers: "8.8.8.8,8.8.4.4",
}

export function DHCPServerForm() {
  const { updateConfig, getConfig } = useConfigStore()
  // const { toast } = useToast() // No longer needed

  const form = useForm<DhcpServerFormValues>({
    resolver: zodResolver(dhcpServerFormSchema),
    defaultValues: getConfig().network?.dhcpServer || defaultDhcpServerConfig,
    mode: "onChange", // Or "onBlur" for validation trigger
  })

  // const handleSubmit = (e: React.FormEvent) => { // Old submit handler
  //   e.preventDefault()
  //   toast({
  //     title: "Settings saved",
  //     description: "DHCP server settings have been updated.",
  //   })
  // }

  const dhcpServerPath = ['network', 'dhcpServer']

  return (
    <Form {...form}>
      <form className="space-y-6"> {/* Removed onSubmit */}
        <Card>
          <CardHeader>
            <CardTitle>DHCP Server</CardTitle>
            <CardDescription>Configure DHCP server settings for the LAN</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel htmlFor="dhcp-enabled">Enable DHCP Server</FormLabel>
                  <FormControl>
                    <Switch
                      id="dhcp-enabled"
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value)
                        updateConfig([...dhcpServerPath, 'enabled'], value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("enabled") && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startIP"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="start-ip">Start IP Address</FormLabel>
                        <FormControl>
                          <Input
                            id="start-ip"
                            placeholder="10.0.0.100"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              updateConfig([...dhcpServerPath, 'startIP'], e.target.value)
                            }}
                          />
                        </FormControl>
                        {form.formState.errors.startIP && <FormDescription className="text-red-500">{form.formState.errors.startIP.message}</FormDescription>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endIP"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="end-ip">End IP Address</FormLabel>
                        <FormControl>
                          <Input
                            id="end-ip"
                            placeholder="10.0.0.200"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              updateConfig([...dhcpServerPath, 'endIP'], e.target.value)
                            }}
                          />
                        </FormControl>
                        {form.formState.errors.endIP && <FormDescription className="text-red-500">{form.formState.errors.endIP.message}</FormDescription>}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="leaseTime"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="lease-time">Lease Time (hours)</FormLabel>
                        <FormControl>
                          <Input
                            id="lease-time"
                            placeholder="24"
                            type="number"
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value)
                              field.onChange(isNaN(value) ? 0 : value) // handle NaN if input is cleared
                              if (!isNaN(value)) {
                                updateConfig([...dhcpServerPath, 'leaseTime'], value)
                              }
                            }}
                            value={field.value === 0 && form.getFieldState('leaseTime').isDirty ? '' : field.value} // Show empty string if user clears input
                          />
                        </FormControl>
                        {form.formState.errors.leaseTime && <FormDescription className="text-red-500">{form.formState.errors.leaseTime.message}</FormDescription>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="domain">Domain Name</FormLabel>
                        <FormControl>
                          <Input
                            id="domain"
                            placeholder="local"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              updateConfig([...dhcpServerPath, 'domain'], e.target.value)
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dnsServers"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="dns">DNS Servers (comma separated)</FormLabel>
                      <FormControl>
                        <Input
                          id="dns"
                          placeholder="8.8.8.8, 8.8.4.4"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            updateConfig([...dhcpServerPath, 'dnsServers'], e.target.value)
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
          {/* <CardFooter> // Save button removed
            <Button type="submit">Save Changes</Button>
          </CardFooter> */}
        </Card>
      </form>
    </Form>
  )
}

