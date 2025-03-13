"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { CheckIcon, UpdateIcon } from "@radix-ui/react-icons"

interface StatusUpdateProps {
  currentStatus: string
  onStatusChange: (newStatus: string) => Promise<void>
  statusOptions: {
    value: string
    label: string
  }[]
  buttonSize?: "default" | "sm" | "lg" | "icon"
  buttonVariant?: "default" | "outline" | "secondary" | "ghost"
}

export function StatusUpdate({
  currentStatus,
  onStatusChange,
  statusOptions,
  buttonSize = "sm",
  buttonVariant = "outline",
}: StatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const getCurrentStatusLabel = () => {
    const option = statusOptions.find((option) => option.value === currentStatus)
    return option ? option.label : "Unknown"
  }

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false)
      return
    }

    setIsUpdating(true)
    try {
      await onStatusChange(newStatus)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
      setIsOpen(false)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize}
          disabled={isUpdating}
          className="flex items-center gap-1"
        >
          {isUpdating ? (
            <>
              <UpdateIcon className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <span>Status: {getCurrentStatusLabel()}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={isUpdating || currentStatus === option.value}
            className="flex items-center gap-2"
          >
            {currentStatus === option.value && (
              <CheckIcon className="h-4 w-4" />
            )}
            <span className={currentStatus === option.value ? "font-medium" : ""}>
              {option.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 