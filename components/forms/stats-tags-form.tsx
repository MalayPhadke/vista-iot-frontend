"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, FileText, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { TagSelectionDialog } from "@/components/dialogs/tag-selection-dialog"

// Stats Tag Dialog Component
function StatsTagDialog({ open, onOpenChange, onSaveTag, editTag = null }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSaveTag: (tag: any, isEdit: boolean) => void;
  editTag?: any | null;
}) {
  const [tagName, setTagName] = useState("")
  const [tagType, setTagType] = useState("Average")
  const [referTag, setReferTag] = useState("")
  const [updateCycle, setUpdateCycle] = useState("1")
  const [updateUnit, setUpdateUnit] = useState("sec")
  const [description, setDescription] = useState("")
  const [tagSelectionDialogOpen, setTagSelectionDialogOpen] = useState(false)
  
  // Reset form when dialog opens or when editTag changes
  React.useEffect(() => {
    if (open) {
      if (editTag) {
        // If editing an existing tag, populate the form with its values
        setTagName(editTag.name || "")
        setTagType(editTag.type || "Average")
        setReferTag(editTag.referTag || "")
        setUpdateCycle(editTag.updateCycle || "60")
        setUpdateUnit(editTag.updateUnit || "sec")
        setDescription(editTag.description || "")
      } else {
        // If adding a new tag, reset the form
        setTagName("")
        setTagType("Average")
        setReferTag("")
        setUpdateCycle("60")
        setUpdateUnit("sec")
        setDescription("")
      }
      // Close tag selection dialog if it was open
      setTagSelectionDialogOpen(false)
    }
  }, [open, editTag])

  // Handle tag selection from the tag selection dialog
  const handleTagSelection = (selectedTag: any) => {
    setReferTag(selectedTag.name)
  }

  const handleSubmit = () => {
    // Create a tag object based on the form values
    const tagData = {
      id: editTag ? editTag.id : Date.now(),
      name: tagName,
      type: tagType,
      referTag: referTag,
      updateCycle: updateCycle,
      updateUnit: updateUnit,
      description: description
    }

    // Call the onSaveTag callback with the tag and whether it's an edit
    onSaveTag(tagData, !!editTag)
    
    // Close the dialog
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            New Tag
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 border rounded-md bg-slate-100 space-y-4">
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <Label htmlFor="tag-name" className="text-slate-700">Name:</Label>
            <Input 
              id="tag-name" 
              value={tagName} 
              onChange={(e) => setTagName(e.target.value)}
              className="bg-white"
              placeholder="Enter Name"
            />
          </div>
          
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <Label htmlFor="refer-tag" className="text-slate-700">Refer Tag:</Label>
            <div className="flex">
              <Input 
                id="refer-tag" 
                value={referTag} 
                onChange={(e) => setReferTag(e.target.value)}
                className="bg-white rounded-r-none"
                readOnly
              />
              <Button 
                variant="outline" 
                className="rounded-l-none px-2 bg-white border-l-0"
                onClick={() => setTagSelectionDialogOpen(true)}
              >
                ...
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <Label htmlFor="tag-type" className="text-slate-700">Type</Label>
            <Select value={tagType} onValueChange={setTagType}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Maximum">Maximum</SelectItem>
                <SelectItem value="Minimum">Minimum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <Label htmlFor="update-cycle" className="text-slate-700">Update Cycle:</Label>
            <div className="flex">
              <Input 
                id="update-cycle" 
                value={updateCycle} 
                onChange={(e) => setUpdateCycle(e.target.value)}
                className="bg-white w-full rounded-r-none"
              />
              <Select 
                value={updateUnit} 
                onValueChange={setUpdateUnit}
                defaultValue="sec"
              >
                <SelectTrigger className="bg-white w-20 rounded-l-none border-l-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sec">sec</SelectItem>
                  <SelectItem value="min">min</SelectItem>
                  <SelectItem value="hour">hour</SelectItem>
                  <SelectItem value="day">day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-[100px_1fr] items-start gap-2">
            <Label htmlFor="description" className="pt-2 text-slate-700">Description:</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="min-h-[150px] bg-white"
            />
          </div>
        </div>
        
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-gray-100">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gray-100 hover:bg-gray-200 text-black">OK</Button>
        </DialogFooter>

        {/* Tag Selection Dialog */}
        <TagSelectionDialog
          open={tagSelectionDialogOpen}
          onOpenChange={setTagSelectionDialogOpen}
          onSelectTag={handleTagSelection}
        />
      </DialogContent>
    </Dialog>
  )
}

export function StatsTagsForm() {
  const [tags, setTags] = useState<any[]>([])
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<any | null>(null)
  const [selectedTagId, setSelectedTagId] = useState<string | number | null>(null)
  const { toast } = useToast()
  
  // Load stats tags from localStorage on component mount
  useEffect(() => {
    const savedTags = localStorage.getItem('stats_tags_data')
    if (savedTags) {
      try {
        const parsedTags = JSON.parse(savedTags)
        setTags(parsedTags)
      } catch (error) {
        console.error('Error loading stats tags from localStorage:', error)
      }
    }
  }, [])

  // Save tags to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('stats_tags_data', JSON.stringify(tags))
    } catch (error) {
      console.error('Error saving stats tags to localStorage:', error)
    }
  }, [tags])

  // Function to open dialog for adding a new tag
  const handleAddTag = () => {
    setEditingTag(null) // Not editing, creating new
    setTagDialogOpen(true)
  }
  
  // Function to open dialog for modifying a tag
  const handleModifyTag = () => {
    if (selectedTagId) {
      const tagToEdit = tags.find((tag: any) => tag.id === selectedTagId)
      if (tagToEdit) {
        setEditingTag(tagToEdit)
        setTagDialogOpen(true)
      }
    } else {
      toast({
        title: "No Tag Selected",
        description: "Please select a tag to modify.",
        variant: "destructive",
      })
    }
  }
  
  // Function to save a tag (new or edited)
  const saveTag = (tag: any, isEdit: boolean) => {
    if (isEdit) {
      // Update existing tag
      setTags(tags.map((t: any) => t.id === tag.id ? tag : t))
      toast({
        title: "Tag Updated",
        description: `Tag "${tag.name}" has been updated successfully.`,
      })
    } else {
      // Add new tag
      setTags([...tags, tag])
      toast({
        title: "Tag Added",
        description: `Tag "${tag.name}" has been added successfully.`,
      })
    }
  }
  
  // Function to delete a selected tag
  const handleDeleteTag = () => {
    if (selectedTagId) {
      setTags(tags.filter((tag: any) => tag.id !== selectedTagId))
      setSelectedTagId(null)
      toast({
        title: "Tag Deleted",
        description: "The selected tag has been deleted.",
      })
    } else {
      toast({
        title: "No Tag Selected",
        description: "Please select a tag to delete.",
        variant: "destructive",
      })
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats Tags</CardTitle>
        <CardDescription>Configure statistical data points</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            type="button" 
            onClick={handleAddTag}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            Add...
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleDeleteTag}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Delete
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Refer Tag</TableHead>
                <TableHead>Update Cycle</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No stats tags defined. Click "Add..." to create a new tag.
                  </TableCell>
                </TableRow>
              ) : (
                tags.map((tag: any) => (
                  <TableRow
                    key={tag.id}
                    className={selectedTagId === tag.id ? "bg-muted" : ""}
                    onClick={() => setSelectedTagId(tag.id)}
                    style={{ cursor: 'pointer' }}
                    onDoubleClick={() => {
                      setEditingTag(tag);
                      setTagDialogOpen(true);
                    }}
                  >
                    <TableCell>{tag.name}</TableCell>
                    <TableCell>{tag.type}</TableCell>
                    <TableCell>{tag.referTag}</TableCell>
                    <TableCell>{tag.updateCycle}{tag.updateUnit}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{tag.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Stats Tag Dialog for adding/editing */}
        <StatsTagDialog 
          open={tagDialogOpen} 
          onOpenChange={setTagDialogOpen} 
          onSaveTag={saveTag}
          editTag={editingTag}
        />
      </CardContent>
    </Card>
  )
}
