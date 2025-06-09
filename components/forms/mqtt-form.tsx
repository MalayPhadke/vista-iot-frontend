"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useConfigStore } from "@/lib/stores/configuration-store"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mqttFormSchema = z.object({
  enabled: z.boolean(),
  broker: z.object({
    address: z.string(),
    port: z.number().min(1).max(65535),
    client_id: z.string(),
    keepalive: z.number(),
    clean_session: z.boolean(),
    tls: z.object({
      enabled: z.boolean(),
      version: z.string(),
      verify_server: z.boolean(),
      allow_insecure: z.boolean(),
      cert_file: z.string().optional(),
      key_file: z.string().optional(),
      ca_file: z.string().optional()
    }),
    auth: z.object({
      enabled: z.boolean(),
      username: z.string().optional(),
      password: z.string().optional()
    })
  })
})

export function MQTTForm() {
  const { updateConfig, getConfig } = useConfigStore()

  const form = useForm<z.infer<typeof mqttFormSchema>>({
    resolver: zodResolver(mqttFormSchema),
    defaultValues: {
      enabled: getConfig().protocols.mqtt.enabled,
      broker: getConfig().protocols.mqtt.broker
    }
  })

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Enable MQTT</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value)
                    updateConfig(['protocols', 'mqtt', 'enabled'], value)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="broker.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Broker Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    updateConfig(['protocols', 'mqtt', 'broker', 'address'], e.target.value)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="broker.port"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Broker Port</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    field.onChange(value)
                    updateConfig(['protocols', 'mqtt', 'broker', 'port'], value)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="broker.client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    updateConfig(['protocols', 'mqtt', 'broker', 'client_id'], e.target.value)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="broker.keepalive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keep Alive (seconds)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    field.onChange(value)
                    updateConfig(['protocols', 'mqtt', 'broker', 'keepalive'], value)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="broker.clean_session"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Clean Session</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value)
                    updateConfig(['protocols', 'mqtt', 'broker', 'clean_session'], value)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="broker.tls.enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Enable TLS</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value)
                    updateConfig(['protocols', 'mqtt', 'broker', 'tls', 'enabled'], value)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("broker.tls.enabled") && (
          <>
            <FormField
              control={form.control}
              name="broker.tls.version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TLS Version</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateConfig(['protocols', 'mqtt', 'broker', 'tls', 'version'], value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select TLS version" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1.3">1.3</SelectItem>
                      <SelectItem value="1.2">1.2</SelectItem>
                      <SelectItem value="1.1">1.1</SelectItem>
                      <SelectItem value="1.0">1.0</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="broker.tls.verify_server"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Verify Server Certificate</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value)
                        updateConfig(['protocols', 'mqtt', 'broker', 'tls', 'verify_server'], value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="broker.tls.allow_insecure"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Allow Insecure Connection (skip CA verification)</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value)
                        updateConfig(['protocols', 'mqtt', 'broker', 'tls', 'allow_insecure'], value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="broker.tls.cert_file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Certificate File</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        updateConfig(['protocols', 'mqtt', 'broker', 'tls', 'cert_file'], e.target.value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="broker.tls.key_file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Key File</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        updateConfig(['protocols', 'mqtt', 'broker', 'tls', 'key_file'], e.target.value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="broker.tls.ca_file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CA Certificate File</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        updateConfig(['protocols', 'mqtt', 'broker', 'tls', 'ca_file'], e.target.value)
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
          name="broker.auth.enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Enable Authentication</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value)
                    updateConfig(['protocols', 'mqtt', 'broker', 'auth', 'enabled'], value)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("broker.auth.enabled") && (
          <>
            <FormField
              control={form.control}
              name="broker.auth.username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        updateConfig(['protocols', 'mqtt', 'broker', 'auth', 'username'], e.target.value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="broker.auth.password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        updateConfig(['protocols', 'mqtt', 'broker', 'auth', 'password'], e.target.value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}
      </form>
    </Form>
  )
}

