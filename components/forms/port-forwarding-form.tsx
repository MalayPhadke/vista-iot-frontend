"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"

export function PortForwardingForm() {
  const { toast } = useToast()

  const handleAddRule = () => {
    toast({
      title: "Rule added",
      description: "A new port forwarding rule has been added.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Port Forwarding</CardTitle>
        <CardDescription>Configure port forwarding rules</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>External Port</TableHead>
              <TableHead>Internal IP</TableHead>
              <TableHead>Internal Port</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Web Server</TableCell>
              <TableCell>TCP</TableCell>
              <TableCell>80</TableCell>
              <TableCell>10.0.0.10</TableCell>
              <TableCell>80</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SSH Access</TableCell>
              <TableCell>TCP</TableCell>
              <TableCell>2222</TableCell>
              <TableCell>10.0.0.5</TableCell>
              <TableCell>22</TableCell>
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
        <Button onClick={handleAddRule}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </CardFooter>
    </Card>
  )
}

