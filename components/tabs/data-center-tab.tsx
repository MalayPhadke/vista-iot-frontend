"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserTagsForm } from "@/components/forms/user-tags-form"
import { StatsTagsForm } from "@/components/forms/stats-tags-form"
import { SystemTagsForm } from "@/components/forms/system-tags-form"
import { Tag, Calculator, BarChart3, Settings } from "lucide-react"

export default function DataCenterTab() {
  const [activeTab, setActiveTab] = useState("io-tags")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Center Management</CardTitle>
        <CardDescription>Configure and manage your data tags for the IoT gateway.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="io-tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              IO Tags
            </TabsTrigger>
            <TabsTrigger value="user-tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              User Tags
            </TabsTrigger>
            <TabsTrigger value="calculation-tags" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculation Tags
            </TabsTrigger>
            <TabsTrigger value="stats-tags" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stats Tags
            </TabsTrigger>
            <TabsTrigger value="system-tags" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Tags
            </TabsTrigger>
          </TabsList>

          <TabsContent value="io-tags">
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">IO Tags</h3>
              <p className="text-gray-500">Manage input/output data tags</p>
              <div className="mt-4 p-8 border rounded-md text-center text-gray-500">
                IO Tags configuration will be displayed here
              </div>
            </div>
          </TabsContent>

          <TabsContent value="user-tags">
            <UserTagsForm />
          </TabsContent>

          <TabsContent value="calculation-tags">
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">Calculation Tags</h3>
              <p className="text-gray-500">Set up calculated data points</p>
              <div className="mt-4 p-8 border rounded-md text-center text-gray-500">
                Calculation Tags configuration will be displayed here
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats-tags">
            <StatsTagsForm />
          </TabsContent>

          <TabsContent value="system-tags">
            <SystemTagsForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
