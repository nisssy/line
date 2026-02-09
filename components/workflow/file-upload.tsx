"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  fileName?: string
  disabled?: boolean
  viewOnly?: boolean
  saved?: boolean
  onFileClick?: () => void
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf,.doc,.docx,.xlsx,.xls",
  fileName,
  disabled = false,
  viewOnly = false,
  saved = false,
  onFileClick,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(fileName || null)
  const inputRef = useRef<HTMLInputElement>(null)

  // fileName propが変更されたら同期する
  useEffect(() => {
    if (fileName) {
      setSelectedFile(fileName)
    }
  }, [fileName])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !viewOnly) {
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (!disabled && !viewOnly && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file.name)
      onFileSelect(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file.name)
      onFileSelect(file)
    }
  }

  const handleClick = () => {
    if (!disabled && !viewOnly) {
      inputRef.current?.click()
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  if (viewOnly && selectedFile) {
    return (
      <button
        type="button"
        onClick={onFileClick}
        className="flex w-full items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10 cursor-pointer"
      >
        <FileText className="h-8 w-8 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{selectedFile}</p>
          <p className="text-xs text-muted-foreground">クリックでプレビュー</p>
        </div>
      </button>
    )
  }

  // 保存済みの状態
  if (saved && selectedFile) {
    return (
      <button
        type="button"
        onClick={onFileClick}
        className="flex w-full items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10 cursor-pointer"
      >
        <FileText className="h-8 w-8 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{selectedFile}</p>
          <p className="text-xs text-primary">保存済み - クリックでプレビュー</p>
        </div>
      </button>
    )
  }

  if (viewOnly && !selectedFile) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-6">
        <p className="text-sm text-muted-foreground">ファイルがまだアップロードされていません</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed p-6 transition-colors",
        dragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {selectedFile ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{selectedFile}</p>
              <p className="text-xs text-muted-foreground">
                選択済み
              </p>
            </div>
          </div>
          {!disabled && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFile}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className="flex cursor-pointer flex-col items-center gap-2"
          onClick={handleClick}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              クリックまたはドラッグ&ドロップ
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, Word, Excel形式に対応
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
