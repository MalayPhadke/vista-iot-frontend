import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ImportConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportConfigDialog({ open, onOpenChange }: ImportConfigDialogProps) {
  const { toast } = useToast()

  const handleImport = () => {
    // Simulate import
    toast({
      title: "Configuration imported",
      description: "The configuration has been imported successfully. A restart may be required.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Configuration</DialogTitle>
          <DialogDescription>
            Import a gateway configuration file. This will overwrite your current settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="config-file">Configuration File</Label>
            <Input id="config-file" type="file" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

