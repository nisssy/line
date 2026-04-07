"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface NotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSend: (data: NotificationData) => void
  companyName?: string
  hallName?: string
}

interface NotificationData {
  from: string
  to: string
  toType: "company" | "hall"
  cc: string
  bcc: string
  template: string
  message: string
  attachments: string[]
}

interface AttachmentFile {
  id: string
  name: string
  size: string
  category: string
  description: string
  updatedAt: string
}

const availableAttachments: AttachmentFile[] = [
  { id: "att-1", name: "LINE広告営業資料_2026動画対応_20260316.pptx", size: "10 MB", category: "資料", description: "営業資料", updatedAt: "2026-03-16" },
  { id: "att-2", name: "LINE広告営業資料_2026動画対応_20260316.pdf", size: "2 MB", category: "資料", description: "営業資料", updatedAt: "2026-03-16" },
  { id: "att-3", name: "LINE広告お申込書Ver2.0_1018.pdf", size: "445 KB", category: "申込書", description: "申込書2024年11月~※マルハン用は別途あります", updatedAt: "2024-10-22" },
  { id: "att-4", name: "LINE広告お申込書Ver2.0_1018.pptx", size: "159 KB", category: "申込書", description: "申込書2024年11月~※マルハン用は別途あります", updatedAt: "2024-10-22" },
  { id: "att-5", name: "LINE広告お申込書Ver1.0(友だちオーディエンス).pdf", size: "451 KB", category: "申込書", description: "申込書(友だちオーディエンス用)", updatedAt: "2025-06-06" },
  { id: "att-6", name: "LINE広告お申込書Ver1.0(友だちオーディエンス).pptx", size: "161 KB", category: "申込書", description: "申込書(友だちオーディエンス用)", updatedAt: "2025-06-06" },
  { id: "att-7", name: "LINE広告獲得申請フロー説明会0609.mp4", size: "55 MB", category: "その他", description: "獲得申請説明会動画", updatedAt: "2023-06-02" },
  { id: "att-8", name: "LINE広告新メニュー説明会20240604.mp4", size: "380 MB", category: "その他", description: "新メニュー説明会動画", updatedAt: "2024-06-04" },
  { id: "att-9", name: "【マルハン様用】LINE広告お申込書Ver2.0_1018.pdf", size: "441 KB", category: "申込書", description: "申込書2024年11月~※マルハン様用", updatedAt: "2024-10-22" },
  { id: "att-10", name: "【マルハン様用】LINE広告お申込書Ver2.0_1018.pptx", size: "151 KB", category: "申込書", description: "申込書2024年11月~※マルハン様用", updatedAt: "2024-10-22" },
  { id: "att-11", name: "【マルハン様用】LINE広告お申込書Ver1.0(友だちオーディエンス).pdf", size: "448 KB", category: "申込書", description: "申込書(友だちオーディエンス用)※マルハン様用", updatedAt: "2025-06-06" },
  { id: "att-12", name: "【マルハン様用】LINE広告お申込書Ver1.0(友だちオーディエンス).pptx", size: "154 KB", category: "申込書", description: "申込書(友だちオーディエンス用)※マルハン様用", updatedAt: "2025-06-06" },
  { id: "att-13", name: "LINE広告お申込書(電話番号ターゲティング)Ver1.0_0604.pdf", size: "407 KB", category: "申込書", description: "申込書", updatedAt: "2024-06-03" },
  { id: "att-14", name: "LINE広告お申込書(電話番号ターゲティング)Ver1.0_0604.pptx", size: "131 KB", category: "申込書", description: "申込書", updatedAt: "2024-06-03" },
  { id: "att-15", name: "LINE広告友だち追加申込書Ver2.0_1018.pdf", size: "445 KB", category: "申込書", description: "申込書2024年11月~(マルハンNG)", updatedAt: "2024-10-22" },
  { id: "att-16", name: "LINE広告友だち追加申込書Ver2.0_1018.pptx", size: "158 KB", category: "申込書", description: "申込書2024年11月~(マルハンNG)", updatedAt: "2024-10-22" },
]

// デフォルトで選択される「LINE広告申込書」
const defaultAttachmentIds = ["att-3"]

const employees = [
  { id: "emp1", name: "山田 太郎", email: "yamada@example.com" },
  { id: "emp2", name: "佐藤 花子", email: "sato@example.com" },
  { id: "emp3", name: "鈴木 一郎", email: "suzuki@example.com" },
  { id: "emp4", name: "田中 美咲", email: "tanaka@example.com" },
]

const templates = [
  {
    id: "standard",
    name: "テンプレート1: 標準",
    content: `お世話になっております。

LINE広告のお申し込みについて、添付の申込書にご記入の上、
ご返送いただけますようお願いいたします。

ご不明点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。`,
  },
  {
    id: "polite",
    name: "テンプレート2: 丁寧",
    content: `平素より大変お世話になっております。

この度はLINE広告へのご関心をお寄せいただき、誠にありがとうございます。
つきましては、添付いたしました申込書にご記入の上、
ご返送いただけますと幸いに存じます。

ご不明な点やご質問等ございましたら、何なりとお申し付けください。
引き続きどうぞよろしくお願い申し上げます。`,
  },
  {
    id: "simple",
    name: "テンプレート3: 簡潔",
    content: `お世話になっております。

LINE広告申込書を送付いたします。
ご確認の上、ご返送をお願いいたします。

よろしくお願いいたします。`,
  },
]

export function NotificationModal({
  open,
  onOpenChange,
  onSend,
  companyName = "株式会社サンプル",
  hallName = "サンプルホール",
}: NotificationModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<NotificationData>({
    from: "",
    to: "hall@example.com",
    toType: "hall",
    cc: "",
    bcc: "",
    template: "",
    message: "",
    attachments: defaultAttachmentIds,
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const toggleAttachment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.includes(id)
        ? prev.attachments.filter((a) => a !== id)
        : [...prev.attachments, id],
    }))
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSend = () => {
    onSend(formData)
    onOpenChange(false)
    // Reset
    setStep(1)
    setFormData({
      from: "",
      to: "hall@example.com",
      toType: "hall",
      cc: "",
      bcc: "",
      template: "",
      message: "",
    })
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    setFormData({
      ...formData,
      template: templateId,
      message: template?.content || "",
    })
  }

  const handleToTypeChange = (type: "company" | "hall") => {
    setFormData({
      ...formData,
      toType: type,
      to: type === "company" ? "company@example.com" : "hall@example.com",
    })
  }

  const selectedFromEmployee = employees.find((e) => e.id === formData.from)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>顧客へ通知</DialogTitle>
          <p className="text-sm text-muted-foreground">
            ワークフローで見積書を自動通知します
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Recipients */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>From（送信元）</Label>
                <Select
                  value={formData.from}
                  onValueChange={(value) =>
                    setFormData({ ...formData, from: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="従業員を選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To（送信先）</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.toType === "company" ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      formData.toType === "company"
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : ""
                    )}
                    onClick={() => handleToTypeChange("company")}
                  >
                    法人({companyName})
                  </Button>
                  <Button
                    type="button"
                    variant={formData.toType === "hall" ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      formData.toType === "hall"
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : ""
                    )}
                    onClick={() => handleToTypeChange("hall")}
                  >
                    ホール({hallName})
                  </Button>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <span className="text-sm text-muted-foreground">
                    {formData.to}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>CC（カーボンコピー）</Label>
                <Select
                  value={formData.cc}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cc: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="従業員を選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>BCC（ブラインドカーボンコピー）</Label>
                <Select
                  value={formData.bcc}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bcc: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="従業員を選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: 添付資料 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>添付資料</Label>
                <p className="text-xs text-muted-foreground">
                  デフォルトでLINE広告申込書が選択されています。必要に応じて他の資料を追加してください。
                </p>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {availableAttachments.map((file) => {
                  const checked = formData.attachments.includes(file.id)
                  return (
                    <label
                      key={file.id}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                        checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAttachment(file.id)}
                        className="mt-1 h-4 w-4"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground break-all">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({file.size})</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5">{file.category}</span>
                          <span>{file.description}</span>
                          <span>·</span>
                          <span>{file.updatedAt}</span>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                選択中: {formData.attachments.length}件
              </div>
            </div>
          )}

          {/* Step 3: Template & Message */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>メッセージテンプレート</Label>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateSelect(template.id)}
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                        formData.template === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>メッセージ本文</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="メッセージを入力してください..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 4 && (
            <div className="space-y-4">
              <Label>プレビュー</Label>
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div>
                  <span className="font-medium">From:</span>{" "}
                  <span className="text-muted-foreground">
                    {selectedFromEmployee?.name || "-"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">To:</span>{" "}
                  <span className="text-muted-foreground">{formData.to}</span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {formData.message || "メッセージが入力されていません"}
                  </p>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="border-t pt-3 space-y-1">
                    <span className="text-xs font-medium">添付資料 ({formData.attachments.length}件)</span>
                    <ul className="space-y-0.5">
                      {formData.attachments.map((id) => {
                        const f = availableAttachments.find((a) => a.id === id)
                        if (!f) return null
                        return (
                          <li key={id} className="text-xs text-muted-foreground break-all">
                            • {f.name} ({f.size})
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-4">
          {/* Step indicators */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 w-2 rounded-full",
                  s === step ? "bg-foreground" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {step === 1 ? (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                キャンセル
              </Button>
            ) : (
              <Button variant="outline" onClick={handleBack}>
                戻る
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={handleNext}>次へ</Button>
            ) : (
              <Button onClick={handleSend}>送信</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
