"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useConfigStore } from "@/lib/stores/configuration-store"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"

const portRegex = /^\d+(-\d+)?$/;
const portValidation = z.string().refine(val => {
    if (!portRegex.test(val)) return false;
    const parts = val.split('-');
    const firstPart = parseInt(parts[0], 10);
    if (firstPart <= 0 || firstPart > 65535) return false;
    if (parts.length > 1) {
        const secondPart = parseInt(parts[1], 10);
        if (secondPart <= 0 || secondPart > 65535 || secondPart <= firstPart) return false;
    }
    return true;
}, { message: "Invalid port or range (1-65535)" });


const portForwardingRuleSchema = z.object({
  id: z.string().optional(), // For useFieldArray key
  name: z.string().optional(),
  protocol: z.enum(["tcp", "udp", "both"]),
  externalPort: portValidation,
  internalIp: z.string().ip({ message: "Invalid IP address" }),
  internalPort: portValidation,
});

const portForwardingFormSchema = z.object({
  enabled: z.boolean(),
  rules: z.array(portForwardingRuleSchema),
});

type PortForwardingFormValues = z.infer<typeof portForwardingFormSchema>;
type PortForwardingRule = z.infer<typeof portForwardingRuleSchema>;

const defaultPortForwardingConfig: PortForwardingFormValues = {
  enabled: false,
  rules: [],
};

const defaultRuleEntry: Omit<PortForwardingRule, 'id'> = {
  name: "New Rule",
  protocol: "tcp",
  externalPort: "80",
  internalIp: "192.168.1.100",
  internalPort: "80",
};

export function PortForwardingForm() {
  const { updateConfig, getConfig } = useConfigStore();
  // const { toast } = useToast(); // Removed

  const form = useForm<PortForwardingFormValues>({
    resolver: zodResolver(portForwardingFormSchema),
    defaultValues: getConfig().network?.portForwarding || defaultPortForwardingConfig,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const portForwardingPath = ['network', 'portForwarding'];

  const handleAddRule = () => {
    const newEntry = { ...defaultRuleEntry, id: `rule-${Date.now()}` };
    append(newEntry);
    const updatedRules = [...form.getValues('rules'), newEntry];
    updateConfig([...portForwardingPath, 'rules'], updatedRules.map(r => ({...r, id: undefined })));
  };

  const handleRemoveRule = (index: number) => {
    remove(index);
    const updatedRules = form.getValues('rules').filter((_, i) => i !== index);
    updateConfig([...portForwardingPath, 'rules'], updatedRules.map(r => ({...r, id: undefined })));
  };

  const updateRuleField = (index: number, fieldName: keyof Omit<PortForwardingRule, 'id'>, value: any) => {
    const fullPath = [...portForwardingPath, 'rules', index, fieldName] as const;
    updateConfig(fullPath, value);
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Port Forwarding</CardTitle>
            <CardDescription>
              Configure port forwarding rules to allow external access to services on your internal network.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Port Forwarding</FormLabel>
                    <FormDescription>
                      Globally enable or disable port forwarding.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        updateConfig([...portForwardingPath, 'enabled'], value);
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
                    <TableHead>Protocol</TableHead>
                    <TableHead>External Port</TableHead>
                    <TableHead>Internal IP</TableHead>
                    <TableHead>Internal Port</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rules.${index}.name`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateRuleField(index, 'name', e.target.value);
                              }}
                              placeholder="e.g., Web Server"
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rules.${index}.protocol`}
                          render={({ field }) => (
                            <Select
                              onValueChange={(value: "tcp" | "udp" | "both") => {
                                field.onChange(value);
                                updateRuleField(index, 'protocol', value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="tcp">TCP</SelectItem>
                                <SelectItem value="udp">UDP</SelectItem>
                                <SelectItem value="both">TCP/UDP</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rules.${index}.externalPort`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateRuleField(index, 'externalPort', e.target.value);
                              }}
                              placeholder="e.g., 80 or 80-90"
                            />
                          )}
                        />
                        {form.formState.errors.rules?.[index]?.externalPort && <FormDescription className="text-red-500">{form.formState.errors.rules[index].externalPort.message}</FormDescription>}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rules.${index}.internalIp`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateRuleField(index, 'internalIp', e.target.value);
                              }}
                              placeholder="192.168.1.100"
                            />
                          )}
                        />
                        {form.formState.errors.rules?.[index]?.internalIp && <FormDescription className="text-red-500">{form.formState.errors.rules[index].internalIp.message}</FormDescription>}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`rules.${index}.internalPort`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateRuleField(index, 'internalPort', e.target.value);
                              }}
                              placeholder="e.g., 80"
                            />
                          )}
                        />
                        {form.formState.errors.rules?.[index]?.internalPort && <FormDescription className="text-red-500">{form.formState.errors.rules[index].internalPort.message}</FormDescription>}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRule(index)}>
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
              <Button onClick={handleAddRule}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Form>
  );
}

