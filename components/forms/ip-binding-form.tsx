"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"

export function IPBindingForm() {
  const { toast } = useToast()

  const handleAddBinding = () => {
    toast({
      title: "Binding added",
      description: "A new IP-MAC binding has been added.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>IP-MAC Binding</CardTitle>
        <CardDescription>Bind IP addresses to specific MAC addresses</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>MAC Address</TableHead>
              <TableHead>Interface</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Server 1</TableCell>
              <TableCell>10.0.0.10</TableCell>
              <TableCell>00:11:22:33:44:55</TableCell>
              <TableCell>eth1</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PLC Device</TableCell>
              <TableCell>10.0.0.20</TableCell>
              <TableCell>AA:BB:CC:DD:EE:FF</TableCell>
              <TableCell>eth1</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddBinding}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Binding
        </Button>
      </CardFooter>
    </Card>
  )
}

