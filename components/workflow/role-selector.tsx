"use client"

import { Button } from "@/components/ui/button"
import { Briefcase, Building2 } from "lucide-react"
import type { UserRole } from "@/types/workflow"
import { cn } from "@/lib/utils"

interface RoleSelectorProps {
  selectedRole: UserRole
  onRoleChange: (role: UserRole) => void
}

export function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRoleChange("sales")}
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 transition-colors",
          selectedRole === "sales"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Briefcase className="h-4 w-4" />
        営業
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRoleChange("office")}
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 transition-colors",
          selectedRole === "office"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Building2 className="h-4 w-4" />
        事務
      </Button>
    </div>
  )
}
