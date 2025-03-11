import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface ResetConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResetConfigDialog({ open, onOpenChange }: ResetConfigDialogProps) {
  const { toast } = useToast()

  const handleReset = () => {
    // Simulate reset
    toast({
      title: "Configuration reset",
      description: "The gateway has been reset to factory defaults. The system will restart.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset to Factory Defaults</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset the gateway to factory defaults? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReset}>
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

