"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useConfigStore } from "@/lib/stores/configuration-store"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/components/ui/use-toast" // No longer needed

const dynamicDnsProviders = ["dyndns", "noip", "freedns", "cloudflare"] as const;

const dynamicDnsFormSchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(dynamicDnsProviders),
  domain: z.string().min(1, "Domain name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  updateInterval: z.number().min(5, "Update interval must be at least 5 minutes"),
})

type DynamicDnsFormValues = z.infer<typeof dynamicDnsFormSchema>

const defaultDynamicDnsConfig: DynamicDnsFormValues = {
  enabled: false,
  provider: "dyndns",
  domain: "",
  username: "",
  password: "",
  updateInterval: 60,
}

export function DynamicDNSForm() {
  const { updateConfig, getConfig } = useConfigStore()
  // const { toast } = useToast() // No longer needed

  const form = useForm<DynamicDnsFormValues>({
    resolver: zodResolver(dynamicDnsFormSchema),
    defaultValues: getConfig().network?.dynamicDns || defaultDynamicDnsConfig,
    mode: "onChange",
  })

  // const handleSubmit = (e: React.FormEvent) => { // Old submit handler
  //   e.preventDefault()
  //   toast({
  //     title: "Settings saved",
  //     description: "Dynamic DNS settings have been updated.",
  //   })
  // }

  const ddnsPath = ['network', 'dynamicDns']

  return (
    <Form {...form}>
      <form className="space-y-6"> {/* Removed onSubmit */}
        <Card>
          <CardHeader>
            <CardTitle>Dynamic DNS</CardTitle>
            <CardDescription>Configure Dynamic DNS service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel htmlFor="ddns-enabled">Enable Dynamic DNS</FormLabel>
                  <FormControl>
                    <Switch
                      id="ddns-enabled"
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value)
                        updateConfig([...ddnsPath, 'enabled'], value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("enabled") && (
              <>
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="ddns-provider">Service Provider</FormLabel>
                      <Select
                        onValueChange={(value: typeof dynamicDnsProviders[number]) => {
                          field.onChange(value)
                          updateConfig([...ddnsPath, 'provider'], value)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="ddns-provider">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dynamicDnsProviders.map((provider) => (
                            <SelectItem key={provider} value={provider}>
                              {provider.charAt(0).toUpperCase() + provider.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.provider && <FormDescription className="text-red-500">{form.formState.errors.provider.message}</FormDescription>}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="ddns-domain">Domain Name</FormLabel>
                      <FormControl>
                        <Input
                          id="ddns-domain"
                          placeholder="yourdomain.dyndns.org"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            updateConfig([...ddnsPath, 'domain'], e.target.value)
                          }}
                        />
                      </FormControl>
                      {form.formState.errors.domain && <FormDescription className="text-red-500">{form.formState.errors.domain.message}</FormDescription>}
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="ddns-username">Username</FormLabel>
                        <FormControl>
                          <Input
                            id="ddns-username"
                            placeholder="username"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              updateConfig([...ddnsPath, 'username'], e.target.value)
                            }}
                          />
                        </FormControl>
                        {form.formState.errors.username && <FormDescription className="text-red-500">{form.formState.errors.username.message}</FormDescription>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="ddns-password">Password</FormLabel>
                        <FormControl>
                          <Input
                            id="ddns-password"
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              updateConfig([...ddnsPath, 'password'], e.target.value)
                            }}
                          />
                        </FormControl>
                        {form.formState.errors.password && <FormDescription className="text-red-500">{form.formState.errors.password.message}</FormDescription>}
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="updateInterval"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="ddns-update">Update Interval (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          id="ddns-update"
                          type="number"
                          placeholder="60"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            field.onChange(isNaN(value) ? 0 : value)
                            if (!isNaN(value)) {
                              updateConfig([...ddnsPath, 'updateInterval'], value)
                            }
                          }}
                          value={field.value === 0 && form.getFieldState('updateInterval').isDirty ? '' : field.value}
                        />
                      </FormControl>
                      {form.formState.errors.updateInterval && <FormDescription className="text-red-500">{form.formState.errors.updateInterval.message}</FormDescription>}
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

