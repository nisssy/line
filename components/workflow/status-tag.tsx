"use client"

import { cn } from "@/lib/utils"

interface StatusTagProps {
  status: "pending" | "reviewing" | "rejected" | "approved" | "failed" | "success"
  className?: string
}

const statusConfig = {
  pending: {
    label: "未対応",
    className: "bg-muted text-muted-foreground",
  },
  reviewing: {
    label: "事務確認中",
    className: "bg-info/20 text-info",
  },
  rejected: {
    label: "差し戻し",
    className: "bg-destructive/20 text-destructive",
  },
  approved: {
    label: "承認済み",
    className: "bg-success/20 text-success",
  },
  failed: {
    label: "失敗",
    className: "bg-destructive/20 text-destructive",
  },
  success: {
    label: "成功",
    className: "bg-success/20 text-success",
  },
}

export function StatusTag({ status, className }: StatusTagProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
