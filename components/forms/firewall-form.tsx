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

const firewallRuleSchema = z.object({
  id: z.string().optional(), // Optional: for useFieldArray key, might not be in actual config
  name: z.string().min(1, "Name is required"),
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  protocol: z.enum(["tcp", "udp", "icmp", "any"]),
  port: z.string().optional(),
  action: z.enum(["accept", "drop", "reject"]),
});

const firewallFormSchema = z.object({
  enabled: z.boolean(),
  default_policy: z.enum(["accept", "drop", "reject"]),
  rules: z.array(firewallRuleSchema),
})

type FirewallFormValues = z.infer<typeof firewallFormSchema>
type FirewallRule = z.infer<typeof firewallRuleSchema>

const defaultFirewallConfig: FirewallFormValues = {
  enabled: true,
  default_policy: "drop",
  rules: [],
}

const defaultRule: FirewallRule = {
  name: "New Rule",
  source: "any",
  destination: "any",
  protocol: "any",
  port: "",
  action: "accept",
}

export function FirewallForm() {
  const { updateConfig, getConfig } = useConfigStore()
  // const { toast } = useToast() // Removed

  const form = useForm<FirewallFormValues>({
    resolver: zodResolver(firewallFormSchema),
    defaultValues: getConfig().network?.firewall || defaultFirewallConfig,
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  })

  const firewallPath = ['network', 'firewall']

  const handleAddRule = () => {
    const newRule = { ...defaultRule, id: `rule-${Date.now()}` }; // Add unique id for key
    append(newRule);
    const updatedRules = [...form.getValues('rules'), newRule];
    updateConfig([...firewallPath, 'rules'], updatedRules.map(r => ({...r, id: undefined}))); // Don't save temp id
    // toast({ title: "Rule added", description: "A new firewall rule has been added." }) // Removed
  }

  const handleRemoveRule = (index: number) => {
    remove(index);
    const updatedRules = form.getValues('rules').filter((_, i) => i !== index);
    updateConfig([...firewallPath, 'rules'], updatedRules.map(r => ({...r, id: undefined})));
    // toast({ title: "Rule removed", description: "Firewall rule has been removed." }) // Removed
  }

  // Helper to update a specific field in a rule
  const updateRuleField = (index: number, fieldName: keyof FirewallRule, value: any) => {
    const fullPath = [...firewallPath, 'rules', index, fieldName] as const;
    // console.log(`Updating rule field: ${fullPath.join('.')} to ${value}`);
    updateConfig(fullPath, value);
  };


  return (
    <Form {...form}>
      <div className="space-y-6"> {/* Removed form onSubmit */}
        <Card>
          <CardHeader>
            <CardTitle>Firewall Settings</CardTitle>
            <CardDescription>Enable firewall and set default traffic policy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Firewall</FormLabel>
                    <FormDescription>
                      Globally enable or disable the firewall.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value)
                        updateConfig([...firewallPath, 'enabled'], value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="default_policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Policy</FormLabel>
                  <Select
                    onValueChange={(value: "accept" | "drop" | "reject") => {
                      field.onChange(value)
                      updateConfig([...firewallPath, 'default_policy'], value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="accept">Accept</SelectItem>
                      <SelectItem value="drop">Drop</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Default action for traffic not matching any rule.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
          {/* <CardFooter> // Save Policies button removed
            <Button>Save Policies</Button>
          </CardFooter> */}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Firewall Rules</CardTitle>
            <CardDescription>Configure custom firewall rules. Changes are applied immediately.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Action</TableHead>
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
                            placeholder="Rule name"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`rules.${index}.source`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateRuleField(index, 'source', e.target.value);
                            }}
                            placeholder="any"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`rules.${index}.destination`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateRuleField(index, 'destination', e.target.value);
                            }}
                            placeholder="any"
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
                            onValueChange={(value: "tcp" | "udp" | "icmp" | "any") => {
                              field.onChange(value);
                              updateRuleField(index, 'protocol', value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="tcp">TCP</SelectItem>
                              <SelectItem value="udp">UDP</SelectItem>
                              <SelectItem value="icmp">ICMP</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`rules.${index}.port`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateRuleField(index, 'port', e.target.value);
                            }}
                            placeholder="e.g., 80, 443"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`rules.${index}.action`}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value: "accept" | "drop" | "reject") => {
                              field.onChange(value);
                              updateRuleField(index, 'action', value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="accept">Accept</SelectItem>
                              <SelectItem value="drop">Drop</SelectItem>
                              <SelectItem value="reject">Reject</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
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
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddRule}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Form>
  )
}

