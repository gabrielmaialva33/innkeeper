import { ChangeEvent, useState } from 'react'

import { Button } from '../ui/core/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/core/card'
import { Alert, AlertDescription, AlertTitle } from '../ui/core/alert'

import { useApi } from '~/hooks/use_api'
import type { FileUploadResponse } from '~/types'

export function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<FileUploadResponse | null>(null)
  const { client, loading, error, request } = useApi()

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadedFile(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    const result = await request<FileUploadResponse>(() =>
      client.upload('/files/upload', selectedFile)
    )

    if (result) {
      setUploadedFile(result)
      setSelectedFile(null)
      // Reset file input
      const input = document.getElementById('file-upload') as HTMLInputElement
      if (input) input.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Upload</CardTitle>
        <CardDescription>
          Upload files up to 10MB. Supported formats: images, PDFs, documents, and more.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-sand-12 mb-2">
            Choose file
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
            className="block w-full text-sm text-sand-11
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/90
              file:cursor-pointer"
            accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.mp3,.mp4,.zip"
          />
        </div>

        {selectedFile && (
          <div className="bg-sand-3 rounded-md p-4">
            <p className="text-sm font-medium text-sand-12">{selectedFile.name}</p>
            <p className="text-xs text-sand-11 mt-1">Size: {formatFileSize(selectedFile.size)}</p>
          </div>
        )}

        <Button onClick={handleUpload} disabled={!selectedFile || loading} loading={loading}>
          Upload File
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Upload Failed</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {uploadedFile && (
          <Alert variant="success">
            <AlertTitle>Upload Successful!</AlertTitle>
            <AlertDescription>
              <div className="space-y-1 mt-2">
                <p>
                  <strong>File:</strong> {uploadedFile.clientName}
                </p>
                <p>
                  <strong>Type:</strong> {uploadedFile.fileType}
                </p>
                <p>
                  <strong>Size:</strong> {formatFileSize(uploadedFile.size)}
                </p>
                <p>
                  <strong>URL:</strong>{' '}
                  <a
                    href={uploadedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {uploadedFile.url}
                  </a>
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default FileUpload
