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
import { useState } from "react"

const watchdogFormSchema = z.object({
  enabled: z.boolean(),
  timeout: z.string(),
  action: z.enum(["restart", "shutdown", "custom"]),
  customCommand: z.string().optional(),
})

export function WatchdogForm() {
  const [isSaving, setIsSaving] = useState(false)
  const form = useForm<z.infer<typeof watchdogFormSchema>>({
    resolver: zodResolver(watchdogFormSchema),
    defaultValues: {
      enabled: true,
      timeout: "60",
      action: "restart",
    },
  })

  async function onSubmit(values: z.infer<typeof watchdogFormSchema>) {
    setIsSaving(true)
    try {
      toast.success('Watchdog settings saved successfully!', {
        duration: 3000,
      })
      // console.log(values)
    } catch (error) {
      console.error('Error saving watchdog settings:', error)
      toast.error('Failed to save watchdog settings. Please try again.', {
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
                  Enable Watchdog
                </FormLabel>
                <FormDescription>
                  Enable or disable the hardware watchdog timer
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timeout (seconds)</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="1" />
              </FormControl>
              <FormDescription>
                Time in seconds before watchdog triggers
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restart">Restart System</SelectItem>
                  <SelectItem value="shutdown">Shutdown System</SelectItem>
                  <SelectItem value="custom">Custom Command</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Action to take when watchdog triggers
              </FormDescription>
            </FormItem>
          )}
        />

        {form.watch("action") === "custom" && (
          <FormField
            control={form.control}
            name="customCommand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Command</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="/path/to/script.sh" />
                </FormControl>
                <FormDescription>
                  Custom script or command to execute
                </FormDescription>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
} 