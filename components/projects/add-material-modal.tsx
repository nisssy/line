"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, ArrowLeft } from "lucide-react"
import type { Project, RecordData, CompanyData } from "@/types/workflow"
import { MATERIAL_NAME_OPTIONS } from "@/types/workflow"
import { initialCompanies, searchCompanies } from "@/lib/master-data"

interface AddMaterialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: Project[]
  records: RecordData[]
  onAddMaterial: (projectId: string, material: Partial<RecordData>) => void
  onNavigateToRecord?: (recordId: string) => void
  preselectedProjectId?: string
}

type ModalStep = "select_project" | "configure_material"

export function AddMaterialModal({
  open,
  onOpenChange,
  projects,
  records,
  onAddMaterial,
  onNavigateToRecord,
  preselectedProjectId,
}: AddMaterialModalProps) {
  const [step, setStep] = useState<ModalStep>(preselectedProjectId ? "configure_material" : "select_project")
  const [selectedProjectId, setSelectedProjectId] = useState(preselectedProjectId || "")

  // Step1 検索フィルター
  const [searchCompanyQuery, setSearchCompanyQuery] = useState("")
  const [searchCompanyOpen, setSearchCompanyOpen] = useState(false)
  const [filterCompany, setFilterCompany] = useState<CompanyData | null>(null)
  const [companyHallTab, setCompanyHallTab] = useState<"company" | "hall">("company")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterDivision, setFilterDivision] = useState("all")
  const [filterSalesRep, setFilterSalesRep] = useState("")
  const [filterProjectNo, setFilterProjectNo] = useState("")
  const [filterProjectName, setFilterProjectName] = useState("")

  // Step2 商材設定
  const [materialCategory, setMaterialCategory] = useState("")
  const [materialName, setMaterialName] = useState("")
  const [materialNameOpen, setMaterialNameOpen] = useState(false)
  const [materialNameQuery, setMaterialNameQuery] = useState("")

  const filteredCompanies = useMemo(
    () => searchCompanies(initialCompanies, searchCompanyQuery),
    [searchCompanyQuery]
  )

  const filteredMaterialNames = useMemo(() => {
    if (!materialNameQuery) return MATERIAL_NAME_OPTIONS
    return MATERIAL_NAME_OPTIONS.filter(n => n.includes(materialNameQuery))
  }, [materialNameQuery])

  // Step1: フィルター適用済みレコード
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (filterProjectNo && !record.projectNumber.includes(filterProjectNo)) return false
      if (filterProjectName) {
        const project = projects.find(p => p.id === record.projectId)
        if (project && !project.name.includes(filterProjectName)) return false
      }
      return true
    })
  }, [records, projects, filterProjectNo, filterProjectName])

  const handleReset = () => {
    setStep(preselectedProjectId ? "configure_material" : "select_project")
    setSelectedProjectId(preselectedProjectId || "")
    setMaterialCategory("")
    setMaterialName("")
    setMaterialNameQuery("")
    setFilterCompany(null)
    setSearchCompanyQuery("")
    setFilterCategory("all")
    setFilterDivision("all")
    setFilterSalesRep("")
    setFilterProjectNo("")
    setFilterProjectName("")
  }

  const handleSubmit = () => {
    if (!selectedProjectId || !materialCategory || !materialName) return

    onAddMaterial(selectedProjectId, {
      materialCategory: materialCategory === "event" ? "イベント" : materialCategory === "option" ? "オプション" : "ポイント",
      materialName,
      campaignObjective: "ウェブサイトアクセス",
      billingMethod: "CPC",
    })

    handleReset()
    onOpenChange(false)
  }

  // 選択中のレコードからプロジェクトを特定
  const selectedProject = projects.find(p => p.id === selectedProjectId)

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleReset(); onOpenChange(o) }}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {/* Step 1: 追加先案件を選択 */}
        {step === "select_project" && (
          <>
            <h2 className="text-lg font-bold mb-6">追加先案件を選択</h2>

            {/* 検索フォーム */}
            <div className="grid grid-cols-3 gap-x-5 gap-y-4 mb-6">
              {/* 法人/ホール */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold">法人/ホール</Label>
                <div className="flex">
                  <Popover open={searchCompanyOpen} onOpenChange={setSearchCompanyOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("flex-1 justify-between font-normal rounded-r-none border-r-0 text-xs h-9", !filterCompany && "text-muted-foreground")}
                      >
                        {filterCompany ? filterCompany.name : "法人名を検索..."}
                        <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput placeholder="法人名で検索..." value={searchCompanyQuery} onValueChange={setSearchCompanyQuery} />
                        <CommandList>
                          <CommandEmpty>該当なし</CommandEmpty>
                          <CommandGroup>
                            {filteredCompanies.map((c) => (
                              <CommandItem
                                key={c.id}
                                value={String(c.id)}
                                onSelect={() => {
                                  setFilterCompany(filterCompany?.id === c.id ? null : c)
                                  setSearchCompanyQuery("")
                                  setSearchCompanyOpen(false)
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", filterCompany?.id === c.id ? "opacity-100" : "opacity-0")} />
                                <span className="text-sm">{c.name}</span>
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
                    className="rounded-none px-2.5 text-xs h-9"
                    onClick={() => setCompanyHallTab("company")}
                  >
                    法人
                  </Button>
                  <Button
                    variant={companyHallTab === "hall" ? "default" : "outline"}
                    size="sm"
                    className="rounded-l-none px-2.5 text-xs h-9"
                    onClick={() => setCompanyHallTab("hall")}
                  >
                    ホール
                  </Button>
                </div>
              </div>

              {/* 商品カテゴリ */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold">商品カテゴリ</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-9">
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
              <div className="space-y-1.5">
                <Label className="text-sm font-bold">イベント区分</Label>
                <Select value={filterDivision} onValueChange={setFilterDivision}>
                  <SelectTrigger className="h-9">
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
              <div className="space-y-1.5">
                <Label className="text-sm font-bold">期間</Label>
                <Select defaultValue="date">
                  <SelectTrigger className="h-9 w-[90px]">
                    <SelectValue placeholder="実施日" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">実施日</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input type="date" className="text-xs h-9 flex-1" />
                  <span className="text-muted-foreground text-xs">～</span>
                  <Input type="date" className="text-xs h-9 flex-1" />
                </div>
              </div>

              {/* ホール担当 */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold">ホール担当</Label>
                <Input
                  value={filterSalesRep}
                  onChange={(e) => setFilterSalesRep(e.target.value)}
                  placeholder="ホール担当を検索..."
                  className="h-9"
                />
              </div>

              {/* 案件No */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold">案件No</Label>
                <Input
                  value={filterProjectNo}
                  onChange={(e) => setFilterProjectNo(e.target.value)}
                  placeholder="案件Noを入力..."
                  className="h-9"
                />
              </div>
            </div>

            {/* 案件名 */}
            <div className="mb-6 space-y-1.5">
              <Label className="text-sm font-bold">案件名</Label>
              <Input
                value={filterProjectName}
                onChange={(e) => setFilterProjectName(e.target.value)}
                placeholder="案件名を入力..."
                className="h-9 max-w-sm"
              />
            </div>

            {/* 案件番号、案件名、案件Noのみのテーブル */}
            <p className="text-sm font-bold text-center text-muted-foreground mb-3">案件番号、案件名、案件Noのみのテーブル</p>
            <div className="border rounded-lg overflow-hidden mb-6">
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground w-8"></th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">ステータス</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">レコードタイトル</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">発注日</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">レコード番号</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">店舗コード</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">店舗名</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">掲載開始希望日</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">掲載終了日</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">掲載日数</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">実NET額</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">日予算</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">キャンペーン目的</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">課金方式</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => {
                      const isSelected = record.projectId === selectedProjectId
                      return (
                        <tr
                          key={record.id}
                          className={cn(
                            "border-b cursor-pointer transition-colors",
                            isSelected ? "bg-primary/5" : "hover:bg-gray-50"
                          )}
                          onClick={() => setSelectedProjectId(record.projectId)}
                        >
                          <td className="px-3 py-2">
                            <div className={cn("h-3 w-3 rounded-sm",
                              record.status === "office_applying" ? "bg-blue-500" :
                              record.status === "office_approved" ? "bg-teal-500" :
                              "bg-gray-400"
                            )} />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">{record.statusLabel}</td>
                          <td className="px-3 py-2 text-muted-foreground whitespace-nowrap text-xs">{record.recordTitle}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">{record.orderDate || ""}</td>
                          <td className="px-3 py-2 text-xs">{record.recordNumber}</td>
                          <td className="px-3 py-2">
                            <span className="text-primary text-xs">{record.storeCode}</span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">
                            {record.storeName.length > 5 ? record.storeName.slice(0, 5) + "…" : record.storeName}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">{record.publicationStartDate}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">{record.publicationEndDate}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">{record.publicationDays}日間</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">¥{record.netAmount.toLocaleString()}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">¥{record.dailyBudget.toLocaleString()}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">{record.campaignObjective || "—"}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">{record.billingMethod || "—"}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { handleReset(); onOpenChange(false) }}>キャンセル</Button>
              <Button
                onClick={() => setStep("configure_material")}
                disabled={!selectedProjectId}
              >
                次へ
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 2: 商材の設定 */}
        {step === "configure_material" && (
          <>
            <div className="flex items-center gap-3 mb-8">
              {!preselectedProjectId && (
                <button
                  onClick={() => setStep("select_project")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h2 className="text-lg font-bold">商材の設定</h2>
            </div>

            <div className="py-8 px-4">
              <ul className="space-y-4 text-base">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <div>
                    <span className="font-bold">商材区分</span>
                    <span className="text-muted-foreground">（イベント、ポイント、オプション）</span>
                    <div className="mt-2">
                      <Select value={materialCategory} onValueChange={setMaterialCategory}>
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue placeholder="商材区分を選択..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">イベント</SelectItem>
                          <SelectItem value="point">ポイント</SelectItem>
                          <SelectItem value="option">オプション</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <div>
                    <span className="font-bold">商材名</span>
                    <span className="text-muted-foreground">（トリニティーガール、合同抽選会、LINE広告、お知らせバナー、メインバナーなど）の設定</span>
                    <div className="mt-2">
                      <Popover open={materialNameOpen} onOpenChange={setMaterialNameOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full max-w-xs justify-between font-normal", !materialName && "text-muted-foreground")}
                          >
                            {materialName || "商材名を選択..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="商材名を入力..."
                              value={materialNameQuery}
                              onValueChange={setMaterialNameQuery}
                            />
                            <CommandList>
                              <CommandEmpty>該当なし</CommandEmpty>
                              <CommandGroup>
                                {materialNameQuery && !MATERIAL_NAME_OPTIONS.includes(materialNameQuery) && (
                                  <CommandItem
                                    value={materialNameQuery}
                                    onSelect={() => {
                                      setMaterialName(materialNameQuery)
                                      setMaterialNameQuery("")
                                      setMaterialNameOpen(false)
                                    }}
                                  >
                                    「{materialNameQuery}」を使用
                                  </CommandItem>
                                )}
                                {filteredMaterialNames.map((name) => (
                                  <CommandItem
                                    key={name}
                                    value={name}
                                    onSelect={() => {
                                      setMaterialName(name)
                                      setMaterialNameQuery("")
                                      setMaterialNameOpen(false)
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", materialName === name ? "opacity-100" : "opacity-0")} />
                                    {name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { handleReset(); onOpenChange(false) }}>キャンセル</Button>
              <Button
                onClick={handleSubmit}
                disabled={!materialCategory || !materialName}
              >
                追加
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
