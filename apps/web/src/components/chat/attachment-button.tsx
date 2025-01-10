'use client';

import * as React from 'react';
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
} from '@danky/ui';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Paperclip, File, Folder, X, Upload } from 'lucide-react';

interface FilePreview {
  name: string;
  size: number;
  type: string;
}

interface AttachmentButtonProps {
  onUpload?: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
}

export function AttachmentButton({
  onUpload,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = '*',
}: AttachmentButtonProps) {
  const [files, setFiles] = React.useState<FilePreview[]>([]);
  const [open, setOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const folderInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      const validFiles = selectedFiles.filter(file => {
        // Check file size
        if (file.size > maxSize) {
          console.warn(`File ${file.name} is too large (max ${formatFileSize(maxSize)})`);
          return false;
        }
        return true;
      });

      if (files.length + validFiles.length > maxFiles) {
        console.warn(`Cannot add more than ${maxFiles} files`);
        return;
      }

      const newFiles = validFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      setFiles(prev => [...prev, ...newFiles]);
    },
    [files.length, maxFiles, maxSize]
  );

  const removeFile = React.useCallback((fileName: string) => {
    setFiles(files => files.filter(file => file.name !== fileName));
  }, []);

  const handleUpload = React.useCallback(async () => {
    if (!onUpload) return;

    try {
      setUploading(true);
      // Get the actual File objects from the input refs
      const fileList = fileInputRef.current?.files || [];
      const folderList = folderInputRef.current?.files || [];
      const allFiles = [...Array.from(fileList), ...Array.from(folderList)];

      // Filter to only the files that are in our preview list
      const filesToUpload = allFiles.filter(file =>
        files.some(preview => preview.name === file.name)
      );

      await onUpload(filesToUpload);
      setFiles([]);
      setOpen(false);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  }, [files, onUpload]);

  const formatFileSize = React.useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

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
            Upload files or folders to share in the chat. Maximum {formatFileSize(maxSize)} per
            file, {maxFiles} files total.
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
              accept={accept}
            />
            <input
              type="file"
              ref={folderInputRef}
              onChange={handleFileChange}
              className="hidden"
              {...{ webkitdirectory: '', directory: '' }}
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
              disabled={files.length >= maxFiles}
            >
              <File className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
            <Button
              variant="secondary"
              onClick={() => folderInputRef.current?.click()}
              className="flex-1"
              disabled={files.length >= maxFiles}
            >
              <Folder className="mr-2 h-4 w-4" />
              Choose Folder
            </Button>
          </div>
          {files.length > 0 && (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-2">
                {files.map(file => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between gap-2 rounded-lg border p-2 text-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <File className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-muted-foreground text-xs">
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
            onClick={() => void handleUpload()}
            disabled={files.length === 0 || uploading}
            className="w-full sm:w-auto"
          >
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {files.length} {files.length === 1 ? 'file' : 'files'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
