"use client"

import { useConfigStore } from "@/lib/stores/configuration-store"
import { toast } from "sonner"
import { useState } from "react"

export function HardwareForm() {
  const { updateConfig } = useConfigStore()
  const [isSaving, setIsSaving] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      updateConfig(['hardware'], {
        com_ports: {
          com1: {
            mode: formData.get('com1-mode'),
            baudrate: parseInt(formData.get('com1-baudrate') as string)
          },
          com2: {
            mode: formData.get('com2-mode'),
            baudrate: parseInt(formData.get('com2-baudrate') as string)
          }
        },
        watchdog: {
          enabled: formData.get('watchdog-enabled') === 'true',
          timeout: parseInt(formData.get('watchdog-timeout') as string)
        }
      })

      toast.success('Hardware settings saved successfully!', {
        duration: 3000,
      })
    } catch (error) {
      console.error('Error saving hardware settings:', error)
      toast.error('Failed to save hardware settings. Please try again.', {
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }
} 