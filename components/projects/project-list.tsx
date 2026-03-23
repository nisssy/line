"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import type { Project, CompanyData, HallData, RecordData, SavedSearchCondition } from "@/types/workflow"
import { MATERIAL_NAME_OPTIONS } from "@/types/workflow"
import { Search, X, Plus, Calendar as CalendarIcon, Check, ChevronsUpDown, Download, Save, Trash2, ChevronDown, ChevronUp, RefreshCw, ArrowRightLeft } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { initialCompanies, initialHalls, searchCompanies, searchHalls } from "@/lib/master-data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface ProjectListProps {
  onSelectProject: (projectId: string) => void
  onSelectRecord: (recordId: string) => void
  onCreateProject: () => void
  onAddMaterial: () => void
  projects: Project[]
  records: RecordData[]
}

// サンプルデータ（マスタデータ整合）
export const sampleProjects: Project[] = [
  {
    id: "1",
    code: "PJ-001",
    name: "パールショップともえ川越店 - 齋藤昌弘",
    status: "confirmed",
    detailStatus: "in_progress",
    companyName: "株式会社ビッグパチンコ",
    companyId: "CORP-010",
    hallName: "パールショップともえ川越店",
    hallId: "CORP-010-HALL-03",
    salesRep: "齋藤昌弘",
    date: "2026-03-16",
    location: "埼玉県川越市",
    budget: 40000,
    createdAt: "2026-03-12",
    materialCount: 1,
    category: "イベント",
    division: "LINE広告",
    area: "東京本社②",
  },
  {
    id: "2",
    code: "PJ-002",
    name: "ユーコーラッキー長崎店 - 佐藤次郎",
    status: "in_progress",
    detailStatus: "proposing",
    companyName: "株式会社ダイナム",
    companyId: "CORP-002",
    hallName: "ユーコーラッキー長崎店",
    hallId: "CORP-002-HALL-02",
    salesRep: "佐藤 次郎",
    date: "2026-03-21",
    location: "長崎県長崎市",
    budget: 20000,
    createdAt: "2026-03-12",
    materialCount: 1,
    category: "イベント",
    division: "LINE広告",
    area: "関東②",
  },
  {
    id: "3",
    code: "PJ-003",
    name: "エスパス日拓高田馬場 - 山田 太郎",
    status: "pending",
    detailStatus: "proposing",
    companyName: "日拓グループ",
    companyId: "CORP-003",
    hallName: "エスパス日拓高田馬場",
    hallId: "CORP-003-HALL-08",
    salesRep: "山田 太郎",
    date: "2026-01-20",
    location: "東京都新宿区",
    budget: 720000,
    createdAt: "2026-02-08",
    materialCount: 1,
    category: "イベント",
    division: "トリニティガール",
    area: "関東③",
  },
  {
    id: "4",
    code: "PJ-004",
    name: "BEAM店 - 高橋四郎",
    status: "completed",
    detailStatus: "completed",
    companyName: "株式会社エース",
    companyId: "CORP-004",
    hallName: "BEAM店",
    hallId: "CORP-004-HALL-04",
    salesRep: "高橋 四郎",
    date: "2026-03-17",
    location: "東京都",
    budget: 33000,
    createdAt: "2026-03-12",
    materialCount: 1,
    category: "イベント",
    division: "LINE広告",
    area: "大手法人",
  },
]

// サンプルレコードデータ
export const sampleRecords: RecordData[] = [
  {
    id: "r1",
    recordNumber: "13829",
    recordTitle: "レコードNo.138…",
    projectId: "1",
    projectNumber: "PJ-001",
    status: "office_applying",
    statusLabel: "[事務] 申請中",
    orderDate: "",
    storeCode: "P02288",
    storeName: "JOY PARK店",
    publicationStartDate: "2026-03-21",
    publicationEndDate: "2026-03-23",
    publicationDays: 3,
    netAmount: 50000,
    dailyBudget: 16667,
    deliveryArea: "川越市",
    target: "この地域に住んでいる人",
    materialCategory: "イベント",
    materialName: "LINE広告",
    campaignObjective: "ウェブサイトアクセス",
    billingMethod: "CPC",
  },
  {
    id: "r2",
    recordNumber: "13828",
    recordTitle: "レコードNo.138…",
    projectId: "2",
    projectNumber: "PJ-002",
    status: "office_approved",
    statusLabel: "[事務] 事務承認",
    orderDate: "",
    storeCode: "P02284",
    storeName: "パチンコ店",
    publicationStartDate: "2026-03-19",
    publicationEndDate: "2026-03-21",
    publicationDays: 3,
    netAmount: 21000,
    dailyBudget: 7000,
    deliveryArea: "長崎県長崎市",
    target: "この地域に住んでいる人",
    materialCategory: "イベント",
    materialName: "LINE広告",
    campaignObjective: "ウェブサイトアクセス",
    billingMethod: "CPC",
  },
  {
    id: "r3",
    recordNumber: "13827",
    recordTitle: "レコードNo.138…",
    projectId: "3",
    projectNumber: "PJ-003",
    status: "office_applying",
    statusLabel: "[事務] 申請中",
    orderDate: "",
    storeCode: "P06498",
    storeName: "グランパ店",
    publicationStartDate: "2026-03-25",
    publicationEndDate: "2026-03-29",
    publicationDays: 5,
    netAmount: 25000,
    dailyBudget: 5000,
    deliveryArea: "広島県三次市",
    target: "この地域に住んでいる人",
    materialCategory: "イベント",
    materialName: "LINE広告",
    campaignObjective: "ウェブサイトアクセス",
    billingMethod: "CPC",
  },
]

const statusOptions = [
  { value: "office_applying", label: "[事務] 申請中" },
  { value: "office_approved", label: "[事務] 事務承認" },
  { value: "agency_pending", label: "[代理店様] 受領待ち" },
  { value: "agency_reviewing", label: "[代理店様] 審査中" },
  { value: "in_progress", label: "進行中" },
  { value: "completed", label: "完了" },
]

const SEARCH_CONDITIONS_KEY = "savedSearchConditions"

function getStatusBadgeClass(status: string): string {
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

function getStatusDotClass(status: string): string {
  switch (status) {
    case "office_applying": return "bg-blue-500"
    case "office_approved": return "bg-teal-500"
    case "agency_pending": return "bg-yellow-500"
    case "agency_reviewing": return "bg-purple-500"
    case "in_progress": return "bg-green-500"
    case "completed": return "bg-gray-500"
    default: return "bg-gray-500"
  }
}

export function ProjectList({ onSelectProject, onSelectRecord, onCreateProject, onAddMaterial, projects, records }: ProjectListProps) {
  const [activeTab, setActiveTab] = useState<"list" | "messages">("list")
  const [filterCompany, setFilterCompany] = useState<CompanyData | null>(null)
  const [filterHall, setFilterHall] = useState<HallData | null>(null)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [hallOpen, setHallOpen] = useState(false)
  const [companyQuery, setCompanyQuery] = useState("")
  const [hallQuery, setHallQuery] = useState("")
  const [companyHallTab, setCompanyHallTab] = useState<"company" | "hall">("company")
  const [filterArea, setFilterArea] = useState("all")
  const [filterStatuses, setFilterStatuses] = useState<string[]>([])
  const [filterMaterialCategory, setFilterMaterialCategory] = useState("all")
  const [filterMaterialName, setFilterMaterialName] = useState("")
  const [materialNameOpen, setMaterialNameOpen] = useState(false)
  const [materialNameQuery, setMaterialNameQuery] = useState("")
  const [filterProjectNumber, setFilterProjectNumber] = useState("")
  const [filterRecordNumber, setFilterRecordNumber] = useState("")
  const [filterProjectName, setFilterProjectName] = useState("")
  const [filterSalesRep, setFilterSalesRep] = useState("")
  const [searchOpen, setSearchOpen] = useState(true)

  // 検索条件保存
  const [savedConditions, setSavedConditions] = useState<SavedSearchCondition[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SEARCH_CONDITIONS_KEY)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveConditionName, setSaveConditionName] = useState("")
  const [conditionsListOpen, setConditionsListOpen] = useState(false)

  const filteredCompanies = useMemo(
    () => searchCompanies(initialCompanies, companyQuery),
    [companyQuery]
  )
  const filteredHalls = useMemo(
    () => searchHalls(initialHalls, hallQuery, filterCompany?.id),
    [hallQuery, filterCompany?.id]
  )

  const filteredMaterialNames = useMemo(() => {
    if (!materialNameQuery) return MATERIAL_NAME_OPTIONS
    return MATERIAL_NAME_OPTIONS.filter(n => n.includes(materialNameQuery))
  }, [materialNameQuery])

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (filterArea !== "all") {
        const project = projects.find(p => p.id === record.projectId)
        if (project && project.area !== filterArea) return false
      }
      if (filterStatuses.length > 0 && !filterStatuses.includes(record.status)) return false
      if (filterMaterialCategory !== "all" && record.materialCategory !== (filterMaterialCategory === "event" ? "イベント" : filterMaterialCategory === "option" ? "オプション" : "ポイント")) return false
      if (filterMaterialName && record.materialName !== filterMaterialName) return false
      if (filterProjectNumber && !record.projectNumber.includes(filterProjectNumber)) return false
      if (filterRecordNumber && !record.recordNumber.includes(filterRecordNumber)) return false
      if (filterProjectName) {
        const project = projects.find(p => p.id === record.projectId)
        if (project && !project.name.includes(filterProjectName)) return false
      }
      return true
    })
  }, [records, projects, filterArea, filterStatuses, filterMaterialCategory, filterMaterialName, filterProjectNumber, filterRecordNumber, filterProjectName])

  const toggleStatus = (status: string) => {
    setFilterStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const clearAllFilters = () => {
    setFilterCompany(null)
    setFilterHall(null)
    setFilterArea("all")
    setFilterStatuses([])
    setFilterMaterialCategory("all")
    setFilterMaterialName("")
    setFilterProjectNumber("")
    setFilterRecordNumber("")
    setFilterProjectName("")
    setFilterSalesRep("")
  }

  const handleSaveCondition = () => {
    if (!saveConditionName.trim()) return
    const newCondition: SavedSearchCondition = {
      id: String(Date.now()),
      name: saveConditionName,
      conditions: {
        materialCategory: filterMaterialCategory !== "all" ? filterMaterialCategory : undefined,
        materialName: filterMaterialName || undefined,
        area: filterArea !== "all" ? filterArea : undefined,
        statuses: filterStatuses.length > 0 ? filterStatuses : undefined,
        projectNumber: filterProjectNumber || undefined,
        recordNumber: filterRecordNumber || undefined,
        projectName: filterProjectName || undefined,
        salesRep: filterSalesRep || undefined,
      },
      createdAt: new Date().toISOString().split("T")[0],
    }
    const updated = [...savedConditions, newCondition]
    setSavedConditions(updated)
    localStorage.setItem(SEARCH_CONDITIONS_KEY, JSON.stringify(updated))
    setSaveConditionName("")
    setSaveDialogOpen(false)
  }

  const handleDeleteCondition = (id: string) => {
    const updated = savedConditions.filter(c => c.id !== id)
    setSavedConditions(updated)
    localStorage.setItem(SEARCH_CONDITIONS_KEY, JSON.stringify(updated))
  }

  const handleLoadCondition = (condition: SavedSearchCondition) => {
    const c = condition.conditions
    if (c.materialCategory) setFilterMaterialCategory(c.materialCategory)
    if (c.materialName) setFilterMaterialName(c.materialName)
    if (c.area) setFilterArea(c.area)
    if (c.statuses) setFilterStatuses(c.statuses)
    if (c.projectNumber) setFilterProjectNumber(c.projectNumber)
    if (c.recordNumber) setFilterRecordNumber(c.recordNumber)
    if (c.projectName) setFilterProjectName(c.projectName)
    setConditionsListOpen(false)
  }

  const handleExportRecords = () => {
    const headers = ["ステータス", "レコードタイトル", "発注日", "レコード番号", "店舗コード", "店舗名", "掲載開始希望日", "掲載終了日", "掲載日数", "実NET額", "日予算", "キャンペーン目的", "課金方式"]
    const rows = filteredRecords.map(r => [
      r.statusLabel, r.recordTitle, r.orderDate, r.recordNumber,
      r.storeCode, r.storeName, r.publicationStartDate, r.publicationEndDate,
      String(r.publicationDays), `¥${r.netAmount.toLocaleString()}`, `¥${r.dailyBudget.toLocaleString()}`,
      r.campaignObjective || "", r.billingMethod || ""
    ])
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `レコード一覧_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
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

      {/* Main Content (no sidebar) */}
      <main className="max-w-[1200px] mx-auto px-8 py-8">
        {/* タイトル + ボタン */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">案件一覧</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onAddMaterial}>
              <Plus className="mr-2 h-4 w-4" />
              新規商材追加
            </Button>
            <Button onClick={onCreateProject}>
              <Plus className="mr-2 h-4 w-4" />
              新規案件作成
            </Button>
          </div>
        </div>

        {/* タブ */}
        <div className="flex items-center gap-6 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("list")}
            className={cn(
              "pb-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "list"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            案件一覧
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={cn(
              "pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
              activeTab === "messages"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            新着メッセージ
            <Badge className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0 min-w-[20px] h-5 rounded-full">
              5
            </Badge>
          </button>
        </div>

        {activeTab === "list" && (
          <>
            {/* 検索カード */}
            <Card className="mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <span className="text-base font-bold">案件検索</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">複数の条件で案件を絞り込むことができます</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                  {/* 法人/ホール */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">法人/ホール</Label>
                    <div className="flex">
                      <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("flex-1 justify-between font-normal rounded-r-none border-r-0", !filterCompany && "text-muted-foreground")}
                          >
                            {filterCompany ? filterCompany.name : "法人名を検索..."}
                            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] p-0" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput placeholder="法人名・コードで検索..." value={companyQuery} onValueChange={setCompanyQuery} />
                            <CommandList>
                              <CommandEmpty>該当する法人が見つかりません</CommandEmpty>
                              <CommandGroup>
                                {filteredCompanies.map((c) => (
                                  <CommandItem
                                    key={c.id}
                                    value={String(c.id)}
                                    onSelect={() => {
                                      setFilterCompany(filterCompany?.id === c.id ? null : c)
                                      if (filterCompany?.id !== c.id) setFilterHall(null)
                                      setCompanyQuery("")
                                      setCompanyOpen(false)
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", filterCompany?.id === c.id ? "opacity-100" : "opacity-0")} />
                                    <div className="flex flex-col">
                                      <span className="text-sm">{c.name}</span>
                                      <span className="text-xs text-muted-foreground">{c.companyId}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant={companyHallTab === "company" ? "default" : "outline"}
                        size="sm"
                        className="rounded-none px-3 text-xs"
                        onClick={() => setCompanyHallTab("company")}
                      >
                        法人
                      </Button>
                      <Button
                        variant={companyHallTab === "hall" ? "default" : "outline"}
                        size="sm"
                        className="rounded-l-none px-3 text-xs"
                        onClick={() => setCompanyHallTab("hall")}
                      >
                        ホール
                      </Button>
                    </div>
                  </div>

                  {/* 商品カテゴリ */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">商品カテゴリ</Label>
                    <Select value={filterMaterialCategory} onValueChange={setFilterMaterialCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="すべて" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        <SelectItem value="event">イベント</SelectItem>
                        <SelectItem value="option">オプション</SelectItem>
                        <SelectItem value="point">ポイント</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* イベント区分 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">イベント区分</Label>
                    <Select value={filterMaterialName || "all"} onValueChange={(v) => setFilterMaterialName(v === "all" ? "" : v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="すべて" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        {MATERIAL_NAME_OPTIONS.map(name => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 期間 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">期間</Label>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="date">
                        <SelectTrigger className="w-[90px]">
                          <SelectValue placeholder="実施日" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">実施日</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input type="date" placeholder="年 / 月 / 日" className="text-xs" />
                      </div>
                      <span className="text-muted-foreground text-sm">～</span>
                      <div className="relative flex-1">
                        <Input type="date" placeholder="年 / 月 / 日" className="text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* ホール担当 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">ホール担当</Label>
                    <Input
                      value={filterSalesRep}
                      onChange={(e) => setFilterSalesRep(e.target.value)}
                      placeholder="ホール担当を検索..."
                    />
                  </div>

                  {/* 案件No */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">案件No</Label>
                    <Input
                      placeholder="案件Noを入力..."
                      value={filterProjectNumber}
                      onChange={(e) => setFilterProjectNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* 案件名 */}
                <div className="mt-5 space-y-2">
                  <Label className="text-sm font-bold">案件名</Label>
                  <Input
                    placeholder="案件名を入力..."
                    value={filterProjectName}
                    onChange={(e) => setFilterProjectName(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* レコード一覧テーブル */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap w-8"></th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">ステータス</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">レコードタイトル</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">発注日</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">レコード番号</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">店舗コード</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">店舗名</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">掲載開始希望日</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">掲載終了日</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">掲載日数</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">実NET額</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">日予算</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">キャンペーン目的</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">課金方式</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => onSelectRecord(record.id)}
                      >
                        <td className="px-4 py-3">
                          <div className={cn("h-3 w-3 rounded-sm", getStatusDotClass(record.status))} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.statusLabel}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-sm">{record.recordTitle}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.orderDate || ""}</td>
                        <td className="px-4 py-3">
                          <button
                            className="text-primary hover:underline font-medium text-sm"
                            onClick={(e) => { e.stopPropagation(); onSelectRecord(record.id) }}
                          >
                            {record.recordNumber}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-primary text-sm">{record.storeCode}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {record.storeName.length > 5 ? record.storeName.slice(0, 5) + "…" : record.storeName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.publicationStartDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.publicationEndDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.publicationDays}日間</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">¥{record.netAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">¥{record.dailyBudget.toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.campaignObjective || "—"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{record.billingMethod || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRecords.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    該当するレコードがありません
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "messages" && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">新着メッセージはありません</p>
          </div>
        )}
      </main>

      {/* 検索条件保存ダイアログ */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>検索条件を保存</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>条件名</Label>
              <Input
                value={saveConditionName}
                onChange={(e) => setSaveConditionName(e.target.value)}
                placeholder="例: よく使う検索条件"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>キャンセル</Button>
            <Button onClick={handleSaveCondition} disabled={!saveConditionName.trim()}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 保存された検索条件一覧ダイアログ */}
      <Dialog open={conditionsListOpen} onOpenChange={setConditionsListOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>保存された検索条件</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-[400px] overflow-y-auto">
            {savedConditions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">保存された条件はありません</p>
            ) : (
              savedConditions.map((condition) => (
                <div key={condition.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30">
                  <div>
                    <div className="text-sm font-medium">{condition.name}</div>
                    <div className="text-xs text-muted-foreground">{condition.createdAt}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleLoadCondition(condition)}>
                      適用
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      const json = JSON.stringify(condition, null, 2)
                      const blob = new Blob([json], { type: "application/json" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `検索条件_${condition.name}.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}>
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCondition(condition.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
