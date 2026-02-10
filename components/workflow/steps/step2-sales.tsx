"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { StatusTag } from "@/components/workflow/status-tag"
import { ConfirmModal } from "@/components/workflow/confirm-modal"
import { EmailSection } from "@/components/workflow/email-section"
import type { Step2Status, ChatMessage } from "@/types/workflow"
import { User, Loader2, CheckCircle, XCircle, MessageSquare, Mail, Send } from "lucide-react"

interface Step2SalesProps {
  status: Step2Status
  confirmationMessage?: string
  chatHistory: ChatMessage[]
  onReply: (content: string) => void
  onSendMessage: (content: string) => void
  onSendCustomerInquiry: (content: string) => void
}

export function Step2Sales({
  status,
  confirmationMessage,
  chatHistory,
  onReply,
  onSendMessage,
  onSendCustomerInquiry,
}: Step2SalesProps) {
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showCustomerEmailModal, setShowCustomerEmailModal] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [showChatInput, setShowChatInput] = useState(false)
  const [selectedSupervisors, setSelectedSupervisors] = useState<string[]>([])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    
    const escalatedTo = SALES_SUPERVISORS.filter(s => selectedSupervisors.includes(s.id))
    onSendMessage(messageInput, escalatedTo.length > 0 ? escalatedTo : undefined)
    
    setMessageInput("")
    setSelectedSupervisors([])
  }

  const toggleSupervisor = (id: string) => {
    setSelectedSupervisors(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleReply = (content: string) => {
    console.log("[v0] Sending reply:", content)
    onReply(content)
  }

  const handleSendCustomerEmail = (content: string) => {
    console.log("[v0] Sending customer inquiry email:", content)
    onSendCustomerInquiry(content)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              LINE広告アカウント申請
            </CardTitle>
            {status === "pending" && <StatusTag status="reviewing" />}
            {status === "success" && <StatusTag status="success" />}
            {status === "failed" && <StatusTag status="failed" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {chatHistory.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="text-sm font-medium mb-3">チャット履歴</h4>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-4">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'sales' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'sales' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
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
                      {SALES_SUPERVISORS.map(supervisor => (
                        <div key={supervisor.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`sup-s2-${supervisor.id}`} 
                            checked={selectedSupervisors.includes(supervisor.id)}
                            onCheckedChange={() => toggleSupervisor(supervisor.id)}
                          />
                          <Label htmlFor={`sup-s2-${supervisor.id}`} className="text-sm font-normal cursor-pointer">
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
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={() => setShowChatInput(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                事務局へメッセージを送る
              </Button>
            </div>
          )}

          {/* チャット入力（履歴がない場合） */}
          {chatHistory.length === 0 && showChatInput && (
            <div className="border rounded-lg p-4 bg-muted/30 mb-4">
              <h4 className="text-sm font-medium mb-3">事務局へのメッセージ</h4>
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
                      {SALES_SUPERVISORS.map(supervisor => (
                        <div key={supervisor.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`sup-s2-init-${supervisor.id}`} 
                            checked={selectedSupervisors.includes(supervisor.id)}
                            onCheckedChange={() => toggleSupervisor(supervisor.id)}
                          />
                          <Label htmlFor={`sup-s2-init-${supervisor.id}`} className="text-sm font-normal cursor-pointer">
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
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-info" />
              <p className="text-sm font-medium text-foreground">
                LINE広告アカウント申請中
              </p>
              <p className="text-xs text-muted-foreground">
                事務からの完了通知をお待ちください
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-success/30 bg-success/10 p-8">
              <CheckCircle className="mb-4 h-8 w-8 text-success" />
              <p className="text-sm font-medium text-success">
                LINE広告アカウント登録が完了しました
              </p>
              <p className="text-xs text-muted-foreground">
                次のステップ（配信レポート作成）に進んでいます
              </p>
            </div>
          )}

          {status === "failed" && (
            <>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>事務からの確認依頼</AlertTitle>
                <AlertDescription>
                  {confirmationMessage || "確認が必要な事項があります。"}
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReplyModal(true)}
                  className="flex-1"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  回答
                </Button>
                <Button
                  onClick={() => setShowCustomerEmailModal(true)}
                  className="flex-1"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  顧客へ確認依頼
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 顧客への確認依頼メール表示 */}
      {showCustomerEmailModal && confirmationMessage && (
        <Card>
          <CardContent className="pt-6">
            <EmailSection
              title="顧客への確認依頼メール"
              defaultContent={`お世話になっております。

LINE広告のLINE広告アカウント登録につきまして、
以下の点についてご確認をお願いいたします。

【確認事項】
${confirmationMessage}

お手数をおかけいたしますが、ご回答をお願いいたします。

よろしくお願いいたします。`}
              onSend={handleSendCustomerEmail}
            />
          </CardContent>
        </Card>
      )}

      <ConfirmModal
        open={showReplyModal}
        onOpenChange={setShowReplyModal}
        onSubmit={handleReply}
        title="回答を入力"
        description="事務からの確認依頼に対する回答を入力してください。"
        inputLabel="回答内容"
        submitLabel="送信"
        placeholder="回答内容を記入してください..."
      />
    </div>
  )
}
