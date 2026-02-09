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
}

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
  })

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
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

          {/* Step 2: Template & Message */}
          {step === 2 && (
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

          {/* Step 3: Preview */}
          {step === 3 && (
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
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-4">
          {/* Step indicators */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
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
            {step < 3 ? (
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
