"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BasicInfoForm } from "@/components/workflow/basic-info-form"
import { RejectionModal } from "@/components/workflow/rejection-modal"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import type { BasicInfo, Step1Status, ChatMessage } from "@/types/workflow"
import { FileText, Check, X, Send, MessageSquare } from "lucide-react"

interface Step1OfficeProps {
  status: Step1Status
  basicInfo: BasicInfo
  chatHistory: ChatMessage[]
  onApprove: () => void
  onReject: (reason: string) => void
  onSendMessage: (content: string) => void
}

export function Step1Office({
  status,
  basicInfo,
  chatHistory,
  onApprove,
  onReject,
  onSendMessage,
}: Step1OfficeProps) {
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [showChatInput, setShowChatInput] = useState(false)

  const isReviewable = status === "awaiting_review"

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    onSendMessage(messageInput)
    setMessageInput("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            基本情報登録
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* チャット履歴 */}
          {chatHistory.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="text-sm font-medium mb-3">営業担当との連絡</h4>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-4">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'office' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'office' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{msg.senderName}</span>
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                        {msg.escalatedTo && msg.escalatedTo.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{msg.escalatedTo.map(s => s.name).join(", ")}へエスカレーション</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 space-y-3">
                <Textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="min-h-[80px]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">上司へエスカレーション</Label>
                    <div className="flex flex-wrap gap-4">
                      {OFFICE_SUPERVISORS.map(supervisor => (
                        <div key={supervisor.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`sup-office-${supervisor.id}`} 
                            checked={selectedSupervisors.includes(supervisor.id)}
                            onCheckedChange={() => toggleSupervisor(supervisor.id)}
                          />
                          <Label htmlFor={`sup-office-${supervisor.id}`} className="text-sm font-normal cursor-pointer">
                            {supervisor.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleSendMessage} className="self-end" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* チャット開始ボタン（履歴がない場合） */}
          {chatHistory.length === 0 && !showChatInput && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowChatInput(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                営業担当へメッセージを送る
              </Button>
            </div>
          )}

          {/* チャット入力（履歴がない場合） */}
          {chatHistory.length === 0 && showChatInput && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="text-sm font-medium mb-3">営業担当へのメッセージ</h4>
              <div className="space-y-3">
                <Textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="min-h-[80px]"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs text-muted-foreground">上司へエスカレーション</Label>
                    <div className="flex flex-wrap gap-4">
                      {OFFICE_SUPERVISORS.map(supervisor => (
                        <div key={supervisor.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`sup-office-init-${supervisor.id}`} 
                            checked={selectedSupervisors.includes(supervisor.id)}
                            onCheckedChange={() => toggleSupervisor(supervisor.id)}
                          />
                          <Label htmlFor={`sup-office-init-${supervisor.id}`} className="text-sm font-normal cursor-pointer">
                            {supervisor.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowChatInput(false)} className="text-muted-foreground">
                      キャンセル
                    </Button>
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === "pending" && (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
              <p className="text-sm text-muted-foreground">
                営業からの確認依頼をお待ちください
              </p>
            </div>
          )}

          {(status === "awaiting_review" || status === "rejected" || status === "approved") && (
            <>
              <BasicInfoForm data={basicInfo} onChange={() => {}} disabled />

              {isReviewable && (
                <div className="flex justify-end gap-3 border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectionModal(true)}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <X className="mr-2 h-4 w-4" />
                    差し戻し
                  </Button>
                  <Button onClick={onApprove}>
                    <Check className="mr-2 h-4 w-4" />
                    登録
                  </Button>
                </div>
              )}

              {status === "approved" && (
                <div className="rounded-lg bg-success/10 p-4 text-center">
                  <p className="text-sm font-medium text-success">
                    登録完了 - 次のステップに進んでいます
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <RejectionModal
        open={showRejectionModal}
        onOpenChange={setShowRejectionModal}
        onSubmit={onReject}
      />
    </div>
  )
}
