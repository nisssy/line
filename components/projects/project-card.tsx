"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Project, ProjectStatus } from "@/types/workflow"
import { Calendar, MapPin, DollarSign, Eye } from "lucide-react"

interface ProjectCardProps {
  project: Project
  onViewDetail: (projectId: string) => void
}

const statusConfig: Record<ProjectStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  confirmed: { label: "確定", variant: "default" },
  in_progress: { label: "進行中", variant: "secondary" },
  pending: { label: "保留", variant: "outline" },
  completed: { label: "完了", variant: "default" },
  preparing: { label: "配信準備中", variant: "secondary" },
  skipped: { label: "見送り", variant: "destructive" },
}

export function ProjectCard({ project, onViewDetail }: ProjectCardProps) {
  const status = statusConfig[project.status]

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-sm">
                {project.code}
              </Badge>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {project.companyName} / {project.hallName}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {project.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {project.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                ¥{project.budget.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">作成日: {project.createdAt}</p>
          </div>
          <Button variant="outline" onClick={() => onViewDetail(project.id)}>
            <Eye className="mr-2 h-4 w-4" />
            詳細
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
