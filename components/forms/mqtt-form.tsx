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

export function MQTTForm() {
  const { updateConfig } = useConfigStore()
  const [mqttEnabled, setMqttEnabled] = useState(false)
  const [useTLS, setUseTLS] = useState(false)
  const [authType, setAuthType] = useState("none")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      updateConfig(['protocols', 'mqtt'], {
        enabled: formData.get('mqtt-enabled') === 'true',
        broker: {
          address: formData.get('broker-address'),
          port: parseInt(formData.get('broker-port') as string),
          client_id: formData.get('client-id'),
          tls: {
            enabled: formData.get('use-tls') === 'true',
            version: formData.get('tls-version'),
            verify_server: formData.get('verify-server') === 'true',
            allow_insecure: formData.get('allow-insecure') === 'true'
          }
        }
      })

      toast.success('MQTT settings saved successfully!', {
        duration: 3000,
      })
    } catch (error) {
      console.error('Error saving MQTT settings:', error)
      toast.error('Failed to save MQTT settings. Please try again.', {
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="broker">
        <TabsList className="mb-4">
          <TabsTrigger value="broker">Broker Settings</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="broker">
          <Card>
            <CardHeader>
              <CardTitle>MQTT Broker Configuration</CardTitle>
              <CardDescription>Configure connection to MQTT broker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="mqtt-enabled">Enable MQTT Client</Label>
                <Switch id="mqtt-enabled" checked={mqttEnabled} onCheckedChange={setMqttEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="broker-address">Broker Address</Label>
                <Input id="broker-address" placeholder="mqtt.example.com" disabled={!mqttEnabled} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="broker-port">Port</Label>
                  <Input id="broker-port" placeholder="1883" disabled={!mqttEnabled} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-id">Client ID</Label>
                  <Input id="client-id" placeholder="iot-gateway-001" disabled={!mqttEnabled} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="use-tls">Use TLS/SSL</Label>
                <Switch id="use-tls" checked={useTLS} onCheckedChange={setUseTLS} disabled={!mqttEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-type">Authentication</Label>
                <Select value={authType} onValueChange={setAuthType} disabled={!mqttEnabled}>
                  <SelectTrigger id="auth-type">
                    <SelectValue placeholder="Select authentication type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="basic">Username/Password</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {authType === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mqtt-username">Username</Label>
                    <Input id="mqtt-username" placeholder="username" disabled={!mqttEnabled} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mqtt-password">Password</Label>
                    <Input id="mqtt-password" type="password" placeholder="••••••••" disabled={!mqttEnabled} />
                  </div>
                </div>
              )}

              {authType === "certificate" && (
                <div className="space-y-2">
                  <Label htmlFor="mqtt-cert">Certificate File</Label>
                  <Input id="mqtt-cert" type="file" disabled={!mqttEnabled} />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving || !mqttEnabled}>
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

        <TabsContent value="topics">
          <Card>
            <CardHeader>
              <CardTitle>MQTT Topics</CardTitle>
              <CardDescription>Configure publish and subscribe topics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-topic">Base Topic</Label>
                <Input id="base-topic" placeholder="iot-gateway/device001" disabled={!mqttEnabled} />
              </div>

              <div className="space-y-2">
                <Label>Publish Topics</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="status" disabled={!mqttEnabled} />
                    <Select defaultValue="json" disabled={!mqttEnabled}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="text">Plain Text</SelectItem>
                        <SelectItem value="binary">Binary</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" disabled={!mqttEnabled}>
                      +
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="telemetry" disabled={!mqttEnabled} />
                    <Select defaultValue="json" disabled={!mqttEnabled}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="text">Plain Text</SelectItem>
                        <SelectItem value="binary">Binary</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" disabled={!mqttEnabled}>
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subscribe Topics</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="commands" disabled={!mqttEnabled} />
                    <Select defaultValue="0" disabled={!mqttEnabled}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="QoS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">QoS 0</SelectItem>
                        <SelectItem value="1">QoS 1</SelectItem>
                        <SelectItem value="2">QoS 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" disabled={!mqttEnabled}>
                      +
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="config" disabled={!mqttEnabled} />
                    <Select defaultValue="1" disabled={!mqttEnabled}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="QoS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">QoS 0</SelectItem>
                        <SelectItem value="1">QoS 1</SelectItem>
                        <SelectItem value="2">QoS 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" disabled={!mqttEnabled}>
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving || !mqttEnabled}>
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

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>MQTT Security</CardTitle>
              <CardDescription>Configure security settings for MQTT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tls-version">TLS Version</Label>
                <Select defaultValue="1.2" disabled={!mqttEnabled || !useTLS}>
                  <SelectTrigger id="tls-version">
                    <SelectValue placeholder="Select TLS version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0">TLS 1.0</SelectItem>
                    <SelectItem value="1.1">TLS 1.1</SelectItem>
                    <SelectItem value="1.2">TLS 1.2</SelectItem>
                    <SelectItem value="1.3">TLS 1.3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ca-cert">CA Certificate</Label>
                <Input id="ca-cert" type="file" disabled={!mqttEnabled || !useTLS} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="verify-server">Verify Server Certificate</Label>
                <Switch id="verify-server" defaultChecked={true} disabled={!mqttEnabled || !useTLS} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allow-insecure">Allow Insecure Connections</Label>
                <Switch id="allow-insecure" defaultChecked={false} disabled={!mqttEnabled} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving || !mqttEnabled}>
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

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced MQTT Settings</CardTitle>
              <CardDescription>Configure advanced MQTT client settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keep-alive">Keep Alive Interval (seconds)</Label>
                  <Input id="keep-alive" placeholder="60" type="number" disabled={!mqttEnabled} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connect-timeout">Connection Timeout (seconds)</Label>
                  <Input id="connect-timeout" placeholder="30" type="number" disabled={!mqttEnabled} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reconnect-interval">Reconnect Interval (seconds)</Label>
                  <Input id="reconnect-interval" placeholder="10" type="number" disabled={!mqttEnabled} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-inflight">Max In-flight Messages</Label>
                  <Input id="max-inflight" placeholder="20" type="number" disabled={!mqttEnabled} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="clean-session">Clean Session</Label>
                <Switch id="clean-session" defaultChecked={true} disabled={!mqttEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="persistent-session">Persistent Session</Label>
                <Switch id="persistent-session" defaultChecked={false} disabled={!mqttEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last-will-topic">Last Will Topic</Label>
                <Input id="last-will-topic" placeholder="iot-gateway/device001/status" disabled={!mqttEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last-will-message">Last Will Message</Label>
                <Input id="last-will-message" placeholder='{"status": "offline"}' disabled={!mqttEnabled} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="last-will-qos">Last Will QoS</Label>
                  <Select defaultValue="0" disabled={!mqttEnabled}>
                    <SelectTrigger id="last-will-qos">
                      <SelectValue placeholder="QoS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">QoS 0</SelectItem>
                      <SelectItem value="1">QoS 1</SelectItem>
                      <SelectItem value="2">QoS 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-will-retain">Last Will Retain</Label>
                  <Select defaultValue="false" disabled={!mqttEnabled}>
                    <SelectTrigger id="last-will-retain">
                      <SelectValue placeholder="Retain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving || !mqttEnabled}>
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

