"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useConfigStore } from "@/lib/stores/configuration-store"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"

const MAC_ADDRESS_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

const ipBindingEntrySchema = z.object({
  id: z.string().optional(), // For useFieldArray key
  name: z.string().optional(),
  ipAddress: z.string().ip({ message: "Invalid IP address" }),
  macAddress: z.string().regex(MAC_ADDRESS_REGEX, { message: "Invalid MAC address" }),
  interface: z.string().optional(),
});

const ipBindingFormSchema = z.object({
  enabled: z.boolean(),
  bindings: z.array(ipBindingEntrySchema),
});

type IPBindingFormValues = z.infer<typeof ipBindingFormSchema>;
type IPBindingEntry = z.infer<typeof ipBindingEntrySchema>;

const defaultIPBindingConfig: IPBindingFormValues = {
  enabled: false,
  bindings: [],
};

const defaultBindingEntry: Omit<IPBindingEntry, 'id'> = {
  name: "",
  ipAddress: "",
  macAddress: "",
  interface: "eth0", // Default interface
};

export function IPBindingForm() {
  const { updateConfig, getConfig } = useConfigStore();
  // const { toast } = useToast(); // Removed

  const form = useForm<IPBindingFormValues>({
    resolver: zodResolver(ipBindingFormSchema),
    defaultValues: getConfig().network?.ipMacBindings || defaultIPBindingConfig,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bindings",
  });

  const ipMacBindingsPath = ['network', 'ipMacBindings'];

  const handleAddBinding = () => {
    const newEntry = { ...defaultBindingEntry, id: `binding-${Date.now()}` };
    append(newEntry);
    const updatedBindings = [...form.getValues('bindings'), newEntry];
    // Remove temporary 'id' before updating config store if it's not part of actual config schema
    updateConfig([...ipMacBindingsPath, 'bindings'], updatedBindings.map(b => ({...b, id: undefined })));
  };

  const handleRemoveBinding = (index: number) => {
    remove(index);
    const updatedBindings = form.getValues('bindings').filter((_, i) => i !== index);
    updateConfig([...ipMacBindingsPath, 'bindings'], updatedBindings.map(b => ({...b, id: undefined })));
  };

  const updateBindingField = (index: number, fieldName: keyof Omit<IPBindingEntry, 'id'>, value: any) => {
    const fullPath = [...ipMacBindingsPath, 'bindings', index, fieldName] as const;
    updateConfig(fullPath, value);
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>IP-MAC Binding</CardTitle>
            <CardDescription>
              Bind IP addresses to specific MAC addresses. This ensures a device always receives the same IP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable IP-MAC Binding</FormLabel>
                    <FormDescription>
                      Globally enable or disable IP-MAC binding.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        updateConfig([...ipMacBindingsPath, 'enabled'], value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("enabled") && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Name</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>MAC Address</TableHead>
                    <TableHead>Interface</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`bindings.${index}.name`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateBindingField(index, 'name', e.target.value);
                              }}
                              placeholder="e.g., Server 1"
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`bindings.${index}.ipAddress`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateBindingField(index, 'ipAddress', e.target.value);
                              }}
                              placeholder="192.168.1.10"
                            />
                          )}
                        />
                         {form.formState.errors.bindings?.[index]?.ipAddress && <FormDescription className="text-red-500">{form.formState.errors.bindings[index].ipAddress.message}</FormDescription>}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`bindings.${index}.macAddress`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateBindingField(index, 'macAddress', e.target.value);
                              }}
                              placeholder="00:1A:2B:3C:4D:5E"
                            />
                          )}
                        />
                        {form.formState.errors.bindings?.[index]?.macAddress && <FormDescription className="text-red-500">{form.formState.errors.bindings[index].macAddress.message}</FormDescription>}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`bindings.${index}.interface`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateBindingField(index, 'interface', e.target.value);
                              }}
                              placeholder="eth0"
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveBinding(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {form.watch("enabled") && (
            <CardFooter>
              <Button onClick={handleAddBinding}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Binding
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Form>
  );
}

