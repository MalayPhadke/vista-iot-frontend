import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ExportConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportConfigDialog({ open, onOpenChange }: ExportConfigDialogProps) {
  const { toast } = useToast()

  const handleExport = () => {
    // Simulate export
    toast({
      title: "Configuration exported",
      description: "The configuration has been exported successfully.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Configuration</DialogTitle>
          <DialogDescription>Export the current gateway configuration to a file.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Export Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="network" defaultChecked />
              <label
                htmlFor="network"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Network Settings
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="security" defaultChecked />
              <label
                htmlFor="security"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Security Settings
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="protocols" defaultChecked />
              <label
                htmlFor="protocols"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Protocol Settings
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="hardware" defaultChecked />
              <label
                htmlFor="hardware"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Hardware Settings
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

