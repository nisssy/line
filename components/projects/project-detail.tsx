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
    case "pre_proposal": return "bg-orange-100 text-orange-800 border-orange-200"
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
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap w-6"></th>
                          <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">ステータス</th>
                          <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">レコード番号</th>
                          <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">商材名</th>
                          <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">店舗名</th>
                          <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">掲載開始日</th>
                          <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">掲載終了日</th>
                          <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">実NET額</th>
                          <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">日予算</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectRecords.map((record) => (
                          <tr
                            key={record.id}
                            className="border-b hover:bg-gray-50/50 transition-colors cursor-pointer"
                            onClick={() => onSelectRecord(record.id)}
                          >
                            <td className="px-3 py-2.5">
                              <div className={`h-2.5 w-2.5 rounded-sm ${
                                record.status === "pre_proposal" ? "bg-orange-500" :
                                record.status === "office_applying" ? "bg-blue-500" :
                                record.status === "office_approved" ? "bg-teal-500" :
                                record.status === "agency_pending" ? "bg-yellow-500" :
                                record.status === "agency_reviewing" ? "bg-purple-500" :
                                record.status === "in_progress" ? "bg-green-500" :
                                record.status === "completed" ? "bg-gray-500" : "bg-gray-500"
                              }`} />
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <Badge variant="outline" className={`text-xs ${getRecordStatusBadgeClass(record.status)}`}>
                                {record.statusLabel}
                              </Badge>
                            </td>
                            <td className="px-3 py-2.5">
                              <button
                                className="text-primary hover:underline font-medium text-sm"
                                onClick={(e) => { e.stopPropagation(); onSelectRecord(record.id) }}
                              >
                                {record.recordNumber}
                              </button>
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-sm">{record.materialName}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-sm">{record.storeName}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-sm">{record.publicationStartDate}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-sm">{record.publicationEndDate}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-sm">¥{record.netAmount.toLocaleString()}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-sm">¥{record.dailyBudget.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
