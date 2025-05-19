"use client"

import { useState } from "react"
import { 
  Plus, 
  Edit, 
  Trash2,
  Tags,
  MoreVertical,
  X,
  ChevronDown,
  Save,
  FileDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

// Define the IOTag interface
export interface IOTag {
  id: string
  name: string
  dataType: string
  address: string
  description: string
  source?: string
  defaultValue?: string | number
  scanRate?: number
  conversionType?: string
  scaleType?: string
  readWrite?: string
  startBit?: number
  lengthBit?: number
  spanLow?: number
  spanHigh?: number
  formula?: string
  scale?: number
  offset?: number
  clampToLow?: boolean
  clampToHigh?: boolean
  clampToZero?: boolean
}

interface Device {
  id: string
  name: string
  type: string
  enabled: boolean
  tags: IOTag[]
  [key: string]: any
}

interface IOTagDetailProps {
  device: Device
  portId: string
  onUpdate?: (portId: string, deviceId: string, tags: IOTag[]) => void
}

export function IOTagDetailView({ device, portId, onUpdate }: IOTagDetailProps) {
  const { toast } = useToast()
  
  // State for the table and selection
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagFormOpen, setTagFormOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<IOTag | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  
  const handleTagSelection = (tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
  }
  
  const handleAddTag = () => {
    setEditingTag(null)
    setTagFormOpen(true)
  }
  
  const handleEditTag = () => {
    if (selectedTags.length !== 1) return
    
    const tagToEdit = device.tags.find(tag => tag.id === selectedTags[0])
    if (tagToEdit) {
      setEditingTag(tagToEdit)
      setTagFormOpen(true)
    }
  }
  
  const handleDeleteClick = () => {
    if (selectedTags.length === 0) return
    setDeleteConfirmOpen(true)
  }
  
  const handleDeleteConfirm = () => {
    const updatedTags = device.tags.filter(tag => !selectedTags.includes(tag.id))
    
    if (onUpdate) {
      onUpdate(portId, device.id, updatedTags)
    }
    
    setSelectedTags([])
    setDeleteConfirmOpen(false)
    
    toast({
      title: "IO Tags Deleted",
      description: `Successfully deleted ${selectedTags.length} tag(s)`,
    })
  }
  
  const handleSaveTag = (newTag: IOTag) => {
    let updatedTags: IOTag[]
    
    if (editingTag) {
      // Update existing tag
      updatedTags = device.tags.map(tag => 
        tag.id === editingTag.id ? newTag : tag
      )
      
      toast({
        title: "IO Tag Updated",
        description: `Successfully updated tag: ${newTag.name}`,
      })
    } else {
      // Add new tag
      updatedTags = [...device.tags, newTag]
      
      toast({
        title: "IO Tag Added",
        description: `Successfully added tag: ${newTag.name}`,
      })
    }
    
    if (onUpdate) {
      onUpdate(portId, device.id, updatedTags)
    }
    
    setTagFormOpen(false)
    setEditingTag(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center">
            <Tags className="h-5 w-5 mr-2" /> IO Tags for {device.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure input/output tags for data acquisition and processing
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleAddTag}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
          <Button 
            variant="outline" 
            onClick={handleEditTag}
            disabled={selectedTags.length !== 1}
          >
            <Edit className="h-4 w-4 mr-2" /> Modify
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDeleteClick}
            disabled={selectedTags.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Scan Rate</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Conversion Type</TableHead>
                <TableHead>Scale Type</TableHead>
                <TableHead>Read Write</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {device.tags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-6 text-muted-foreground">
                    No IO tags configured for this device. Click "Add" to create a new tag.
                  </TableCell>
                </TableRow>
              ) : (
                device.tags.map(tag => (
                  <TableRow 
                    key={tag.id} 
                    className={selectedTags.includes(tag.id) ? "bg-muted/50" : ""}
                    onClick={() => handleTagSelection(tag.id)}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedTags.includes(tag.id)} 
                        onCheckedChange={() => handleTagSelection(tag.id)} 
                      />
                    </TableCell>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell>{tag.dataType || "Analog"}</TableCell>
                    <TableCell>{tag.source || "Device"}</TableCell>
                    <TableCell>{tag.defaultValue || "0.0"}</TableCell>
                    <TableCell>{tag.scanRate || "1"}</TableCell>
                    <TableCell>{tag.address}</TableCell>
                    <TableCell>{tag.conversionType || "FLOAT, Big Endian (ABCD)"}</TableCell>
                    <TableCell>{tag.scaleType || "No Scale"}</TableCell>
                    <TableCell>{tag.readWrite || "Read/Write"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{tag.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Tag Form Dialog */}
      <Dialog open={tagFormOpen} onOpenChange={setTagFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTag ? "Modify IO Tag" : "Add New IO Tag"}</DialogTitle>
            <DialogDescription>
              Configure the IO tag properties for data acquisition and processing
            </DialogDescription>
          </DialogHeader>
          
          <TagForm 
            onSave={handleSaveTag} 
            onCancel={() => setTagFormOpen(false)} 
            existingTag={editingTag} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedTags.length} IO tag(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface TagFormProps {
  onSave: (tag: IOTag) => void
  onCancel: () => void
  existingTag?: IOTag | null
}

function TagForm({ onSave, onCancel, existingTag }: TagFormProps) {
  const [activeTab, setActiveTab] = useState("basic")
  
  // Form state
  const [name, setName] = useState(existingTag?.name || "")
  const [dataType, setDataType] = useState(existingTag?.dataType || "Analog")
  const [conversion, setConversion] = useState(existingTag?.conversionType || "FLOAT, Big Endian (ABCD)")
  const [address, setAddress] = useState(existingTag?.address || "")
  const [startBit, setStartBit] = useState(existingTag?.startBit || 0)
  const [lengthBit, setLengthBit] = useState(existingTag?.lengthBit || 64)
  const [spanLow, setSpanLow] = useState(existingTag?.spanLow || 0)
  const [spanHigh, setSpanHigh] = useState(existingTag?.spanHigh || 1000)
  const [defaultValue, setDefaultValue] = useState(existingTag?.defaultValue || 0.0)
  const [scanRate, setScanRate] = useState(existingTag?.scanRate || 1)
  const [readWrite, setReadWrite] = useState(existingTag?.readWrite || "Read/Write")
  const [description, setDescription] = useState(existingTag?.description || "")
  
  // Advanced tab
  const [scaleType, setScaleType] = useState(existingTag?.scaleType || "No Scale")
  const [formula, setFormula] = useState(existingTag?.formula || "")
  const [scale, setScale] = useState(existingTag?.scale || 1)
  const [offset, setOffset] = useState(existingTag?.offset || 0)
  const [clampToLow, setClampToLow] = useState(existingTag?.clampToLow || false)
  const [clampToHigh, setClampToHigh] = useState(existingTag?.clampToHigh || false)
  const [clampToZero, setClampToZero] = useState(existingTag?.clampToZero || false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTag: IOTag = {
      id: existingTag?.id || `tag-${Date.now()}`,
      name,
      dataType,
      conversionType: conversion,
      address,
      startBit,
      lengthBit,
      spanLow,
      spanHigh,
      defaultValue,
      scanRate,
      readWrite,
      description,
      scaleType,
      formula,
      scale,
      offset,
      clampToLow,
      clampToHigh,
      clampToZero
    }
    
    onSave(newTag)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter tag name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataType">Data Type</Label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger id="dataType">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Analog">Analog</SelectItem>
                  <SelectItem value="Digital">Digital</SelectItem>
                  <SelectItem value="String">String</SelectItem>
                  <SelectItem value="Integer">Integer</SelectItem>
                  <SelectItem value="Float">Float</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conversion">Conversion</Label>
              <Select value={conversion} onValueChange={setConversion}>
                <SelectTrigger id="conversion">
                  <SelectValue placeholder="Select conversion type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INT64, Little Endian, Swap Byte (GHEFDCBA)">INT64, Little Endian, Swap Byte (GHEFDCBA)</SelectItem>
                  <SelectItem value="UINT, Big Endian (ABCD)">UINT, Big Endian (ABCD)</SelectItem>
                  <SelectItem value="FLOAT, Big Endian (ABCD)">FLOAT, Big Endian (ABCD)</SelectItem>
                  <SelectItem value="FLOAT, Little Endian (DCBA)">FLOAT, Little Endian (DCBA)</SelectItem>
                  <SelectItem value="DOUBLE, Big Endian (ABCDEFGH)">DOUBLE, Big Endian (ABCDEFGH)</SelectItem>
                  <SelectItem value="DOUBLE, Little Endian (HGFEDCBA)">DOUBLE, Little Endian (HGFEDCBA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startBit">Start Bit</Label>
              <Input
                id="startBit"
                type="number"
                value={startBit}
                onChange={(e) => setStartBit(Number(e.target.value))}
                min={0}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lengthBit">Length (bit)</Label>
              <Input
                id="lengthBit"
                type="number"
                value={lengthBit}
                onChange={(e) => setLengthBit(Number(e.target.value))}
                min={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="spanLow">Span Low</Label>
              <Input
                id="spanLow"
                type="number"
                value={spanLow}
                onChange={(e) => setSpanLow(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="spanHigh">Span High</Label>
              <Input
                id="spanHigh"
                type="number"
                value={spanHigh}
                onChange={(e) => setSpanHigh(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultValue">Default Value</Label>
              <Input
                id="defaultValue"
                type="number"
                value={defaultValue}
                onChange={(e) => setDefaultValue(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scanRate">Scan Rate</Label>
              <Input
                id="scanRate"
                type="number"
                value={scanRate}
                onChange={(e) => setScanRate(Number(e.target.value))}
                min={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="readWrite">Read Write</Label>
              <Select value={readWrite} onValueChange={setReadWrite}>
                <SelectTrigger id="readWrite">
                  <SelectValue placeholder="Select read/write access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Read/Write">Read/Write</SelectItem>
                  <SelectItem value="Read Only">Read Only</SelectItem>
                  <SelectItem value="Write Only">Write Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description (optional)"
                rows={3}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4 pt-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="scaleType">Scaling Type</Label>
              <Select value={scaleType} onValueChange={setScaleType}>
                <SelectTrigger id="scaleType">
                  <SelectValue placeholder="Select scaling type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No Scale">No Scale</SelectItem>
                  <SelectItem value="Scale 0-100% Input to Span">Scale 0-100% Input to Span</SelectItem>
                  <SelectItem value="Linear Scale, MX+B">Linear Scale, MX+B</SelectItem>
                  <SelectItem value="Scale Defined Input H/L to Span">Scale Defined Input H/L to Span</SelectItem>
                  <SelectItem value="Scale 12-Bit Input to Span">Scale 12-Bit Input to Span</SelectItem>
                  <SelectItem value="Scale 0-100% Square Root Input">Scale 0-100% Square Root Input</SelectItem>
                  <SelectItem value="Square Root of (Input/(F2-F1)) to Span">Square Root of (Input/(F2-F1)) to Span</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {scaleType === "Linear Scale, MX+B" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formula">Formula</Label>
                  <Input
                    id="formula"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    placeholder="Enter formula"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scale">Scale (M)</Label>
                  <Input
                    id="scale"
                    type="number"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="offset">Offset (B)</Label>
                  <Input
                    id="offset"
                    type="number"
                    value={offset}
                    onChange={(e) => setOffset(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
            
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Clamp Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="clampToLow" 
                    checked={clampToLow}
                    onCheckedChange={(checked) => setClampToLow(checked as boolean)}
                  />
                  <Label htmlFor="clampToLow">Clamp to span low</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="clampToHigh" 
                    checked={clampToHigh}
                    onCheckedChange={(checked) => setClampToHigh(checked as boolean)}
                  />
                  <Label htmlFor="clampToHigh">Clamp to span high</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="clampToZero" 
                    checked={clampToZero}
                    onCheckedChange={(checked) => setClampToZero(checked as boolean)}
                  />
                  <Label htmlFor="clampToZero">Clamp to zero</Label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" type="button" onClick={onCancel}>Close</Button>
        <Button type="submit">OK</Button>
      </DialogFooter>
    </form>
  )
}
