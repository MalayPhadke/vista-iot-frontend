"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"

export function StaticRoutesForm() {
  const { toast } = useToast()

  const handleAddRoute = () => {
    toast({
      title: "Route added",
      description: "A new static route has been added.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Static Routes</CardTitle>
        <CardDescription>Configure static routing table entries</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destination</TableHead>
              <TableHead>Subnet Mask</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Interface</TableHead>
              <TableHead>Metric</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>192.168.2.0</TableCell>
              <TableCell>255.255.255.0</TableCell>
              <TableCell>10.0.0.2</TableCell>
              <TableCell>eth1</TableCell>
              <TableCell>10</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>10.10.0.0</TableCell>
              <TableCell>255.255.0.0</TableCell>
              <TableCell>192.168.1.254</TableCell>
              <TableCell>eth0</TableCell>
              <TableCell>20</TableCell>
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
        <Button onClick={handleAddRoute}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Route
        </Button>
      </CardFooter>
    </Card>
  )
}

