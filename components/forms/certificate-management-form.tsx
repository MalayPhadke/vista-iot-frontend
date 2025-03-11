"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Download, Trash2, Upload } from "lucide-react"

export function CertificateManagementForm() {
  const { toast } = useToast()

  const handleImportCert = () => {
    toast({
      title: "Certificate imported",
      description: "The certificate has been imported successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate Management</CardTitle>
        <CardDescription>Manage SSL/TLS certificates</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Issued By</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>gateway.crt</TableCell>
              <TableCell>Server Certificate</TableCell>
              <TableCell>Self-signed</TableCell>
              <TableCell>2024-12-31</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ca.crt</TableCell>
              <TableCell>CA Certificate</TableCell>
              <TableCell>Example CA</TableCell>
              <TableCell>2025-06-30</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleImportCert}>
          <Upload className="h-4 w-4 mr-2" />
          Import Certificate
        </Button>
        <Button variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Generate Self-signed
        </Button>
      </CardFooter>
    </Card>
  )
}

