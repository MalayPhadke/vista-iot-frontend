"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronDown, Tag, FileDigit, UserCircle, Cog, BarChart, Server, Cpu } from "lucide-react"

// Define the IO Tag interface
interface IOTag {
  id: string;
  name: string;
  dataType: string;
  address: string;
  description: string;
}

// Define the Device interface for IO Ports
interface Device {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  unitNumber?: number;
  description?: string;
  tagWriteType?: string;
  addDeviceNameAsPrefix?: boolean;
  extensionProperties?: any;
  tags?: IOTag[];
}

// Define the IO Port interface
interface Port {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  devices?: Device[];
  description?: string;
  scanTime?: number;
  timeOut?: number;
  retryCount?: number;
  autoRecoverTime?: number;
  scanMode?: string;
  serialSettings?: any;
}

type TagCategory = {
  id: string
  name: string
  icon: React.ReactNode
  tags?: Tag[]
}

type Tag = {
  id: string
  name: string
  type?: string
  value?: string
  description?: string
  path?: string // To track the path (port/device/tag)
}

interface TagSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTag: (tag: Tag) => void
}

export function TagSelectionDialog({ open, onOpenChange, onSelectTag }: TagSelectionDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [ioPorts, setIoPorts] = useState<Port[]>([])
  const [userTags, setUserTags] = useState<Tag[]>([])
  const [calculationTags, setCalculationTags] = useState<Tag[]>([])
  const [systemTags, setSystemTags] = useState<Tag[]>([])
  const [statsTags, setStatsTags] = useState<Tag[]>([])
  
  // Track expanded items in the tree
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  
  // Track selected port, device, and tag
  const [selectedPort, setSelectedPort] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<IOTag[]>([])
  const [selectedTag, setSelectedTag] = useState<IOTag | null>(null)
  
  const tagCategories = [
    {
      id: "io-tag",
      name: "IO Tag",
      icon: <Tag className="h-4 w-4" />
    },
    {
      id: "calculation-tag",
      name: "Calculation Tag",
      icon: <FileDigit className="h-4 w-4" />
    },
    {
      id: "user-tag",
      name: "User Tag",
      icon: <UserCircle className="h-4 w-4" />
    },
    {
      id: "system-tag",
      name: "System Tag",
      icon: <Cog className="h-4 w-4" />
    },
    {
      id: "stats-tag",
      name: "Stats Tag",
      icon: <BarChart className="h-4 w-4" />
    }
  ]

  // Load IO ports data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && open) {
      try {
        // Process IO ports data
        const ioPortsData = localStorage.getItem('io_ports_data')
        if (ioPortsData) {
          const parsedPorts = JSON.parse(ioPortsData) as Port[]
          setIoPorts(parsedPorts)
          
          // Set IO Tag category as expanded by default
          setExpandedItems(prev => ({ ...prev, 'io-tag': true }))
        }
        
        // Load user tags from localStorage if available
        const userTagsData = localStorage.getItem('user_tags_data')
        if (userTagsData) {
          try {
            const parsedUserTags = JSON.parse(userTagsData)
            const formattedUserTags = parsedUserTags.map((tag: any) => ({
              id: tag.id,
              name: tag.name,
              type: 'User',
              value: tag.value || '',
              description: tag.description || ''
            }))
            setUserTags(formattedUserTags)
          } catch (e) {
            console.error('Error parsing user tags:', e)
          }
        }
        
        // Load stats tags from localStorage if available
        const statsTagsData = localStorage.getItem('stats_tags_data')
        if (statsTagsData) {
          try {
            const parsedStatsTags = JSON.parse(statsTagsData)
            const formattedStatsTags = parsedStatsTags.map((tag: any) => ({
              id: tag.id,
              name: tag.name,
              type: tag.type,
              value: tag.referTag || '',
              description: tag.description || ''
            }))
            setStatsTags(formattedStatsTags)
          } catch (e) {
            console.error('Error parsing stats tags:', e)
          }
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error)
      }
    }
  }, [open]) // Reload when dialog opens
  
  // Effect to update selected tags when port and device are selected
  useEffect(() => {
    if (selectedCategory === 'io-tag' && selectedPort && selectedDevice) {
      const port = ioPorts.find(p => p.id === selectedPort)
      if (port && port.devices) {
        const device = port.devices.find(d => d.id === selectedDevice)
        if (device && device.tags) {
          setSelectedTags(device.tags)
        } else {
          setSelectedTags([])
        }
      } else {
        setSelectedTags([])
      }
    } else {
      setSelectedTags([])
    }
  }, [selectedCategory, selectedPort, selectedDevice, ioPorts])
  
  // Toggle expanded state for a tree item
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSelectTag = (tag: IOTag) => {
    // Get the port and device names for the selected tag
    const port = ioPorts.find(p => p.id === selectedPort);
    const device = port?.devices?.find(d => d.id === selectedDevice);
    
    if (port && device) {
      // Format the tag with device name as prefix
      const formattedTag = {
        id: tag.id,
        name: `${device.name}:${tag.name}`,
        type: tag.dataType,
        value: tag.address,
        description: tag.description
      };
      onSelectTag(formattedTag);
      onOpenChange(false);
    }
  }

  // Render a tree item with toggle functionality
  const renderTreeItem = (id: string, name: string, icon: React.ReactNode, depth: number = 0, hasChildren: boolean = false) => {
    const isExpanded = expandedItems[id] || false;
    const paddingLeft = `${depth * 16}px`;
    
    return (
      <div 
        key={id}
        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50 ${selectedCategory === id || selectedPort === id || selectedDevice === id ? 'bg-muted' : ''}`}
        style={{ paddingLeft }}
        onClick={() => {
          if (hasChildren) {
            toggleExpanded(id);
          }
        }}
      >
        {hasChildren && (
          <div className="flex-shrink-0">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        )}
        <div className="flex-shrink-0">{icon}</div>
        <span>{name}</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Tag</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-[250px_1fr] gap-4 flex-grow overflow-hidden">
          {/* Left sidebar with categories and tree structure */}
          <Card className="overflow-hidden">
            <ScrollArea className="h-[400px]">
              <div className="p-2">
                <div className="text-sm font-medium mb-2">Data Center</div>
                
                {/* Render tag categories */}
                {tagCategories.map(category => {
                  const isExpanded = expandedItems[category.id] || false;
                  
                  return (
                    <div key={category.id}>
                      {renderTreeItem(
                        category.id, 
                        category.name, 
                        category.icon, 
                        0, 
                        category.id === 'io-tag' // Only IO Tag has children
                      )}
                      
                      {/* If IO Tag category is expanded, show ports */}
                      {category.id === 'io-tag' && isExpanded && ioPorts.map(port => {
                        const isPortExpanded = expandedItems[port.id] || false;
                        
                        return (
                          <div key={port.id}>
                            <div 
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50 ${selectedPort === port.id ? 'bg-muted' : ''}`}
                              style={{ paddingLeft: '16px' }}
                              onClick={() => {
                                setSelectedPort(port.id);
                                toggleExpanded(port.id);
                                setSelectedDevice(null);
                                setSelectedTag(null);
                              }}
                            >
                              {port.devices && port.devices.length > 0 ? (
                                isPortExpanded ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              ) : null}
                              <Server className="h-4 w-4" />
                              <span>{port.name}</span>
                            </div>
                            
                            {/* If port is expanded, show devices */}
                            {isPortExpanded && port.devices && port.devices.map(device => (
                              <div 
                                key={device.id}
                                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50 ${selectedDevice === device.id ? 'bg-muted' : ''}`}
                                style={{ paddingLeft: '32px' }}
                                onClick={() => {
                                  setSelectedDevice(device.id);
                                  setSelectedCategory('io-tag');
                                }}
                              >
                                <Cpu className="h-4 w-4" />
                                <span>{device.name}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>
          
          {/* Right panel with available tags */}
          <Card className="overflow-hidden">
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                {selectedCategory === 'io-tag' && selectedDevice ? (
                  <>
                    {/* Show device name as header */}
                    {ioPorts.map(port => {
                      if (port.devices) {
                        const device = port.devices.find(d => d.id === selectedDevice);
                        if (device) {
                          return (
                            <div key={device.id} className="mb-4">
                              <h3 className="text-lg font-semibold mb-2">{device.name}</h3>
                              
                              {/* Show tags in a table */}
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Tag Name</TableHead>
                                    <TableHead>Data Type</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedTags.length === 0 ? (
                                    <TableRow>
                                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                        No tags available for this device
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    selectedTags.map((tag) => (
                                      <TableRow key={tag.id}>
                                        <TableCell>{tag.name}</TableCell>
                                        <TableCell>{tag.dataType}</TableCell>
                                        <TableCell>{tag.address}</TableCell>
                                        <TableCell>{tag.description}</TableCell>
                                        <TableCell>
                                          <Button 
                                            size="sm" 
                                            onClick={() => handleSelectTag(tag)}
                                          >
                                            Select
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {selectedCategory === 'io-tag' 
                      ? "Select a device to view available tags" 
                      : "Select a category to view available tags"}
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
