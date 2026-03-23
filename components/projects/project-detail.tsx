"use client"

import { useState } from "react"
import { WorkflowContainer } from "@/components/workflow/workflow-container"
import {
  MaterialInfoForm,
  createDefaultMaterial,
  SAMPLE_ANNIVERSARY_PACKS,
} from "@/components/projects/material-info-form"
import type { MaterialInfo } from "@/components/projects/material-info-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { UserRole, ProjectStatus, ProjectDetailStatus, Project, CompanyData, HallData, RecordData } from "@/types/workflow"
import { CompanyHallCombobox } from "@/components/projects/company-hall-combobox"
import { initialCompanies, initialHalls } from "@/lib/master-data"
import {
  ArrowLeft,
  RefreshCw,
  ArrowRightLeft,
  Plus,
  Edit,
  Building2,
  MapPin,
  User,
  Calendar,
} from "lucide-react"

interface ProjectDetailProps {
  projectId: string
  project?: Project
  records: RecordData[]
  onBack: () => void
  onStatusChange: (status: ProjectStatus) => void
  onProjectUpdate: (updatedProject: Project) => void
  onSelectRecord: (recordId: string) => void
  onAddMaterialToProject: (projectId: string) => void
}

const detailStatusConfig: Record<ProjectDetailStatus, { label: string; className: string }> = {
  proposing: { label: "提案中", className: "bg-yellow-500 text-white" },
  in_progress: { label: "進行中", className: "bg-blue-600 text-white" },
  completed: { label: "完了", className: "bg-gray-500 text-white" },
}

function getRecordStatusBadgeClass(status: string): string {
  switch (status) {
    case "office_applying": return "bg-blue-100 text-blue-800 border-blue-200"
    case "office_approved": return "bg-teal-100 text-teal-800 border-teal-200"
    case "agency_pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "agency_reviewing": return "bg-purple-100 text-purple-800 border-purple-200"
    case "in_progress": return "bg-green-100 text-green-800 border-green-200"
    case "completed": return "bg-gray-100 text-gray-800 border-gray-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function ProjectDetail({
  projectId,
  project,
  records,
  onBack,
  onStatusChange,
  onProjectUpdate,
  onSelectRecord,
  onAddMaterialToProject,
}: ProjectDetailProps) {
  const [role, setRole] = useState<UserRole>("sales")
  const [isEditing, setIsEditing] = useState(false)

  // プロジェクトの法人・ホールをマスタデータから初期化
  const initCompany = project
    ? initialCompanies.find((c) => c.companyId === project.companyId) || null
    : null
  const initHall = project
    ? initialHalls.find((h) => h.hallId === project.hallId) || null
    : null

  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(initCompany)
  const [selectedHall, setSelectedHall] = useState<HallData | null>(initHall)
  const [projectName, setProjectName] = useState(project?.name || "新規案件")
  const [salesRep, setSalesRep] = useState(project?.salesRep || "")
  const [requestDate, setRequestDate] = useState(
    project?.createdAt || new Date().toISOString().split("T")[0]
  )

  // この案件に紐づくレコード
  const projectRecords = records.filter(r => r.projectId === projectId)

  const detailStatus = project?.detailStatus || "proposing"
  const statusInfo = detailStatusConfig[detailStatus]

  const handleSave = () => {
    if (project) {
      const updatedProject: Project = {
        ...project,
        name: projectName,
        companyName: selectedCompany?.name || project.companyName,
        companyId: selectedCompany?.companyId || project.companyId,
        hallName: selectedHall?.name || project.hallName || "",
        hallId: selectedHall?.hallId || project.hallId || "",
        salesRep: salesRep,
        createdAt: requestDate,
      }
      onProjectUpdate(updatedProject)
    }
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-base font-bold text-primary-foreground">J</span>
            </div>
            <span className="text-base font-bold text-foreground">DMM</span>
            <span className="text-sm text-muted-foreground">Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
              <RefreshCw className="h-4 w-4" />
              デモ初期化
            </Button>
            <Badge
              className={`px-4 py-1.5 text-sm font-medium rounded-md ${
                role === "sales"
                  ? "bg-primary text-primary-foreground"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {role === "sales" ? "営業" : "事務"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1.5"
              onClick={() => setRole(role === "sales" ? "office" : "sales")}
            >
              <ArrowRightLeft className="h-4 w-4" />
              ロールを変更
            </Button>
          </div>
        </div>
      </header>

      {/* Title + Status */}
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {project?.hallName || project?.companyName} - {project?.salesRep}
              </h1>
              <Badge className={`${statusInfo.className} border-0 text-sm px-3 py-1`}>
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">案件No: {project?.code}</p>
          </div>
        </div>
      </div>

      {/* Main Content - 2カラム */}
      <main className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム: 案件情報 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">案件情報</h2>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-1 h-3 w-3" />
                      編集
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>キャンセル</Button>
                      <Button size="sm" onClick={handleSave}>保存</Button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm text-muted-foreground">法人名・ホール名</Label>
                      <CompanyHallCombobox
                        selectedCompany={selectedCompany}
                        selectedHall={selectedHall}
                        onSelectCompany={setSelectedCompany}
                        onSelectHall={setSelectedHall}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-muted-foreground">案件名</Label>
                      <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-muted-foreground">担当営業</Label>
                      <Input value={salesRep} onChange={(e) => setSalesRep(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-muted-foreground">依頼日</Label>
                      <Input type="date" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">法人</span>
                      </div>
                      <p className="text-base font-medium pl-6">{project?.companyName}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">ホール</span>
                      </div>
                      <p className="text-base font-medium pl-6">{project?.hallName || "—"}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">担当営業</span>
                      </div>
                      <p className="text-base font-medium pl-6">{project?.salesRep}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">依頼日</span>
                      </div>
                      <p className="text-base font-medium pl-6">{project?.createdAt}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 商材数サマリー */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>商材数</span>
                </div>
                <p className="text-3xl font-bold">{projectRecords.length}件</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {projectRecords.map((_, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {project?.division || "イベント"} {i + 1}
                    </Badge>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">合計見積金額</div>
                  <p className="text-2xl font-bold">¥{projectRecords.reduce((sum, r) => sum + r.netAmount, 0).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右カラム: 商材一覧テーブル */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-foreground">商材一覧</h2>
                    <Badge variant="secondary">{projectRecords.length}件</Badge>
                  </div>
                  <Button onClick={() => onAddMaterialToProject(projectId)}>
                    <Plus className="mr-2 h-4 w-4" />
                    商材を追加
                  </Button>
                </div>

                {projectRecords.length > 0 ? (
                  <div className="space-y-4">
                    {projectRecords.map((record, index) => (
                      <div
                        key={record.id}
                        className="rounded-lg border bg-white p-5 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onSelectRecord(record.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                {record.materialCategory}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {record.materialName}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-base">
                              {record.materialName} {project?.name?.includes("GW") ? "GW特別イベント" : "配信"}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              {record.publicationStartDate}
                            </div>
                          </div>
                          <Badge variant="outline" className={getRecordStatusBadgeClass(record.status)}>
                            {record.statusLabel}
                          </Badge>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">提案:</span>
                            <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">受注済み</Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">実施:</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {record.status === "completed" ? "終了" : "進行中"}
                            </Badge>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-muted-foreground">見積金額</div>
                            <div className="text-lg font-bold">¥{record.netAmount.toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">担当営業</div>
                            <div className="text-sm font-medium text-primary">{project?.salesRep}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">商材がまだ追加されていません</p>
                    <Button onClick={() => onAddMaterialToProject(projectId)}>
                      <Plus className="mr-2 h-4 w-4" />
                      商材を追加
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
