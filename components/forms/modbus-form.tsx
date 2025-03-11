"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useConfigStore } from "@/lib/stores/configuration-store"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

export function ModbusForm() {
  const { updateConfig } = useConfigStore()
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      updateConfig(['protocols', 'modbus'], {
        enabled: formData.get('modbus-enabled') === 'true',
        mode: formData.get('mode'),
        tcp: {
          port: parseInt(formData.get('port') as string),
          max_connections: parseInt(formData.get('max-connections') as string),
          timeout: parseInt(formData.get('timeout') as string),
        },
        serial: {
          port: formData.get('serial-port'),
          baudrate: parseInt(formData.get('baudrate') as string),
          data_bits: parseInt(formData.get('data-bits') as string),
          parity: formData.get('parity'),
          stop_bits: parseInt(formData.get('stop-bits') as string),
        },
        slave_id: parseInt(formData.get('slave-id') as string),
      })

      toast.success('Modbus settings saved successfully!', {
        duration: 3000,
      })
    } catch (error) {
      console.error('Error saving Modbus settings:', error)
      toast.error('Failed to save Modbus settings. Please try again.', {
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="tcp">
        <TabsList className="mb-4">
          <TabsTrigger value="tcp">Modbus TCP</TabsTrigger>
          <TabsTrigger value="rtu">Modbus RTU</TabsTrigger>
        </TabsList>

        <TabsContent value="tcp">
          <Card>
            <CardHeader>
              <CardTitle>Modbus TCP</CardTitle>
              <CardDescription>Configure Modbus TCP settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="modbus-tcp-enabled">Enable Modbus TCP</Label>
                <Switch id="modbus-tcp-enabled" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modbus-tcp-mode">Mode</Label>
                <Select defaultValue="server">
                  <SelectTrigger id="modbus-tcp-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modbus-tcp-port">TCP Port</Label>
                  <Input id="modbus-tcp-port" placeholder="502" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modbus-tcp-timeout">Timeout (ms)</Label>
                  <Input id="modbus-tcp-timeout" placeholder="1000" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="rtu">
          <Card>
            <CardHeader>
              <CardTitle>Modbus RTU</CardTitle>
              <CardDescription>Configure Modbus RTU settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="modbus-rtu-enabled">Enable Modbus RTU</Label>
                <Switch id="modbus-rtu-enabled" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modbus-rtu-mode">Mode</Label>
                <Select defaultValue="master">
                  <SelectTrigger id="modbus-rtu-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="slave">Slave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modbus-rtu-port">Serial Port</Label>
                  <Select defaultValue="ttyS0">
                    <SelectTrigger id="modbus-rtu-port">
                      <SelectValue placeholder="Select port" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ttyS0">ttyS0</SelectItem>
                      <SelectItem value="ttyS1">ttyS1</SelectItem>
                      <SelectItem value="ttyUSB0">ttyUSB0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modbus-rtu-baud">Baud Rate</Label>
                  <Select defaultValue="9600">
                    <SelectTrigger id="modbus-rtu-baud">
                      <SelectValue placeholder="Select baud rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9600">9600</SelectItem>
                      <SelectItem value="19200">19200</SelectItem>
                      <SelectItem value="38400">38400</SelectItem>
                      <SelectItem value="57600">57600</SelectItem>
                      <SelectItem value="115200">115200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modbus-rtu-parity">Parity</Label>
                  <Select defaultValue="none">
                    <SelectTrigger id="modbus-rtu-parity">
                      <SelectValue placeholder="Select parity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="even">Even</SelectItem>
                      <SelectItem value="odd">Odd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modbus-rtu-data">Data Bits</Label>
                  <Select defaultValue="8">
                    <SelectTrigger id="modbus-rtu-data">
                      <SelectValue placeholder="Select data bits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modbus-rtu-stop">Stop Bits</Label>
                  <Select defaultValue="1">
                    <SelectTrigger id="modbus-rtu-stop">
                      <SelectValue placeholder="Select stop bits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

