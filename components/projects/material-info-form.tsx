"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Check } from "lucide-react"

// ===== Types =====

export interface AnniversaryPack {
  id: string
  title: string
  expirationDate: string
}

export interface MaterialInfo {
  id: string
  category: string
  division: string
  usageMethod: string
  selectedPackId: string
  billingAmount: string
  isOpen: boolean
  isConfirmed: boolean
}

export function createDefaultMaterial(id: string): MaterialInfo {
  return {
    id,
    category: "",
    division: "",
    usageMethod: "",
    selectedPackId: "",
    billingAmount: "",
    isOpen: true,
    isConfirmed: false,
  }
}

// デモ用 周年パックデータ
export const SAMPLE_ANNIVERSARY_PACKS: AnniversaryPack[] = [
  { id: "pack-1", title: "5万円プラン", expirationDate: "2025-12-31" },
  { id: "pack-2", title: "10万円プラン", expirationDate: "2026-06-30" },
  { id: "pack-3", title: "20万円プラン", expirationDate: "2026-03-15" },
]

// ===== Component =====

interface MaterialInfoFormProps {
  data: MaterialInfo
  onChange: (updates: Partial<MaterialInfo>) => void
  purchasedPacks: AnniversaryPack[]
  onConfirm: () => void
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case "event": return "イベント"
    case "option": return "オプション"
    case "point": return "ポイント"
    default: return category
  }
}

function getDivisionLabel(division: string): string {
  switch (division) {
    case "line_ad": return "LINE広告"
    default: return division
  }
}

export function MaterialInfoForm({
  data,
  onChange,
  purchasedPacks,
  onConfirm,
}: MaterialInfoFormProps) {
  const hasPacks = purchasedPacks.length > 0
  const showUsageMethod = !!data.category && !!data.division

  const sortedPacks = [...purchasedPacks].sort(
    (a, b) =>
      new Date(a.expirationDate).getTime() -
      new Date(b.expirationDate).getTime()
  )

  const handleCategoryChange = (value: string) => {
    onChange({
      category: value,
      division: "",
      usageMethod: "",
      selectedPackId: "",
    })
  }

  const handleDivisionChange = (value: string) => {
    if (hasPacks) {
      onChange({
        division: value,
        usageMethod: "anniversary_pack",
        selectedPackId: sortedPacks[0]?.id || "",
      })
    } else {
      onChange({
        division: value,
        usageMethod: "single",
        selectedPackId: "",
      })
    }
  }

  const handleUsageMethodChange = (value: string) => {
    if (value === "anniversary_pack" && sortedPacks.length > 0) {
      onChange({
        usageMethod: value,
        selectedPackId: data.selectedPackId || sortedPacks[0].id,
        billingAmount: "",
      })
    } else {
      onChange({
        usageMethod: value,
        selectedPackId: "",
        billingAmount: "",
      })
    }
  }

  const handlePackSelect = (packId: string) => {
    onChange({ selectedPackId: packId })
  }

  const canConfirm =
    (data.usageMethod === "single" && !!data.billingAmount.trim()) ||
    (data.usageMethod === "anniversary_pack" && !!data.selectedPackId)

  // ===== 確定済み → サマリー表示 =====
  if (data.isConfirmed) {
    const selectedPack = purchasedPacks.find(
      (p) => p.id === data.selectedPackId
    )

    return (
      <div>
        <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 mb-4">
          基本情報
        </h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs font-normal">
              カテゴリ: {getCategoryLabel(data.category)}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              区分: {getDivisionLabel(data.division)}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              {data.usageMethod === "anniversary_pack"
                ? "周年パックで実施"
                : "単発で実施"}
            </Badge>
          </div>

          {data.usageMethod === "anniversary_pack" && selectedPack && (
            <div className="rounded-lg border border-border bg-gray-50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">使用パック</span>
                <span className="text-sm font-medium">{selectedPack.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">有効期限</span>
                <span className="text-sm">{selectedPack.expirationDate}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="text-sm text-muted-foreground">ホール請求額</span>
                <span className="text-sm font-bold">¥0</span>
              </div>
            </div>
          )}

          {data.usageMethod === "single" && (
            <div className="rounded-lg border border-border bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ホール請求額</span>
                <span className="text-sm font-bold">¥{Number(data.billingAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ===== 未確定 → 入力フォーム =====
  return (
    <div>
      <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 mb-5">
        基本情報
      </h3>
      <div className="space-y-5">
        {/* カテゴリ / イベント区分 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">カテゴリ</Label>
            <Select value={data.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="event">イベント</SelectItem>
                <SelectItem value="option">オプション</SelectItem>
                <SelectItem value="point">ポイント</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">イベント区分</Label>
            <Select
              value={data.division}
              onValueChange={handleDivisionChange}
              disabled={!data.category}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="区分を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line_ad">LINE広告</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 利用方法 */}
        {showUsageMethod && (
          <div className="space-y-4">
            <Label className="text-sm text-muted-foreground">利用方法</Label>
            <RadioGroup
              value={data.usageMethod}
              onValueChange={handleUsageMethodChange}
              className="gap-0"
            >
              {/* 周年パックで実施 */}
              <label
                className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
                  data.usageMethod === "anniversary_pack"
                    ? "border-primary bg-primary/5"
                    : hasPacks
                      ? "border-border bg-white hover:bg-gray-50 cursor-pointer"
                      : "border-border bg-gray-50 opacity-60"
                }`}
              >
                <RadioGroupItem
                  value="anniversary_pack"
                  id={`pack-radio-${data.id}`}
                  disabled={!hasPacks}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium">周年パックで実施</span>
                  {!hasPacks && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (購入済みパックなし)
                    </span>
                  )}
                </div>
              </label>

              {/* 周年パック一覧（周年パック選択時のみ表示） */}
              {data.usageMethod === "anniversary_pack" && hasPacks && (
                <div className="ml-8 my-2 space-y-2">
                  {sortedPacks.map((pack, idx) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => handlePackSelect(pack.id)}
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        data.selectedPackId === pack.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-white hover:border-primary/40 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {pack.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{pack.expirationDate}</span>
                          </div>
                          {idx === 0 && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 border-amber-400 text-amber-600"
                            >
                              有効期限が近い
                            </Badge>
                          )}
                          {data.selectedPackId === pack.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 単発で実施 */}
              <label
                className={`flex items-center gap-3 rounded-lg border p-4 transition-colors cursor-pointer ${
                  data.usageMethod === "single"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem
                  value="single"
                  id={`single-radio-${data.id}`}
                />
                <span className="text-sm font-medium">単発で実施</span>
              </label>
            </RadioGroup>

            {/* 単発で実施の場合の請求額入力 */}
            {data.usageMethod === "single" && (
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">請求額</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">¥</span>
                  <Input
                    type="number"
                    value={data.billingAmount}
                    onChange={(e) => onChange({ billingAmount: e.target.value })}
                    placeholder="0"
                    className="bg-white pl-7"
                  />
                </div>
              </div>
            )}

            {/* 商材追加するボタン */}
            <div className="pt-2 flex justify-end">
              <Button onClick={onConfirm} disabled={!canConfirm}>
                商材追加する
              </Button>
            </div>
          </div>
        )}

        {/* ガイダンス */}
        {!showUsageMethod && (
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
            <p className="text-sm text-muted-foreground">
              カテゴリとイベント区分を選択してください。選択後に利用方法の選択が表示されます。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
