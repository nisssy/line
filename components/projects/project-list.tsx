"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/projects/project-card"
import type { Project } from "@/types/workflow"
import { FilePlus, List, Bell } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ProjectListProps {
  onSelectProject: (projectId: string) => void
  onCreateProject: () => void
  projects: Project[]
}

// サンプルデータ
export const sampleProjects: Project[] = [
  {
    id: "1",
    code: "P001",
    status: "confirmed",
    companyName: "メガホール大阪",
    hallName: "メガホール東京",
    date: "2024-11-15",
    location: "大阪府大阪市",
    budget: 450000,
    createdAt: "2024-10-01",
  },
  {
    id: "2",
    code: "P002",
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
    code: "P003",
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
    code: "P004",
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
        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">案件一覧</h2>
              <p className="text-sm text-muted-foreground">全ての案件を管理・確認できます</p>
            </div>
            <Button onClick={onCreateProject}>
              <FilePlus className="mr-2 h-4 w-4" />
              新規案件作成
            </Button>
          </div>

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
