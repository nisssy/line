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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { UserRole, ProjectStatus, Project, CompanyData, HallData } from "@/types/workflow"
import { CompanyHallCombobox } from "@/components/projects/company-hall-combobox"
import { initialCompanies, initialHalls } from "@/lib/master-data"
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  ArrowRightLeft,
  Plus,
  Trash2,
} from "lucide-react"

interface ProjectDetailProps {
  projectId: string
  project?: Project
  onBack: () => void
  onStatusChange: (status: ProjectStatus) => void
  onProjectUpdate: (updatedProject: Project) => void
}

const CIRCLED_NUMBERS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"]

function toCircledNumber(n: number): string {
  return CIRCLED_NUMBERS[n - 1] || `(${n})`
}

export function ProjectDetail({
  projectId,
  project,
  onBack,
  onStatusChange,
  onProjectUpdate,
}: ProjectDetailProps) {
  const [role, setRole] = useState<UserRole>("sales")

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

  const [materials, setMaterials] = useState<MaterialInfo[]>([
    {
      id: "1",
      category: "event",
      division: "line_ad",
      usageMethod: "anniversary_pack",
      selectedPackId: "pack-1",
      billingAmount: "",
      isOpen: true,
      isConfirmed: true,
    },
  ])

  const handleWorkflowStatusChange = (status: "preparing" | "skipped") => {
    onStatusChange(status)
  }

  const updateMaterial = (id: string, updates: Partial<MaterialInfo>) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    )
  }

  const toggleMaterial = (id: string, isOpen: boolean) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isOpen } : m))
    )
  }

  const handleAddMaterial = () => {
    const newId = String(Date.now())
    setMaterials((prev) => [...prev, createDefaultMaterial(newId)])
  }

  const handleRemoveMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  const handleConfirmMaterial = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isConfirmed: true } : m))
    )
  }

  const handleBackWithSave = () => {
    if (project) {
      const confirmedMaterials = materials.filter((m) => m.isConfirmed)
      const firstMaterial = confirmedMaterials[0] || materials[0]

      const updatedProject: Project = {
        ...project,
        name: projectName,
        companyName: selectedCompany?.name || project.companyName,
        companyId: selectedCompany?.companyId || project.companyId,
        hallName: selectedHall?.name || project.hallName || "",
        hallId: selectedHall?.hallId || project.hallId || "",
        salesRep: salesRep,
        createdAt: requestDate,
        materialCount: Math.max(materials.length, 1),
        category: firstMaterial?.category === "event" ? "イベント" : firstMaterial?.category === "option" ? "オプション" : firstMaterial?.category === "point" ? "ポイント" : project.category,
        division: firstMaterial?.division === "line_ad" ? "LINE広告" : project.division,
      }
      onProjectUpdate(updatedProject)
    }
    onBack()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-base font-bold text-primary-foreground">
                J
              </span>
            </div>
            <span className="text-base font-bold text-foreground">DMM</span>
            <span className="text-sm text-muted-foreground">Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1.5"
            >
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
              onClick={() =>
                setRole(role === "sales" ? "office" : "sales")
              }
            >
              <ArrowRightLeft className="h-4 w-4" />
              ロールを変更
            </Button>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackWithSave}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">案件編集</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 pb-12 space-y-6">
        {/* ===== 基本情報 ===== */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-bold text-foreground border-b-2 border-foreground pb-2 mb-6">
              基本情報
            </h2>
            <div className="space-y-5">
              {/* 法人名・ホール名 検索選択 */}
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">法人名・ホール名</Label>
                <CompanyHallCombobox
                  selectedCompany={selectedCompany}
                  selectedHall={selectedHall}
                  onSelectCompany={setSelectedCompany}
                  onSelectHall={setSelectedHall}
                />
              </div>

              {/* 法人名 / 法人ID */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">法人名</Label>
                  <Input
                    value={selectedCompany?.name || ""}
                    readOnly
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">法人ID</Label>
                  <Input
                    value={selectedCompany?.companyId || ""}
                    readOnly
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* ホール名 / ホールID */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">ホール名</Label>
                  <Input
                    value={selectedHall?.name || ""}
                    readOnly
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">ホールID</Label>
                  <Input
                    value={selectedHall?.hallId || ""}
                    readOnly
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* 案件名 */}
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">案件名</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-white"
                />
              </div>

              {/* ホール担当営業 / 依頼日 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">
                    ホール担当営業
                  </Label>
                  <Input
                    value={salesRep}
                    onChange={(e) => setSalesRep(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">
                    依頼日
                  </Label>
                  <Input
                    type="date"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== 商材情報（複数） ===== */}
        {materials.map((material, index) => (
          <Card key={material.id} className="shadow-sm">
            <Collapsible
              open={material.isOpen}
              onOpenChange={(open) => toggleMaterial(material.id, open)}
            >
              <CardContent className="p-6">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h2 className="text-base font-bold text-foreground">
                    商材情報{toCircledNumber(index + 1)}
                  </h2>
                  <div className="flex items-center gap-2">
                    {materials.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveMaterial(material.id)
                        }}
                        className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {material.isOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-5 space-y-8">
                    {/* 商材 基本情報フォーム */}
                    <MaterialInfoForm
                      data={material}
                      onChange={(updates) =>
                        updateMaterial(material.id, updates)
                      }
                      purchasedPacks={SAMPLE_ANNIVERSARY_PACKS}
                      onConfirm={() => handleConfirmMaterial(material.id)}
                    />

                    {/* 確定済みの商材にはワークフローを埋め込み */}
                    {material.isConfirmed && (
                      <>
                        <Separator />
                        <WorkflowContainer
                          role={role}
                          embedded
                          renderChatPanel
                          materialName={`${projectName} - 商材${toCircledNumber(index + 1)}`}
                          onStatusChange={handleWorkflowStatusChange}
                          materialUsageMethod={material.usageMethod}
                          materialSelectedPackId={material.selectedPackId}
                          materialSelectedPackTitle={
                            SAMPLE_ANNIVERSARY_PACKS.find(p => p.id === material.selectedPackId)?.title
                          }
                        />
                      </>
                    )}
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Collapsible>
          </Card>
        ))}

        {/* 商材を追加ボタン */}
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={handleAddMaterial}
          >
            <Plus className="h-4 w-4" />
            商材を追加
          </Button>
        </div>
      </main>
    </div>
  )
}
