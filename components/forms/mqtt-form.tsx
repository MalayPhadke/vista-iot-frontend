"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useConfigStore } from "@/lib/stores/configuration-store"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"

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
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof mqttFormSchema>>({
    resolver: zodResolver(mqttFormSchema),
    defaultValues: {
      enabled: getConfig().protocols.mqtt.enabled,
      broker: getConfig().protocols.mqtt.broker
    }
  })

  const onSubmit = async (values: z.infer<typeof mqttFormSchema>) => {
    setIsSaving(true)
    try {
      updateConfig(['protocols', 'mqtt'], values)
      toast.success('MQTT settings saved successfully!', {
        duration: 3000
      })
    } catch (error) {
      console.error('Error saving MQTT settings:', error)
      toast.error('Failed to save MQTT settings', {
        duration: 5000
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Enable MQTT</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Add more form fields here */}

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

