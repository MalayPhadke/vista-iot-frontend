"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define the SystemTag interface
interface SystemTag {
  id: number
  name: string
  dataType: string
  unit: string
  spanHigh: string | number
  spanLow: string | number
  description: string
}

export function SystemTagsForm() {
  const [systemTags, setSystemTags] = useState<SystemTag[]>([])

  // Load system tags on component mount
  useEffect(() => {
    // In a real application, these would be fetched from an API
    // For now, we'll use hardcoded data based on the provided images
    const tags: SystemTag[] = [
      {
        id: 1,
        name: "#SYS_UPTIME",
        dataType: "Analog",
        unit: "s",
        spanHigh: "281474976710655",
        spanLow: 0,
        description: "The current uptime(s)"
      },
      {
        id: 2,
        name: "#SYS_CURRENT_TIME",
        dataType: "Analog",
        unit: "s",
        spanHigh: "281474976710655",
        spanLow: 0,
        description: "The current system time(s)"
      },
      {
        id: 3,
        name: "#SYS_CPU_FREQ",
        dataType: "Analog",
        unit: "Hz",
        spanHigh: "10737418240",
        spanLow: 0,
        description: "CPU Frequency"
      },
      {
        id: 4,
        name: "#SYS_MEM_SIZE",
        dataType: "Analog",
        unit: "Byte",
        spanHigh: "10737418240",
        spanLow: 0,
        description: "Memory size(Byte)"
      },
      {
        id: 5,
        name: "#SYS_CPU_USED",
        dataType: "Analog",
        unit: "%",
        spanHigh: 100,
        spanLow: 0,
        description: "CPU utilization rate(%)"
      },
      {
        id: 6,
        name: "#SYS_CPU_IOWAIT",
        dataType: "Analog",
        unit: "%",
        spanHigh: 100,
        spanLow: 0,
        description: "CPU usage occupied by IOWait(%)"
      },
      {
        id: 7,
        name: "#SYS_MEM_USED",
        dataType: "Analog",
        unit: "%",
        spanHigh: 100,
        spanLow: 0,
        description: "Memory utilization rate(%)"
      },
      {
        id: 8,
        name: "#SYS_SYSPART_CAPACITY",
        dataType: "Analog",
        unit: "Byte",
        spanHigh: "281474976710655",
        spanLow: 0,
        description: "System partition capacity(Byte)"
      },
      {
        id: 9,
        name: "#SYS_SYSPART_FREE_SPACE",
        dataType: "Analog",
        unit: "Byte",
        spanHigh: "281474976710655",
        spanLow: 0,
        description: "System partition free space(Byte)"
      },
      {
        id: 10,
        name: "#SYS_DATACARD_CAPACITY",
        dataType: "Analog",
        unit: "Byte",
        spanHigh: "281474976710655",
        spanLow: 0,
        description: "Data partition capacity(Byte)"
      },
      {
        id: 11,
        name: "#SYS_DATACARD_FREE_SPACE",
        dataType: "Analog",
        unit: "Byte",
        spanHigh: "281474976710655",
        spanLow: 0,
        description: "Data partition free space(Byte)"
      },
      {
        id: 12,
        name: "#SYS_NODE_ID",
        dataType: "Analog",
        unit: "",
        spanHigh: 255,
        spanLow: 0,
        description: "Node ID on RTU"
      },
      {
        id: 13,
        name: "#SYS_ROOT_READONLY",
        dataType: "Analog",
        unit: "",
        spanHigh: 1,
        spanLow: 0,
        description: "Read-only system:0-System Partition Readable and Writable, 1-System Partition Read-Only"
      },
      {
        id: 14,
        name: "#MOBILE_SIM",
        dataType: "Analog",
        unit: "",
        spanHigh: 100,
        spanLow: 0,
        description: "0 error"
      },
      {
        id: 15,
        name: "#MOBILE_IP",
        dataType: "Analog",
        unit: "",
        spanHigh: "4294967295",
        spanLow: 0,
        description: "Cellular device ip"
      },
      {
        id: 16,
        name: "#MOBILE_MNO",
        dataType: "Analog",
        unit: "",
        spanHigh: 99999,
        spanLow: -1,
        description: "Mobile network operator"
      },
      {
        id: 17,
        name: "#MOBILE_MNT",
        dataType: "Analog",
        unit: "",
        spanHigh: 999,
        spanLow: -1,
        description: "Mobile network type"
      },
      {
        id: 18,
        name: "#MOBILE_NET",
        dataType: "Analog",
        unit: "",
        spanHigh: "281474976710655",
        spanLow: 0,
        description: "Mobile data traffic"
      },
      {
        id: 19,
        name: "#MOBILE_MSISDN",
        dataType: "Analog",
        unit: "",
        spanHigh: "99999999999999",
        spanLow: 0,
        description: "Mobile phone number"
      },
      {
        id: 20,
        name: "#MOBILE_SIGNAL_QUALITY",
        dataType: "Analog",
        unit: "",
        spanHigh: 100,
        spanLow: 0,
        description: "Signal quality of mobile network"
      },
      // Add more system tags as needed from the images
      {
        id: 21,
        name: "#MOBILE_CSQ",
        dataType: "Analog",
        unit: "",
        spanHigh: 1000,
        spanLow: 0,
        description: "Received Signal Strength Indication"
      },
      {
        id: 22,
        name: "#MOBILE_MCC",
        dataType: "Analog",
        unit: "",
        spanHigh: 999,
        spanLow: -1,
        description: "Mobile Country Code, MCC"
      },
      {
        id: 23,
        name: "#MOBILE_MNC",
        dataType: "Analog",
        unit: "",
        spanHigh: 999,
        spanLow: -1,
        description: "Mobile Network Code, MNC"
      },
      {
        id: 24,
        name: "#MOBILE_LAC",
        dataType: "Analog",
        unit: "",
        spanHigh: "4294967295",
        spanLow: 0,
        description: "Location Area Code, LAC"
      },
      {
        id: 25,
        name: "#MOBILE_CID",
        dataType: "Analog",
        unit: "",
        spanHigh: "4294967295",
        spanLow: 0,
        description: "Cell Tower ID, CId"
      },
      {
        id: 26,
        name: "#MOBILE_IMEI",
        dataType: "Analog",
        unit: "Byte",
        spanHigh: "99999999999999",
        spanLow: 0,
        description: "IMEI, International Mobile Subscriber Identity"
      },
      {
        id: 27,
        name: "#MOBILE_IMSI",
        dataType: "Analog",
        unit: "Byte",
        spanHigh: "99999999999999",
        spanLow: 0,
        description: "IMEI, International Mobile Equipment Identity"
      },
      {
        id: 28,
        name: "#MOBILE_IMEI_RAW",
        dataType: "Analog",
        unit: "Byte",
        spanHigh: "99999999999999",
        spanLow: 0,
        description: "IMEI raw data"
      },
      {
        id: 29,
        name: "#MOBILE_USRID",
        dataType: "Analog",
        unit: "Byte",
        spanHigh: "4294967295",
        spanLow: 0,
        description: "mobile modem, usb vendor id, product id"
      },
      {
        id: 30,
        name: "#MOBILE_DATA_DAY",
        dataType: "Analog",
        unit: "Byte",
        spanHigh: "281474976710655",
        spanLow: 0,
        description: "Cellular data, current day used traffic"
      }
    ]

    setSystemTags(tags)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Tags</CardTitle>
        <CardDescription>View system-defined tags and their properties</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Span High</TableHead>
                <TableHead>Span Low</TableHead>
                <TableHead className="w-[300px]">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemTags.map((tag, index) => (
                <TableRow key={tag.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                  <TableCell>{tag.id}</TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.dataType}</TableCell>
                  <TableCell>{tag.unit}</TableCell>
                  <TableCell>{tag.spanHigh}</TableCell>
                  <TableCell>{tag.spanLow}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={tag.description}>
                    {tag.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
