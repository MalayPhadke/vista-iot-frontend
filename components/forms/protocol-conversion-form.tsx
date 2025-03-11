"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"

export function ProtocolConversionForm() {
  const { toast } = useToast()

  const handleAddMapping = () => {
    toast({
      title: "Mapping added",
      description: "A new protocol conversion mapping has been added.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protocol Conversion</CardTitle>
        <CardDescription>Configure protocol conversion mappings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Source Protocol</TableHead>
              <TableHead>Source Address</TableHead>
              <TableHead>Target Protocol</TableHead>
              <TableHead>Target Address</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Modbus to DNP3</TableCell>
              <TableCell>Modbus TCP</TableCell>
              <TableCell>Register 100-120</TableCell>
              <TableCell>DNP3</TableCell>
              <TableCell>Points 0-20</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IEC to OPC-UA</TableCell>
              <TableCell>IEC 60870-5-104</TableCell>
              <TableCell>IOA 1000-1050</TableCell>
              <TableCell>OPC-UA</TableCell>
              <TableCell>Node 1.sensor.values</TableCell>
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
        <Button onClick={handleAddMapping}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Mapping
        </Button>
      </CardFooter>
    </Card>
  )
}

