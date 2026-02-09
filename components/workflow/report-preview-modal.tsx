"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BarChart3, TrendingUp, Users, MousePointerClick, Eye } from "lucide-react"

interface ReportPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportType: "intermediate" | "final"
  reportIndex?: number
}

// サンプルレポートデータ
const sampleIntermediateData = {
  period: "2026/03/01 - 2026/03/15",
  impressions: "125,432",
  clicks: "3,256",
  ctr: "2.60%",
  conversions: "89",
  cost: "245,000円",
  cpc: "75円",
}

const sampleFinalData = {
  period: "2026/03/01 - 2026/03/31",
  impressions: "312,567",
  clicks: "8,432",
  ctr: "2.70%",
  conversions: "234",
  cost: "500,000円",
  cpc: "59円",
}

export function ReportPreviewModal({
  open,
  onOpenChange,
  reportType,
  reportIndex = 1,
}: ReportPreviewModalProps) {
  const data = reportType === "final" ? sampleFinalData : sampleIntermediateData
  const title = reportType === "final" ? "最終報告" : `中間報告${reportIndex}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {title} - 広告実績レポート（サンプル）
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* レポートヘッダー */}
          <div className="rounded-lg bg-primary/10 p-4">
            <h3 className="font-bold text-foreground">DMMぱちタウン LINE広告 実績レポート</h3>
            <p className="text-sm text-muted-foreground mt-1">配信期間: {data.period}</p>
          </div>

          {/* KPI サマリー */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <Eye className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">インプレッション</p>
              <p className="text-lg font-bold text-foreground">{data.impressions}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <MousePointerClick className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">クリック数</p>
              <p className="text-lg font-bold text-foreground">{data.clicks}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">CTR</p>
              <p className="text-lg font-bold text-foreground">{data.ctr}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <Users className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">コンバージョン</p>
              <p className="text-lg font-bold text-foreground">{data.conversions}</p>
            </div>
          </div>

          {/* 詳細データ */}
          <div className="rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">項目</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">実績</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-sm text-foreground">配信期間</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">{data.period}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-sm text-foreground">インプレッション数</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">{data.impressions}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-sm text-foreground">クリック数</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">{data.clicks}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-sm text-foreground">CTR (クリック率)</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">{data.ctr}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-sm text-foreground">コンバージョン数</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">{data.conversions}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-sm text-foreground">消化金額</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">{data.cost}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-foreground">CPC (クリック単価)</td>
                  <td className="px-4 py-3 text-right text-sm text-foreground">{data.cpc}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 補足 */}
          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="font-medium text-foreground mb-2">補足事項</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>- 配信ターゲット: 店舗周辺5km以内の20歳以上</li>
              <li>- 配信面: LINE NEWS、LINEタイムライン</li>
              <li>- クリエイティブ: バナー広告 (1200x628)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
