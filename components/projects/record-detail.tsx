"use client"

import { useState } from "react"
import { WorkflowContainer } from "@/components/workflow/workflow-container"
import { Stepper, twoStepConfig } from "@/components/workflow/stepper"
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
import type { UserRole, RecordData, Project, WorkflowStep } from "@/types/workflow"
import {
  ArrowLeft,
  RefreshCw,
  ArrowRightLeft,
  FileText,
  ChevronDown,
  Save,
} from "lucide-react"

interface RecordDetailProps {
  record: RecordData
  project?: Project
  onBack: () => void
  onRecordUpdate?: (updatedRecord: RecordData) => void
}

function getStatusBadgeClass(status: string): string {
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

export function RecordDetail({ record, project, onBack, onRecordUpdate }: RecordDetailProps) {
  const [role, setRole] = useState<UserRole>("sales")
  const [applicationInfoOpen, setApplicationInfoOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1)
  const completedSteps: WorkflowStep[] = []

  // 編集用ローカルステート
  const [editData, setEditData] = useState({
    recordNumber: record.recordNumber,
    orderDate: record.orderDate || "",
    storeCode: record.storeCode,
    storeName: record.storeName,
    publicationStartDate: record.publicationStartDate,
    publicationEndDate: record.publicationEndDate,
    publicationDays: record.publicationDays,
    netAmount: record.netAmount,
    dailyBudget: record.dailyBudget,
    deliveryArea: record.deliveryArea,
    target: record.target,
    materialCategory: record.materialCategory,
    materialName: record.materialName,
    campaignObjective: record.campaignObjective || "",
    billingMethod: record.billingMethod || "",
  })
  const [hasChanges, setHasChanges] = useState(false)

  const updateField = (field: string, value: string | number) => {
    setEditData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!onRecordUpdate) return
    onRecordUpdate({
      ...record,
      ...editData,
    })
    setHasChanges(false)
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

      {/* ステッパー・ステータス・申し込み情報ボタン 固定表示 */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="text-sm text-muted-foreground">
                  ステータス: <span className="font-medium text-foreground">{record.statusLabel}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  現在の作業者: <span className="text-primary font-medium">{project?.salesRep || "未割当"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getStatusBadgeClass(record.status)}>
                {record.statusLabel}
              </Badge>
              {hasChanges && (
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  保存
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setApplicationInfoOpen(true)}
              >
                <FileText className="mr-1 h-3 w-3" />
                申し込み情報
              </Button>
            </div>
          </div>
          {/* ステッパー（2ステップ: 基本情報登録→配信レポート作成） */}
          <Stepper
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={setCurrentStep}
            steps={twoStepConfig}
          />
        </div>
      </div>

      {/* Kintone風レコード詳細 */}
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold">↓ 【営業】入力欄 ↓</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm">
              レコード保存後、「<span className="font-bold text-foreground">申請</span>」ボタンを押してください！
            </p>
            <p className="text-sm text-red-600 font-bold mt-1">
              ステータスが「未処理」のままの案件は事務側で処理致しかねますのでご了承ください。
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              なお、「申請」ボタンを押した後はレコードの編集ができなくなりますので、<br />
              必ず入力内容を確認した上で申請してください。
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-12">
        {/* 折りたたみ可能なセクション */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-muted-foreground mb-4">
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* 基本情報フィールド */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">レコード番号</Label>
              <Input
                value={editData.recordNumber}
                onChange={(e) => updateField("recordNumber", e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">営業申込日</Label>
              <Input
                type="date"
                value={project?.createdAt || ""}
                onChange={() => {}}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">発注日</Label>
              <Input
                type="date"
                value={editData.orderDate}
                onChange={(e) => updateField("orderDate", e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">獲得者</Label>
              <Input
                value={project?.salesRep || ""}
                onChange={() => {}}
                className="bg-white"
              />
            </div>
          </div>

          {/* 店舗情報 */}
          <h3 className="text-base font-bold text-foreground mb-4 border-b pb-2">店舗情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">店舗コード</Label>
              <Input
                value={editData.storeCode}
                onChange={(e) => updateField("storeCode", e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">店舗名</Label>
              <Input
                value={editData.storeName}
                onChange={(e) => updateField("storeName", e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">都道府県</Label>
              <Input
                value={project?.location?.split("県")[0] ? project.location.split("市")[0] : ""}
                onChange={() => {}}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">担当エリア</Label>
              <Input
                value={project?.area || ""}
                onChange={() => {}}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">担当営業</Label>
              <Input
                value={project?.salesRep || ""}
                onChange={() => {}}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">エリアMGR</Label>
              <Input
                value="濱元佑樹"
                onChange={() => {}}
                className="bg-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-sm text-muted-foreground">住所</Label>
            <Input
              value={project?.location || ""}
              onChange={() => {}}
              className="bg-white mt-1.5"
            />
          </div>

          <Separator className="my-6" />

          {/* 配信情報 */}
          <h3 className="text-base font-bold text-foreground mb-4 border-b pb-2">配信情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">掲載開始希望日</Label>
              <Input
                type="date"
                value={editData.publicationStartDate}
                onChange={(e) => updateField("publicationStartDate", e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">掲載終了日</Label>
              <Input
                type="date"
                value={editData.publicationEndDate}
                onChange={(e) => updateField("publicationEndDate", e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">掲載日数</Label>
              <Input
                type="number"
                min={1}
                value={editData.publicationDays}
                onChange={(e) => updateField("publicationDays", Number(e.target.value))}
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">実NET額</Label>
              <Input
                type="number"
                min={0}
                value={editData.netAmount}
                onChange={(e) => updateField("netAmount", Number(e.target.value))}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">日予算</Label>
              <Input
                type="number"
                min={0}
                value={editData.dailyBudget}
                onChange={(e) => updateField("dailyBudget", Number(e.target.value))}
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">配信エリア</Label>
              <Input
                value={editData.deliveryArea}
                onChange={(e) => updateField("deliveryArea", e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">ターゲット</Label>
              <Input
                value={editData.target}
                onChange={(e) => updateField("target", e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <Separator className="my-6" />

          {/* 商材情報 */}
          <h3 className="text-base font-bold text-foreground mb-4 border-b pb-2">商材情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">商材区分</Label>
              <Input
                value={editData.materialCategory}
                onChange={(e) => updateField("materialCategory", e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">商材名</Label>
              <Input
                value={editData.materialName}
                onChange={(e) => updateField("materialName", e.target.value)}
                className="bg-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">キャンペーン目的</Label>
              <Input
                value={editData.campaignObjective}
                onChange={(e) => updateField("campaignObjective", e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">課金方式</Label>
              <Input
                value={editData.billingMethod}
                onChange={(e) => updateField("billingMethod", e.target.value)}
                className="bg-white"
              />
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* ワークフロー */}
        <WorkflowContainer
          role={role}
          embedded
          renderChatPanel
          materialName={`${record.storeName} - ${record.materialName}`}
          twoStepMode
          currentStep={currentStep}
          onCurrentStepChange={setCurrentStep}
        />
      </main>

      {/* 申し込み情報モーダル */}
      <Dialog open={applicationInfoOpen} onOpenChange={setApplicationInfoOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>申し込み情報</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">レコード番号</Label>
                <p className="text-sm font-medium">{record.recordNumber}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">案件番号</Label>
                <p className="text-sm font-medium">{record.projectNumber}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">店舗コード</Label>
                <p className="text-sm font-medium">{record.storeCode}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">店舗名</Label>
                <p className="text-sm font-medium">{record.storeName}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">掲載開始日</Label>
                <p className="text-sm font-medium">{record.publicationStartDate}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">掲載終了日</Label>
                <p className="text-sm font-medium">{record.publicationEndDate}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">掲載日数</Label>
                <p className="text-sm font-medium">{record.publicationDays}日間</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">実NET額</Label>
                <p className="text-sm font-bold">¥{record.netAmount.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">日予算</Label>
                <p className="text-sm font-bold">¥{record.dailyBudget.toLocaleString()}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">配信エリア</Label>
                <p className="text-sm font-medium">{record.deliveryArea}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">ターゲット</Label>
                <p className="text-sm font-medium">{record.target}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">商材区分</Label>
                <p className="text-sm font-medium">{record.materialCategory}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">商材名</Label>
                <p className="text-sm font-medium">{record.materialName}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
