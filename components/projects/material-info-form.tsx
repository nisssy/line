"use client"

import { useState, useMemo } from "react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { MATERIAL_NAME_OPTIONS } from "@/types/workflow"

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
  date?: string
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
    date: "",
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
  // divisionは商材名として扱う
  if (MATERIAL_NAME_OPTIONS.includes(division)) return division
  switch (division) {
    case "line_ad": return "LINE広告"
    default: return division
  }
}

function MaterialNameCombobox({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    if (!query) return MATERIAL_NAME_OPTIONS
    return MATERIAL_NAME_OPTIONS.filter(n => n.includes(query))
  }, [query])

  const displayValue = value === "line_ad" ? "LINE広告" : (MATERIAL_NAME_OPTIONS.includes(value) ? value : value || "")

  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-muted-foreground">商材名</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn("w-full justify-between font-normal bg-white", !value && "text-muted-foreground")}
          >
            {displayValue || "商材名を選択..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder="商材名を入力..." value={query} onValueChange={setQuery} />
            <CommandList>
              <CommandEmpty>該当なし</CommandEmpty>
              <CommandGroup>
                {query && !MATERIAL_NAME_OPTIONS.includes(query) && (
                  <CommandItem
                    value={query}
                    onSelect={() => {
                      onChange(query)
                      setQuery("")
                      setOpen(false)
                    }}
                  >
                    「{query}」を使用
                  </CommandItem>
                )}
                {filtered.map((name) => (
                  <CommandItem
                    key={name}
                    value={name}
                    onSelect={() => {
                      onChange(name === "LINE広告" ? "line_ad" : name)
                      setQuery("")
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", (value === name || (value === "line_ad" && name === "LINE広告")) ? "opacity-100" : "opacity-0")} />
                    {name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
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
    data.usageMethod === "single" ||
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
              商材区分: {getCategoryLabel(data.category)}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              商材名: {getDivisionLabel(data.division)}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              {data.usageMethod === "anniversary_pack"
                ? "周年パックで実施"
                : "単発で実施"}
            </Badge>
            {data.date && (
              <Badge variant="secondary" className="text-xs font-normal">
                日付: {data.date}
              </Badge>
            )}
          </div>

          {data.usageMethod === "anniversary_pack" && selectedPack && (
            <div className="rounded-lg border border-border bg-gray-50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">使用パック</span>
                <span className="text-sm font-medium">{selectedPack.title}</span>
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
        {/* 商材区分 / 商材名 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">商材区分</Label>
            <Select value={data.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="商材区分を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="event">イベント</SelectItem>
                <SelectItem value="option">オプション</SelectItem>
                <SelectItem value="point">ポイント</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <MaterialNameCombobox
            value={data.division}
            onChange={handleDivisionChange}
            disabled={!data.category}
          />
        </div>

        {/* 日付（任意） */}
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">
            日付 <span className="text-xs">(任意)</span>
          </Label>
          <Input
            type="date"
            value={data.date || ""}
            onChange={(e) => onChange({ date: e.target.value })}
            className="bg-white md:w-1/2"
          />
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
                  {sortedPacks.map((pack) => (
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
                        {data.selectedPackId === pack.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
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
              カテゴリと商材名を選択してください。選択後に利用方法の選択が表示されます。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
