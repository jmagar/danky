"use client"

import * as React from "react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from "@danky/ui"
import { Paperclip, File, Folder, X, Upload } from "lucide-react"

interface FilePreview {
  name: string
  size: number
  type: string
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

export function AttachmentButton() {
  const [files, setFiles] = React.useState<FilePreview[]>([])
  const [open, setOpen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const folderInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName))
  }

  const handleUpload = () => {
    // TODO: Implement file upload
    console.log('Uploading files:', files)
    setFiles([])
    setOpen(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Paperclip className="h-4 w-4" />
          <span className="sr-only">Attach files</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Attach Files</DialogTitle>
          <DialogDescription>
            Upload files or folders to share in the chat.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <input
              type="file"
              ref={folderInputRef}
              onChange={handleFileChange}
              className="hidden"
              {...{ webkitdirectory: "", directory: "" } as any}
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <File className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
            <Button
              variant="secondary"
              onClick={() => folderInputRef.current?.click()}
              className="flex-1"
            >
              <Folder className="mr-2 h-4 w-4" />
              Choose Folder
            </Button>
          </div>
          {files.length > 0 && (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between gap-2 rounded-lg border p-2 text-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <File className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(file.name)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0}
            className="w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload {files.length} {files.length === 1 ? 'file' : 'files'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 