"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useConfigStore } from "@/lib/stores/configuration-store"
import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input" // Added for baudrate, if needed elsewhere

// Schema for a single COM port's settings, aligning with defaultConfig.hardware.com_ports.comX
const comPortSettingSchema = z.object({
  mode: z.enum(["rs232", "rs485", "rs422"]), // Assuming these modes
  baudrate: z.number(),
  data_bits: z.enum(["7", "8"]),
  parity: z.enum(["none", "even", "odd"]),
  stop_bits: z.enum(["1", "2"]),
  flow_control: z.enum(["none", "rts/cts", "xon/xoff"]),
});

type ComPortSettingValues = z.infer<typeof comPortSettingSchema>;

// Get available COM port IDs from defaultConfig (e.g., ["com1", "com2"])
// This is a simplified approach; in a real app, this might come from a dynamic source or be more robust.
const comPortIds = Object.keys(useConfigStore.getState().getConfig().hardware.com_ports) as (keyof typeof useConfigStore.getState().getConfig().hardware.com_ports)[];


export function ComPortsForm() {
  // const { toast } = useToast() // Removed
  const { updateConfig, getConfig } = useConfigStore();
  const [selectedComPortId, setSelectedComPortId] = useState<string>(comPortIds[0] || "");

  const form = useForm<ComPortSettingValues>({
    resolver: zodResolver(comPortSettingSchema),
    // Default values will be set by useEffect/reset
  });

  useEffect(() => {
    if (selectedComPortId) {
      const comPortConfig = getConfig().hardware.com_ports[selectedComPortId as keyof typeof getConfig().hardware.com_ports];
      if (comPortConfig) {
        form.reset({
          ...comPortConfig,
          // Ensure string values for enum fields if schema expects strings from numbers
          data_bits: String(comPortConfig.data_bits) as "7" | "8",
          stop_bits: String(comPortConfig.stop_bits) as "1" | "2",
        });
      }
    }
  }, [selectedComPortId, getConfig, form]);

  // function onSubmit(values: ComPortSettingValues) { // Removed
  //   toast({
  //     title: "COM Port settings updated",
  //     description: `Settings for ${selectedComPortId} have been configured.`,
  //   })
  //   // console.log(selectedComPortId, values)
  // }

  const handleFieldUpdate = (fieldName: keyof ComPortSettingValues, value: any) => {
    if (!selectedComPortId) return;

    let processedValue = value;
    if (fieldName === 'baudrate') {
      processedValue = parseInt(value, 10);
      if (isNaN(processedValue)) {
        // Attempt to fallback to existing value or a default if parsing fails
        // This might be an issue if user clears the field, then it becomes NaN
        // RHF's field.onChange(NaN) might also cause issues if not handled by Zod schema (e.g. .optional().default(default_baud))
        processedValue = getConfig().hardware.com_ports[selectedComPortId as keyof typeof getConfig().hardware.com_ports]?.baudrate ?? 9600;
      }
    } else if ((fieldName === 'data_bits' || fieldName === 'stop_bits') && typeof value === 'string') {
      // Convert to number for storage, as defaultConfig uses numbers for these
      processedValue = parseInt(value, 10);
    }


    updateConfig(['hardware', 'com_ports', selectedComPortId, fieldName], processedValue);
  };


  const renderComPortFields = () => (
    <div className="space-y-6 p-1"> {/* Reduced padding for fields */}
      <FormField
        control={form.control}
        name="mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mode</FormLabel>
            <Select
              onValueChange={(value) => { field.onChange(value); handleFieldUpdate("mode", value); }}
              value={field.value} // Changed from defaultValue
            >
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="rs232">RS232</SelectItem>
                <SelectItem value="rs485">RS485</SelectItem>
                <SelectItem value="rs422">RS422</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="baudrate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Baud Rate</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => {
                  field.onChange(parseInt(e.target.value,10)); // RHF needs number
                  handleFieldUpdate("baudrate", parseInt(e.target.value,10));
                }}
                value={field.value} // Ensure value is controlled
              />
            </FormControl>
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="data_bits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data Bits</FormLabel>
            <Select
              onValueChange={(value) => { field.onChange(value); handleFieldUpdate("data_bits", value);}}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Data bits" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="parity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parity</FormLabel>
            <Select
              onValueChange={(value) => { field.onChange(value); handleFieldUpdate("parity", value);}}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select parity" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="even">Even</SelectItem>
                <SelectItem value="odd">Odd</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stop_bits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stop Bits</FormLabel>
            <Select
              onValueChange={(value) => { field.onChange(value); handleFieldUpdate("stop_bits", value);}}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Stop bits" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="flow_control"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Flow Control</FormLabel>
            <Select
              onValueChange={(value) => { field.onChange(value); handleFieldUpdate("flow_control", value);}}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Flow control" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="rts/cts">RTS/CTS</SelectItem>
                <SelectItem value="xon/xoff">XON/XOFF</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );

  if (!selectedComPortId && comPortIds.length > 0) {
    // Auto-select the first COM port if none is selected and ports are available
    setSelectedComPortId(comPortIds[0]);
    return <div>Loading COM port data...</div>; // Or a loading spinner
  }

  if (comPortIds.length === 0) {
    return <Card><CardHeader><CardTitle>COM Ports</CardTitle></CardHeader><CardContent><p>No COM ports defined in configuration.</p></CardContent></Card>;
  }


  return (
    <Form {...form}>
      <div className="space-y-6"> {/* Removed form onSubmit */}
        <Tabs value={selectedComPortId} onValueChange={setSelectedComPortId} className="w-full">
          <TabsList>
            {comPortIds.map((portId) => (
              <TabsTrigger key={portId} value={portId}>
                {portId.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
          {comPortIds.map((portId) => (
            <TabsContent key={portId} value={portId}>
              <Card>
                <CardHeader>
                  <CardTitle>{portId.toUpperCase()} Settings</CardTitle>
                  <CardDescription>Configure parameters for {portId.toUpperCase()}. Changes are saved in real-time.</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedComPortId === portId ? renderComPortFields() : <p>Select this tab to view settings.</p>}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        {/* Save Changes Button Removed */}
        {/* <Button type="submit">Save Changes</Button> */}
      </div>
    </Form>
  )
}