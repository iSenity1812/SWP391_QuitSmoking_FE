"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle } from "lucide-react"
import { TaskService } from "@/services/taskService"
import { toast } from "react-toastify"

interface ImportQuizDialogProps {
  onQuizzesImported: () => void
}

export function ImportQuizDialog({ onQuizzesImported }: ImportQuizDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    // Check if file is Excel format
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    setSelectedFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file để import", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    try {
      setIsUploading(true)
      await TaskService.importQuizzes(selectedFile)

      toast.success("Import quiz thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      onQuizzesImported()
      setIsOpen(false)
      setSelectedFile(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi import quiz'
      toast.error(`Import thất bại: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const resetDialog = () => {
    setSelectedFile(null)
    setIsUploading(false)
    setDragActive(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        resetDialog()
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
          <Upload className="w-4 h-4 mr-2" />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            Import Quiz từ Excel
          </DialogTitle>
          <DialogDescription>
            Tải lên file Excel chứa danh sách quiz để import vào hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>Chọn file Excel</Label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-700">
                      {selectedFile.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Kéo thả file Excel vào đây hoặc
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-green-600 hover:text-green-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      chọn file
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Hỗ trợ định dạng: .xlsx, .xls
                  </p>
                </div>
              )}
              <Input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Format Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Định dạng file Excel:</p>
                <ul className="text-xs space-y-1 ml-2">
                  <li>• <strong>Title:</strong> Tiêu đề câu hỏi</li>
                  <li>• <strong>Description:</strong> Mô tả câu hỏi</li>
                  <li>• <strong>Score:</strong> Điểm số (VD: 10)</li>
                  <li>• <strong>Possible:</strong> Số lượng đáp án có thể (VD: 4)</li>
                  <li>• <strong>Option1, isCorrect1:</strong> Đáp án 1 và TRUE/FALSE</li>
                  <li>• <strong>Option2, isCorrect2:</strong> Đáp án 2 và TRUE/FALSE</li>
                  <li>• <strong>Option3, isCorrect3:</strong> Đáp án 3 và TRUE/FALSE</li>
                  <li>• <strong>Option4, isCorrect4:</strong> Đáp án 4 và TRUE/FALSE</li>
                </ul>v
                <p className="text-xs mt-2 text-blue-600">
                  <strong>Lưu ý:</strong> Mỗi câu hỏi phải có ít nhất một đáp án đúng (TRUE)
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isUploading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isUploading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang import...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
