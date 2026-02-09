"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Project } from "@/types/workflow"
import { ArrowLeft, Building2, Store } from "lucide-react"

interface ProjectFormProps {
  onBack: () => void
  onSubmit: (project: Project) => void
}

// サンプル法人データ
const companies = [
  { id: "c1", name: "株式会社メガホールディングス" },
  { id: "c2", name: "サンライズグループ" },
  { id: "c3", name: "グランドパレス株式会社" },
  { id: "c4", name: "ロイヤルホールディングス" },
  { id: "c5", name: "株式会社XXXX" },
]

// サンプル店舗データ（法人ごと）
const stores: Record<string, { id: string; name: string; location: string }[]> = {
  c1: [
    { id: "s1", name: "メガホール大阪", location: "大阪府大阪市" },
    { id: "s2", name: "メガホール東京", location: "東京都新宿区" },
    { id: "s3", name: "メガホール名古屋", location: "愛知県名古屋市" },
  ],
  c2: [
    { id: "s4", name: "サンライズホール名古屋", location: "愛知県名古屋市" },
    { id: "s5", name: "サンライズホール福岡", location: "福岡県福岡市" },
  ],
  c3: [
    { id: "s6", name: "グランドパレス横浜", location: "神奈川県横浜市" },
    { id: "s7", name: "グランドパレス仙台", location: "宮城県仙台市" },
  ],
  c4: [
    { id: "s8", name: "ロイヤルホール札幌", location: "北海道札幌市" },
    { id: "s9", name: "ロイヤルホール広島", location: "広島県広島市" },
  ],
  c5: [
    { id: "s10", name: "XXXXX店", location: "北海道札幌市" },
  ],
}

export function ProjectForm({ onBack, onSubmit }: ProjectFormProps) {
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedStore, setSelectedStore] = useState("")

  const availableStores = selectedCompany ? stores[selectedCompany] || [] : []
  const selectedStoreData = availableStores.find((s) => s.id === selectedStore)
  const selectedCompanyData = companies.find((c) => c.id === selectedCompany)

  const handleSubmit = () => {
    if (!selectedCompany || !selectedStore) return

    const newProject: Project = {
      id: `new-${Date.now()}`,
      code: `P${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
      status: "pending",
      companyName: selectedCompanyData?.name || "",
      hallName: selectedStoreData?.name || "",
      date: new Date().toISOString().split("T")[0],
      location: selectedStoreData?.location || "",
      budget: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    onSubmit(newProject)
  }

  const isValid = selectedCompany && selectedStore

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">新規案件作成</h1>
            <p className="text-xs text-muted-foreground">LINE広告案件を登録します</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>案件情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 法人選択 */}
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                法人 <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedCompany} onValueChange={(value) => {
                setSelectedCompany(value)
                setSelectedStore("")
              }}>
                <SelectTrigger id="company">
                  <SelectValue placeholder="法人を選択してください" />
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

            {/* 店舗選択 */}
            <div className="space-y-2">
              <Label htmlFor="store" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                店舗 <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={selectedStore} 
                onValueChange={setSelectedStore}
                disabled={!selectedCompany}
              >
                <SelectTrigger id="store">
                  <SelectValue placeholder={selectedCompany ? "店舗を選択してください" : "先に法人を選択してください"} />
                </SelectTrigger>
                <SelectContent>
                  {availableStores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name} ({store.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            

            {/* 登録ボタン */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onBack}>
                キャンセル
              </Button>
              <Button onClick={handleSubmit} disabled={!isValid}>
                登録
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
