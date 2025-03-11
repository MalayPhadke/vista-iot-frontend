"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"

export function DataMappingForm() {
  const { toast } = useToast()

  const handleAddMapping = () => {
    toast({
      title: "Mapping added",
      description: "A new data point mapping has been added.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Point Mapping</CardTitle>
        <CardDescription>Configure data point mappings between protocols</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Scaling</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Temperature</TableCell>
              <TableCell>Float</TableCell>
              <TableCell>x0.1</TableCell>
              <TableCell>Modbus 400001</TableCell>
              <TableCell>DNP3 AI 1</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Valve Status</TableCell>
              <TableCell>Boolean</TableCell>
              <TableCell>-</TableCell>
              <TableCell>DNP3 BI 5</TableCell>
              <TableCell>OPC-UA Node 1.valve</TableCell>
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

