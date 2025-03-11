"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"

export function FirewallForm() {
  const { toast } = useToast()

  const handleAddRule = () => {
    toast({
      title: "Rule added",
      description: "A new firewall rule has been added.",
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Firewall Settings</CardTitle>
          <CardDescription>Configure default firewall policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">WAN → LAN Policy</label>
              <Select defaultValue="drop">
                <SelectTrigger>
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accept">Accept</SelectItem>
                  <SelectItem value="drop">Drop</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LAN → WAN Policy</label>
              <Select defaultValue="accept">
                <SelectTrigger>
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accept">Accept</SelectItem>
                  <SelectItem value="drop">Drop</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LAN → LAN Policy</label>
              <Select defaultValue="accept">
                <SelectTrigger>
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accept">Accept</SelectItem>
                  <SelectItem value="drop">Drop</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Policies</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Firewall Rules</CardTitle>
          <CardDescription>Configure custom firewall rules</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Allow SSH</TableCell>
                <TableCell>Any</TableCell>
                <TableCell>WAN</TableCell>
                <TableCell>TCP</TableCell>
                <TableCell>22</TableCell>
                <TableCell>Accept</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Block Telnet</TableCell>
                <TableCell>Any</TableCell>
                <TableCell>Any</TableCell>
                <TableCell>TCP</TableCell>
                <TableCell>23</TableCell>
                <TableCell>Drop</TableCell>
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
    </div>
  )
}

