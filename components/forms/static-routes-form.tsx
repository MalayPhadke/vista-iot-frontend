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

const staticRouteEntrySchema = z.object({
  id: z.string().optional(), // For useFieldArray key
  name: z.string().optional(),
  destination: z.string().ip({ message: "Invalid destination IP" }),
  netmask: z.string().ip({ message: "Invalid netmask" }),
  gateway: z.string().ip({ message: "Invalid gateway IP" }),
  interface: z.string().min(1, "Interface is required"),
  metric: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)), // Convert empty string to undefined for optional number
    z.number().min(0, "Metric must be 0 or greater").optional()
  ),
});

const staticRoutesFormSchema = z.object({
  enabled: z.boolean(), // Global enable/disable for static routes feature
  routes: z.array(staticRouteEntrySchema),
});

type StaticRoutesFormValues = z.infer<typeof staticRoutesFormSchema>;
type StaticRouteEntry = z.infer<typeof staticRouteEntrySchema>;

const defaultStaticRoutesConfig: StaticRoutesFormValues = {
  enabled: false,
  routes: [],
};

const defaultRouteEntry: Omit<StaticRouteEntry, 'id'> = {
  name: "New Route",
  destination: "0.0.0.0",
  netmask: "0.0.0.0",
  gateway: "192.168.1.1",
  interface: "eth0",
  metric: 10,
};

export function StaticRoutesForm() {
  const { updateConfig, getConfig } = useConfigStore();
  // const { toast } = useToast(); // Removed

  const form = useForm<StaticRoutesFormValues>({
    resolver: zodResolver(staticRoutesFormSchema),
    defaultValues: getConfig().network?.staticRoutes || defaultStaticRoutesConfig,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "routes",
  });

  const staticRoutesPath = ['network', 'staticRoutes'];

  const handleAddRoute = () => {
    const newEntry = { ...defaultRouteEntry, id: `route-${Date.now()}` };
    append(newEntry);
    const updatedRoutes = [...form.getValues('routes'), newEntry];
    updateConfig([...staticRoutesPath, 'routes'], updatedRoutes.map(r => ({...r, id: undefined })));
  };

  const handleRemoveRoute = (index: number) => {
    remove(index);
    const updatedRoutes = form.getValues('routes').filter((_, i) => i !== index);
    updateConfig([...staticRoutesPath, 'routes'], updatedRoutes.map(r => ({...r, id: undefined })));
  };

  const updateRouteField = (index: number, fieldName: keyof Omit<StaticRouteEntry, 'id'>, value: any) => {
    const fullPath = [...staticRoutesPath, 'routes', index, fieldName] as const;
    updateConfig(fullPath, value);
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Static Routes</CardTitle>
            <CardDescription>
              Configure static routing table entries for specific network paths.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Static Routing</FormLabel>
                    <FormDescription>
                      Globally enable or disable static routes.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        updateConfig([...staticRoutesPath, 'enabled'], value);
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
                    <TableHead>Destination</TableHead>
                    <TableHead>Netmask</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Interface</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`routes.${index}.name`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateRouteField(index, 'name', e.target.value);
                              }}
                              placeholder="e.g., LAN2 Access"
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`routes.${index}.destination`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateRouteField(index, 'destination', e.target.value);
                              }}
                              placeholder="192.168.2.0"
                            />
                          )}
                        />
                        {form.formState.errors.routes?.[index]?.destination && <FormDescription className="text-red-500">{form.formState.errors.routes[index].destination.message}</FormDescription>}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`routes.${index}.netmask`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateRouteField(index, 'netmask', e.target.value);
                              }}
                              placeholder="255.255.255.0"
                            />
                          )}
                        />
                        {form.formState.errors.routes?.[index]?.netmask && <FormDescription className="text-red-500">{form.formState.errors.routes[index].netmask.message}</FormDescription>}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`routes.${index}.gateway`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateRouteField(index, 'gateway', e.target.value);
                              }}
                              placeholder="192.168.1.1"
                            />
                          )}
                        />
                        {form.formState.errors.routes?.[index]?.gateway && <FormDescription className="text-red-500">{form.formState.errors.routes[index].gateway.message}</FormDescription>}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`routes.${index}.interface`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateRouteField(index, 'interface', e.target.value);
                              }}
                              placeholder="eth0"
                            />
                          )}
                        />
                         {form.formState.errors.routes?.[index]?.interface && <FormDescription className="text-red-500">{form.formState.errors.routes[index].interface.message}</FormDescription>}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`routes.${index}.metric`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(val === "" ? undefined : Number(val)); // Allow clearing optional field
                                updateRouteField(index, 'metric', val === "" ? undefined : Number(val));
                              }}
                              placeholder="10"
                              value={field.value ?? ""} // Handle undefined for controlled component
                            />
                          )}
                        />
                        {form.formState.errors.routes?.[index]?.metric && <FormDescription className="text-red-500">{form.formState.errors.routes[index].metric.message}</FormDescription>}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRoute(index)}>
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
              <Button onClick={handleAddRoute}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Form>
  );
}

