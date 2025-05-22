"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const comPortFormSchema = z.object({
  port: z.string(),
  baudRate: z.string(),
  dataBits: z.string(),
  stopBits: z.string(),
  parity: z.string(),
  flowControl: z.string(),
})

export function ComPortsForm() {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof comPortFormSchema>>({
    resolver: zodResolver(comPortFormSchema),
    defaultValues: {
      port: "COM1",
      baudRate: "9600",
      dataBits: "8",
      stopBits: "1",
      parity: "none",
      flowControl: "none",
    },
  })

  function onSubmit(values: z.infer<typeof comPortFormSchema>) {
    toast({
      title: "COM Port settings updated",
      description: "The serial port has been configured successfully.",
    })
    // console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Add form fields for COM port configuration */}
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  )
} 