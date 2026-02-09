"use client"

import { useState } from "react"
import { WorkflowContainer } from "@/components/workflow/workflow-container"
import { RoleSelector } from "@/components/workflow/role-selector"
import { Button } from "@/components/ui/button"
import type { UserRole, ProjectStatus } from "@/types/workflow"
import { ArrowLeft } from "lucide-react"

interface ProjectDetailProps {
  projectId: string
  onBack: () => void
  onStatusChange: (status: ProjectStatus) => void
}

export function ProjectDetail({ projectId, onBack, onStatusChange }: ProjectDetailProps) {
  const [role, setRole] = useState<UserRole>("sales")

  const handleWorkflowStatusChange = (status: "preparing" | "skipped") => {
    onStatusChange(status)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">L</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">LINE広告管理システム</h1>
                <p className="text-xs text-muted-foreground">ワークフロー管理</p>
              </div>
            </div>
          </div>
          <RoleSelector selectedRole={role} onRoleChange={setRole} />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <WorkflowContainer role={role} onStatusChange={handleWorkflowStatusChange} />
      </main>
    </div>
  )
}
