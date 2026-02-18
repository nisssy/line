"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Project, ProjectStatus } from "@/types/workflow"
import { Calendar, MapPin, Building2, User, FileText, Edit, Plus } from "lucide-react"

interface ProjectCardProps {
  project: Project
  onViewDetail: (projectId: string) => void
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  confirmed: { label: "イベント終了処理中", className: "bg-blue-600 hover:bg-blue-700 text-white" },
  in_progress: { label: "進行中", className: "bg-green-600 hover:bg-green-700 text-white" },
  pending: { label: "承認待ち", className: "bg-yellow-500 hover:bg-yellow-600 text-white" },
  completed: { label: "完了", className: "bg-gray-500 hover:bg-gray-600 text-white" },
  preparing: { label: "配信準備中", className: "bg-purple-500 hover:bg-purple-600 text-white" },
  skipped: { label: "見送り", className: "bg-red-500 hover:bg-red-600 text-white" },
}

export function ProjectCard({ project, onViewDetail }: ProjectCardProps) {
  const status = statusConfig[project.status] || statusConfig.confirmed

  return (
    <Card className="bg-card shadow-sm border-border">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-foreground">秋のキャンペーン⑤</h3>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>案件No: {project.code}</span>
              <Badge variant="secondary" className="font-normal text-xs bg-muted text-muted-foreground border-border">
                1件の商材
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Info Section */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
          <div className="space-y-3 flex-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">法人名:</span>
                <span className="font-medium">{project.companyName}</span>
              </div>
              <div className="pl-6 text-xs text-muted-foreground">
                法人ID: CORP-010
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">ホール名:</span>
                <span className="font-medium">{project.hallName}</span>
              </div>
              <div className="pl-6 text-xs text-muted-foreground">
                ホールID: CORP-010-HALL-03
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">担当営業:</span>
                <span className="font-medium">山田太郎</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">依頼日:</span>
                <span className="font-medium">{project.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetail(project.id)}>
              <Edit className="mr-2 h-4 w-4" />
              案件を編集
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              見積書作成
            </Button>
            <Button variant="outline" size="sm" onClick={() => onViewDetail(project.id)}>
              <Plus className="mr-2 h-4 w-4" />
              商材を追加
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Footer Detail Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">秋のキャンペーン⑤</span>
              <Badge className={`${status.className} border-0`}>
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`ordered-${project.id}`} className="text-sm text-muted-foreground">受注済み</Label>
              <Switch id={`ordered-${project.id}`} defaultChecked />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">案件NO: {project.code}</div>
              <div className="font-medium">{project.hallName}</div>
            </div>
            
            {/* Empty column for alignment if needed, or merge with above */}
            <div className="hidden md:block"></div>
            <div className="hidden md:block"></div>
            <div className="hidden md:block"></div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">実施日</div>
              <div className="flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3" />
                {project.date}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">商材カテゴリ</div>
              <div className="font-medium">イベント</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">イベント区分</div>
              <div className="font-medium">LINE広告</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">見積金額</div>
              <div className="font-bold text-lg">¥{project.budget.toLocaleString()}</div>
            </div>

            <div className="space-y-1 md:col-start-4">
              <div className="text-xs text-muted-foreground text-right">担当営業</div>
              <div className="font-medium text-right">山田 太郎</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

