"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ChatMessage, Supervisor, UserRole, WorkflowStep } from "@/types/workflow"
import {
  MessageSquare,
  Send,
  AlertTriangle,
  User,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react"

const SALES_SUPERVISORS: Supervisor[] = [
  { id: "sup-sales-1", name: "営業 部長", role: "sales" },
  { id: "sup-sales-2", name: "営業 課長", role: "sales" },
]

const OFFICE_SUPERVISORS: Supervisor[] = [
  { id: "sup-office-1", name: "事務 部長", role: "office" },
  { id: "sup-office-2", name: "事務 課長", role: "office" },
]

interface ChatPanelProps {
  role: UserRole
  currentStep: WorkflowStep
  step1ChatHistory: ChatMessage[]
  step2ChatHistory: ChatMessage[]
  onSendStep1Message: (content: string, escalatedTo?: Supervisor[]) => void
  onSendStep2Message: (content: string, escalatedTo?: Supervisor[]) => void
  materialName?: string
}

type ChatTab = "step1" | "step2"

export function ChatPanel({
  role,
  currentStep,
  step1ChatHistory,
  step2ChatHistory,
  onSendStep1Message,
  onSendStep2Message,
  materialName = "商材",
}: ChatPanelProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>(currentStep === 1 ? "step1" : "step2")
  const [messageInput, setMessageInput] = useState("")
  const [selectedSupervisors, setSelectedSupervisors] = useState<string[]>([])
  const [showEscalation, setShowEscalation] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const supervisors = role === "sales" ? SALES_SUPERVISORS : OFFICE_SUPERVISORS
  const targetLabel = role === "sales" ? "事務局" : "営業担当"

  useEffect(() => {
    setActiveTab(currentStep === 1 ? "step1" : "step2")
  }, [currentStep])

  const activeChatHistory = activeTab === "step1" ? step1ChatHistory : step2ChatHistory

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeChatHistory])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const escalatedTo = supervisors.filter(s => selectedSupervisors.includes(s.id))
    const escalation = escalatedTo.length > 0 ? escalatedTo : undefined

    if (activeTab === "step1") {
      onSendStep1Message(messageInput, escalation)
    } else {
      onSendStep2Message(messageInput, escalation)
    }

    setMessageInput("")
    setSelectedSupervisors([])
    setShowEscalation(false)
  }

  const toggleSupervisor = (id: string) => {
    setSelectedSupervisors(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-full border-border/60 shadow-sm">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" />
          チャット
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">{materialName}</p>
      </CardHeader>

      {/* Tab selector */}
      <div className="px-4 pb-2 flex-shrink-0">
        <div className="flex gap-1 p-0.5 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("step1")}
            className={`flex-1 text-xs py-1.5 px-2 rounded-md transition-colors ${
              activeTab === "step1"
                ? "bg-background text-foreground shadow-sm font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            基本情報
            {step1ChatHistory.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">
                {step1ChatHistory.length}
              </Badge>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("step2")}
            className={`flex-1 text-xs py-1.5 px-2 rounded-md transition-colors ${
              activeTab === "step2"
                ? "bg-background text-foreground shadow-sm font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            アカウント
            {step2ChatHistory.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-4 min-w-4 px-1 text-[10px]">
                {step2ChatHistory.length}
              </Badge>
            )}
          </button>
        </div>
      </div>

      <Separator />

      {/* Chat target label */}
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <Badge variant="outline" className="text-xs font-normal">
          {targetLabel}
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden px-4">
        {activeChatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {targetLabel}とのチャット
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              メッセージはまだありません
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full pr-2" ref={scrollRef}>
            <div className="space-y-3 py-2">
              {activeChatHistory.map((msg) => {
                const isOwn = msg.sender === role
                return (
                  <div key={msg.id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 px-1">
                      <span className="text-[10px] text-muted-foreground">{msg.senderName}</span>
                      <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                    </div>
                    {msg.escalatedTo && msg.escalatedTo.length > 0 && (
                      <div className="flex items-center gap-1 mt-0.5 px-1">
                        <ArrowUpRight className="h-3 w-3 text-amber-500" />
                        <span className="text-[10px] text-amber-600 font-medium">
                          {msg.escalatedTo.map(s => s.name).join(", ")} にエスカレーション
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t p-3 space-y-2">
        {/* Escalation toggle */}
        {showEscalation && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 space-y-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-medium text-amber-700">エスカレーション先</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {supervisors.map(supervisor => (
                <div key={supervisor.id} className="flex items-center space-x-1.5">
                  <Checkbox
                    id={`chat-panel-sup-${supervisor.id}`}
                    checked={selectedSupervisors.includes(supervisor.id)}
                    onCheckedChange={() => toggleSupervisor(supervisor.id)}
                  />
                  <Label
                    htmlFor={`chat-panel-sup-${supervisor.id}`}
                    className="text-xs font-normal cursor-pointer text-amber-800"
                  >
                    {supervisor.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${targetLabel}にメッセージを送信...`}
              className="min-h-[44px] max-h-[120px] resize-none pr-10 text-sm rounded-xl"
              rows={1}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant={showEscalation ? "default" : "ghost"}
              size="icon"
              className={`h-8 w-8 rounded-lg ${showEscalation ? "bg-amber-500 hover:bg-amber-600 text-white" : "text-muted-foreground"}`}
              onClick={() => setShowEscalation(!showEscalation)}
              title="エスカレーション"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-8 w-8 rounded-lg"
              disabled={!messageInput.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          Cmd + Enter で送信
        </p>
      </div>
    </Card>
  )
}
