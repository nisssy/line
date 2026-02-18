"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { Project } from "@/types/workflow"
import {
  MaterialInfoForm,
  createDefaultMaterial,
  SAMPLE_ANNIVERSARY_PACKS,
} from "@/components/projects/material-info-form"
import type { MaterialInfo } from "@/components/projects/material-info-form"
import { ArrowLeft, ChevronUp, ChevronDown, Plus, Trash2, RefreshCw, ArrowRightLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProjectFormProps {
  onBack: () => void
  onSubmit: (project: Project) => void
}

// サンプル法人データ
const companies = [
  { id: "c1", name: "株式会社メガホールディングス", corpId: "CORP-001" },
  { id: "c2", name: "サンライズグループ", corpId: "CORP-002" },
  { id: "c3", name: "グランドパレス株式会社", corpId: "CORP-003" },
  { id: "c4", name: "ロイヤルホールディングス", corpId: "CORP-004" },
  { id: "c5", name: "株式会社XXXX", corpId: "CORP-005" },
]

// 全店舗データ（法人IDを紐付け）
const allStores = [
  { id: "s1", name: "メガホール大阪", location: "大阪府大阪市", hallId: "CORP-001-HALL-01", companyId: "c1" },
  { id: "s2", name: "メガホール東京", location: "東京都新宿区", hallId: "CORP-001-HALL-02", companyId: "c1" },
  { id: "s3", name: "メガホール名古屋", location: "愛知県名古屋市", hallId: "CORP-001-HALL-03", companyId: "c1" },
  { id: "s4", name: "サンライズホール名古屋", location: "愛知県名古屋市", hallId: "CORP-002-HALL-01", companyId: "c2" },
  { id: "s5", name: "サンライズホール福岡", location: "福岡県福岡市", hallId: "CORP-002-HALL-02", companyId: "c2" },
  { id: "s6", name: "グランドパレス横浜", location: "神奈川県横浜市", hallId: "CORP-003-HALL-01", companyId: "c3" },
  { id: "s7", name: "グランドパレス仙台", location: "宮城県仙台市", hallId: "CORP-003-HALL-02", companyId: "c3" },
  { id: "s8", name: "ロイヤルホール札幌", location: "北海道札幌市", hallId: "CORP-004-HALL-01", companyId: "c4" },
  { id: "s9", name: "ロイヤルホール広島", location: "広島県広島市", hallId: "CORP-004-HALL-02", companyId: "c4" },
  { id: "s10", name: "XXXXX店", location: "北海道札幌市", hallId: "CORP-005-HALL-01", companyId: "c5" },
]

const CIRCLED_NUMBERS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"]

function toCircledNumber(n: number): string {
  return CIRCLED_NUMBERS[n - 1] || `(${n})`
}

export function ProjectForm({ onBack, onSubmit }: ProjectFormProps) {
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedStore, setSelectedStore] = useState("")
  const [projectName, setProjectName] = useState("")
  const [salesRep, setSalesRep] = useState("")
  const [requestDate, setRequestDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const [materials, setMaterials] = useState<MaterialInfo[]>([
    createDefaultMaterial("1"),
  ])

  const availableStores = selectedCompany
    ? allStores.filter((s) => s.companyId === selectedCompany)
    : allStores
  const selectedStoreData = allStores.find((s) => s.id === selectedStore)
  const selectedCompanyData = companies.find((c) => c.id === selectedCompany)

  const handleStoreChange = (storeId: string) => {
    setSelectedStore(storeId)
    const store = allStores.find((s) => s.id === storeId)
    if (store) {
      setSelectedCompany(store.companyId)
    }
  }

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId)
    if (selectedStore) {
      const currentStore = allStores.find((s) => s.id === selectedStore)
      if (currentStore && currentStore.companyId !== companyId) {
        setSelectedStore("")
      }
    }
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

  const handleSubmit = () => {
    if (!selectedCompany || !selectedStore) return

    const newProject: Project = {
      id: `new-${Date.now()}`,
      code: `P${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
      status: "pending",
      companyName: selectedCompanyData?.name || "",
      hallName: selectedStoreData?.name || "",
      date: requestDate,
      location: selectedStoreData?.location || "",
      budget: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    onSubmit(newProject)
  }

  const isValid = selectedCompany && selectedStore

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
              {/* 法人名 / 法人ID */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">法人名</Label>
                  <Select
                    value={selectedCompany}
                    onValueChange={handleCompanyChange}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="法人名を検索..." />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">法人ID</Label>
                  <Input
                    value={selectedCompanyData?.corpId || ""}
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
                  <Select
                    value={selectedStore}
                    onValueChange={handleStoreChange}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="ホール名を検索..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">ホールID</Label>
                  <Input
                    value={selectedStoreData?.hallId || ""}
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
                  placeholder="例: マルハン渋谷店 - 山田 太郎"
                  className="bg-white"
                />
              </div>

              {/* ホール担当営業 / 依頼日 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">ホール担当営業</Label>
                  <Input
                    value={salesRep}
                    onChange={(e) => setSalesRep(e.target.value)}
                    placeholder="例: 山田 太郎"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">依頼日</Label>
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
