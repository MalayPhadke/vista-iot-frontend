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

const maintenanceFormSchema = z.object({
  auto_update: z.object({
    enabled: z.boolean(),
    schedule: z.string(),
    channel: z.enum(["stable", "beta", "development"])
  }),
  backup: z.object({
    enabled: z.boolean(),
    schedule: z.string(),
    retain: z.number().min(1).max(365),
    location: z.enum(["local", "remote"]),
    remote_path: z.string().optional()
  }),
  logging: z.object({
    level: z.enum(["error", "warn", "info", "debug"]),
    max_size: z.string(),
    max_files: z.number().min(1).max(100),
    remote_syslog: z.object({
      enabled: z.boolean(),
      server: z.string().optional(),
      port: z.number().min(1).max(65535).optional()
    })
  })
})

export function MaintenanceForm() {
  const { updateConfig, getConfig } = useConfigStore()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("updates")

  const form = useForm<z.infer<typeof maintenanceFormSchema>>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      auto_update: getConfig().maintenance.auto_update,
      backup: getConfig().maintenance.backup,
      logging: getConfig().logging
    }
  })

  const onSubmit = async (values: z.infer<typeof maintenanceFormSchema>) => {
    setIsSaving(true)
    try {
      // Update both maintenance and logging sections
      updateConfig(['maintenance'], {
        auto_update: values.auto_update,
        backup: values.backup
      })
      updateConfig(['logging'], values.logging)
      
      toast.success('Maintenance settings saved successfully!', {
        duration: 3000
      })
    } catch (error) {
      console.error('Error saving maintenance settings:', error)
      toast.error('Failed to save maintenance settings', {
        duration: 5000
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="updates">Auto Updates</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="logging">Logging</TabsTrigger>
          </TabsList>

          <TabsContent value="updates">
            <Card>
              <CardHeader>
                <CardTitle>Automatic Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="auto_update.enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Auto Updates</FormLabel>
                        <FormDescription>
                          Automatically update the system on schedule
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

                {form.watch("auto_update.enabled") && (
                  <>
                    <FormField
                      control={form.control}
                      name="auto_update.schedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Update Schedule (cron)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="0 0 * * 0" />
                          </FormControl>
                          <FormDescription>
                            Cron expression for update schedule
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="auto_update.channel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Update Channel</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="stable">Stable</SelectItem>
                              <SelectItem value="beta">Beta</SelectItem>
                              <SelectItem value="development">Development</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Similar structure to auto_update section */}
                <FormField
                  control={form.control}
                  name="backup.enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Automatic Backups</FormLabel>
                        <FormDescription>
                          Automatically backup system configuration
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

                {form.watch("backup.enabled") && (
                  <>
                    <FormField
                      control={form.control}
                      name="backup.schedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backup Schedule (cron)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="0 0 * * *" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="backup.retain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retention Period (days)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="backup.location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backup Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="local">Local Storage</SelectItem>
                              <SelectItem value="remote">Remote Storage</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logging">
            <Card>
              <CardHeader>
                <CardTitle>Logging Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="logging.level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Log Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select log level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="warn">Warning</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logging.max_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Log Size</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="10M" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logging.max_files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Log Files</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logging.remote_syslog.enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Remote Syslog</FormLabel>
                        <FormDescription>
                          Send logs to a remote syslog server
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

                {form.watch("logging.remote_syslog.enabled") && (
                  <>
                    <FormField
                      control={form.control}
                      name="logging.remote_syslog.server"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Syslog Server</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="syslog.example.com" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logging.remote_syslog.port"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Syslog Port</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              placeholder="514"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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