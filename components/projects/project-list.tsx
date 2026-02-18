"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/projects/project-card"
import type { Project } from "@/types/workflow"
import { FilePlus, List, Bell, Search, X, Plus, Calendar as CalendarIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface ProjectListProps {
  onSelectProject: (projectId: string) => void
  onCreateProject: () => void
  projects: Project[]
}

// サンプルデータ
export const sampleProjects: Project[] = [
  {
    id: "1",
    code: "28",
    status: "confirmed",
    companyName: "株式会社ビッグパチンコ",
    hallName: "ビッグパチンコ新宿店",
    date: "2025-11-15",
    location: "東京都新宿区",
    budget: 680000,
    createdAt: "2025-10-10",
  },
  {
    id: "2",
    code: "29",
    status: "in_progress",
    companyName: "サンライズホール名古屋",
    hallName: "サンライズホール福岡",
    date: "2024-12-01",
    location: "愛知県名古屋市",
    budget: 380000,
    createdAt: "2024-10-15",
  },
  {
    id: "3",
    code: "30",
    status: "pending",
    companyName: "グランドパレス横浜",
    hallName: "グランドパレス仙台",
    date: "2025-01-10",
    location: "神奈川県横浜市",
    budget: 520000,
    createdAt: "2024-11-01",
  },
  {
    id: "4",
    code: "31",
    status: "completed",
    companyName: "ロイヤルホール札幌",
    hallName: "ロイヤルホール広島",
    date: "2024-09-20",
    location: "北海道札幌市",
    budget: 290000,
    createdAt: "2024-08-15",
  },
]

export function ProjectList({ onSelectProject, onCreateProject, projects }: ProjectListProps) {
  const [roleToggle, setRoleToggle] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              営業・インサイト
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="role-toggle" className="text-sm text-muted-foreground">
                ロール切り替え
              </Label>
              <Switch id="role-toggle" checked={roleToggle} onCheckedChange={setRoleToggle} />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-65px)]">
          <div className="p-6">
            <h1 className="text-lg font-bold text-foreground">JAS Event Manager</h1>
            <p className="text-xs text-muted-foreground">抽選イベント管理</p>
          </div>
          <nav className="px-3">
            <Button variant="secondary" className="w-full justify-start gap-2">
              <List className="h-4 w-4" />
              案件一覧
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-muted/10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-6">
              <h2 className="text-lg font-bold text-foreground border-b-2 border-primary pb-1">案件一覧</h2>
              <h2 className="text-lg font-medium text-muted-foreground pb-1">修正確認依頼</h2>
              <h2 className="text-lg font-medium text-muted-foreground pb-1">仮押さえ不可</h2>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary/80" onClick={onCreateProject}>
              <Plus className="mr-2 h-4 w-4" />
              新規案件作成
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-bold">案件検索</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">複数の条件で案件を絞り込むことができます</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold">法人</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="法人を選択..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="big-pachinko">株式会社ビッグパチンコ</SelectItem>
                      <SelectItem value="sunrise">サンライズホール名古屋</SelectItem>
                      <SelectItem value="grand-palace">グランドパレス横浜</SelectItem>
                      <SelectItem value="royal">ロイヤルホール札幌</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold">ホール</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="ホールを選択..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="big-shinjuku">ビッグパチンコ新宿店</SelectItem>
                      <SelectItem value="sunrise-fukuoka">サンライズホール福岡</SelectItem>
                      <SelectItem value="grand-sendai">グランドパレス仙台</SelectItem>
                      <SelectItem value="royal-hiroshima">ロイヤルホール広島</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold">商品カテゴリ</Label>
                  <Select defaultValue="all">
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

                <div className="space-y-2">
                  <Label className="text-sm font-bold">イベント区分</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="イベント区分を検索..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line_ad">LINE広告</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold">期間</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="date">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="実施日" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">実施日</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="relative flex-1">
                        <Input placeholder="年 / 月 / 日" />
                        <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="relative flex-1">
                        <Input placeholder="年 / 月 / 日" />
                        <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold">ホール担当</Label>
                  <Select defaultValue="yamada">
                    <SelectTrigger>
                      <SelectValue placeholder="山田太郎" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yamada">山田太郎</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold">案件No</Label>
                  <Input placeholder="案件Noを入力..." />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label className="text-sm font-bold">案件名</Label>
                  <Input placeholder="案件名を入力..." />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">検索条件:</span>
                  <Badge variant="secondary" className="gap-1 font-normal">
                    ホール担当: 山田太郎
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  すべてクリア
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onViewDetail={onSelectProject} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

