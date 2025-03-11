"use client"

import { useState } from "react"
import { Download, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample log data
const logEntries = [
  {
    id: "1",
    timestamp: "2023-06-20 08:23:45",
    level: "INFO",
    source: "System",
    message: "Gateway started successfully",
  },
  {
    id: "2",
    timestamp: "2023-06-20 08:24:12",
    level: "INFO",
    source: "Network",
    message: "Interface eth0 connected",
  },
  {
    id: "3",
    timestamp: "2023-06-20 08:24:30",
    level: "WARNING",
    source: "Modbus",
    message: "Connection timeout to device at 192.168.1.120",
  },
  {
    id: "4",
    timestamp: "2023-06-20 08:25:15",
    level: "ERROR",
    source: "DNP3",
    message: "Failed to initialize DNP3 server",
  },
  {
    id: "5",
    timestamp: "2023-06-20 08:26:45",
    level: "INFO",
    source: "OPC-UA",
    message: "Client connected from 10.0.0.5",
  },
  {
    id: "6",
    timestamp: "2023-06-20 08:27:22",
    level: "INFO",
    source: "Security",
    message: "VPN tunnel established",
  },
  {
    id: "7",
    timestamp: "2023-06-20 08:28:10",
    level: "WARNING",
    source: "Hardware",
    message: "CPU temperature above threshold (75°C)",
  },
  {
    id: "8",
    timestamp: "2023-06-20 08:29:45",
    level: "INFO",
    source: "Modbus",
    message: "Reconnected to device at 192.168.1.120",
  },
]

export default function LogsTab() {
  const [logLevel, setLogLevel] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter logs based on level and search query
  const filteredLogs = logEntries.filter((log) => {
    const matchesLevel = logLevel === "all" || log.level.toLowerCase() === logLevel.toLowerCase()
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesLevel && matchesSearch
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
        <CardDescription>View and filter system logs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select value={logLevel} onValueChange={setLogLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Log level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Level</TableHead>
                <TableHead className="w-[120px]">Source</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          log.level === "ERROR"
                            ? "bg-red-100 text-red-800"
                            : log.level === "WARNING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {log.level}
                      </span>
                    </TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell>{log.message}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No logs found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <div className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logEntries.length} log entries
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

