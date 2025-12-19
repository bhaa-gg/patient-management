'use client'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Input } from './ui/input'
import Image from 'next/image'
import { convertFileToUrl } from '@/lib/utils'
import { X } from 'lucide-react'

type FileUploaderProps = {
  files: File[] | undefined
  onChange: (files: File[]) => void
}
const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles)
    },
    [onChange],
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className="text-xs flex cursor-pointer  flex-col items-center justify-center gap-3 rounded-md border border-dashed border-dark-500 bg-dark-400 p-5"
    >
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <div className="relative">
          <Image
            src={convertFileToUrl(files[0])}
            width={1000}
            height={1000}
            alt="uploaded image"
            className="max-h-[400px] overflow-hidden object-cover"
          />
          <button
            className="absolute group cursor-pointer rounded-full transition-all hover:bg-white top-2 right-2"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={(e: any) => e.stopPropagation() || onChange([])}
          >
            <X className="group-hover:text-black  transition-all " />
          </button>
        </div>
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            className={  `${isDragActive && 'animate-bounce'}` }
            width={40}
            height={40}
            alt="upload"
          />
          <div className="flex flex-col justify-center gap-2 text-center text-dark-600">
            <p className="text-14-regular ">
              <span className="text-green-500">Click to upload </span>
              or drag and drop
            </p>
            <p className="text-12-regular">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>
        </>
      )}
    </div>
  )
}

export default FileUploader
