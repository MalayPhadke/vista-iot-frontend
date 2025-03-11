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

interface RestartGatewayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RestartGatewayDialog({ open, onOpenChange }: RestartGatewayDialogProps) {
  const { toast } = useToast()

  const handleRestart = () => {
    // Simulate restart
    toast({
      title: "Gateway restarting",
      description: "The gateway is now restarting. This may take a few minutes.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restart Gateway</DialogTitle>
          <DialogDescription>
            Are you sure you want to restart the gateway? All connections will be temporarily interrupted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRestart}>
            Restart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

