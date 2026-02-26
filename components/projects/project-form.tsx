"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { Project, CompanyData, HallData } from "@/types/workflow"
import {
  MaterialInfoForm,
  createDefaultMaterial,
  SAMPLE_ANNIVERSARY_PACKS,
} from "@/components/projects/material-info-form"
import type { MaterialInfo } from "@/components/projects/material-info-form"
import { CompanyHallCombobox } from "@/components/projects/company-hall-combobox"
import { ArrowLeft, ChevronUp, ChevronDown, Plus, Trash2, RefreshCw, ArrowRightLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProjectFormProps {
  onBack: () => void
  onSubmit: (project: Project) => void
}

const CIRCLED_NUMBERS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"]

function toCircledNumber(n: number): string {
  return CIRCLED_NUMBERS[n - 1] || `(${n})`
}

export function ProjectForm({ onBack, onSubmit }: ProjectFormProps) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null)
  const [selectedHall, setSelectedHall] = useState<HallData | null>(null)
  const [projectName, setProjectName] = useState("")
  const [salesRep, setSalesRep] = useState("")
  const [requestDate, setRequestDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const [materials, setMaterials] = useState<MaterialInfo[]>([
    createDefaultMaterial("1"),
  ])

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

  const handleSubmit = () => {
    if (!selectedCompany || !projectName.trim() || !requestDate) return

    const confirmedMaterials = materials.filter((m) => m.isConfirmed)
    if (confirmedMaterials.length === 0) return
    const firstMaterial = confirmedMaterials[0]

    const resolvedSalesRep = salesRep || selectedHall?.salesPersonName || ""
    if (!resolvedSalesRep) return

    const newProject: Project = {
      id: `new-${Date.now()}`,
      code: `P${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
      name: projectName,
      status: "pending",
      companyName: selectedCompany.name,
      companyId: selectedCompany.companyId,
      hallName: selectedHall?.name,
      hallId: selectedHall?.hallId,
      salesRep: resolvedSalesRep,
      date: requestDate,
      location: selectedHall?.address || "",
      budget: 0,
      createdAt: new Date().toISOString().split("T")[0],
      materialCount: Math.max(confirmedMaterials.length, 1),
      category: firstMaterial?.category === "event" ? "イベント" : firstMaterial?.category === "option" ? "オプション" : firstMaterial?.category === "point" ? "ポイント" : undefined,
      division: firstMaterial?.division === "line_ad" ? "LINE広告" : undefined,
    }

    onSubmit(newProject)
  }

  const hasConfirmedMaterial = materials.some((m) => m.isConfirmed)
  const isValid =
    !!selectedCompany &&
    !!projectName.trim() &&
    !!(salesRep || selectedHall?.salesPersonName) &&
    !!requestDate &&
    hasConfirmedMaterial

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
            <Badge className="bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium rounded-md">
              営業
            </Badge>
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
              <ArrowRightLeft className="h-4 w-4" />
              ロールを変更
            </Button>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="mx-auto max-w-3xl px-4 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">新規案件作成</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 pb-12 space-y-6">
        {/* 基本情報 */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-bold text-foreground border-b-2 border-foreground pb-2 mb-6">
              基本情報
            </h2>

            <div className="space-y-5">
              {/* 法人名・ホール名 検索選択 */}
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">法人名・ホール名 <span className="text-destructive">*</span></Label>
                <CompanyHallCombobox
                  selectedCompany={selectedCompany}
                  selectedHall={selectedHall}
                  onSelectCompany={setSelectedCompany}
                  onSelectHall={setSelectedHall}
                />
              </div>

              {/* 法人ID / ホールID */}
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
                <Label className="text-sm text-muted-foreground">案件名 <span className="text-destructive">*</span></Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="例: マルハン渋谷店 - 山田 太郎"
                  className="bg-white"
                />
              </div>

              {/* ホール担当営業 / 依頼日 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">ホール担当営業 <span className="text-destructive">*</span></Label>
                  <Input
                    value={salesRep || selectedHall?.salesPersonName || ""}
                    onChange={(e) => setSalesRep(e.target.value)}
                    placeholder="例: 山田 太郎"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">依頼日 <span className="text-destructive">*</span></Label>
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

        {/* 商材情報（複数） */}
        {materials.map((material, index) => (
          <Card key={material.id} className="shadow-sm">
            <Collapsible
              open={material.isOpen}
              onOpenChange={(open) => toggleMaterial(material.id, open)}
            >
              <CardContent className="p-6">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h2 className="text-base font-bold text-foreground">
                    商材情報{toCircledNumber(index + 1)} <span className="text-destructive text-sm">*</span>
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
                    <MaterialInfoForm
                      data={material}
                      onChange={(updates) => updateMaterial(material.id, updates)}
                      purchasedPacks={SAMPLE_ANNIVERSARY_PACKS}
                      onConfirm={() => handleConfirmMaterial(material.id)}
                    />
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Collapsible>
          </Card>
        ))}

        {/* ボタン */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button variant="outline" className="gap-1.5" onClick={handleAddMaterial}>
            <Plus className="h-4 w-4" />
            商材を追加
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-8"
          >
            案件を作成
          </Button>
        </div>
      </main>
    </div>
  )
}
