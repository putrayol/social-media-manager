'use client';

import { IconX, IconUpload } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, {
  type DropzoneProps,
  type FileRejection
} from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useControllableState } from '@/hooks/use-controllable-state';
import { cn, formatBytes } from '@/lib/utils';

export interface UploadedFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date | string;
}

export interface FileUploaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type (File | UploadedFile)[]
   * @default undefined
   * @example value={files}
   */
  value?: (File | UploadedFile)[];

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<(File | UploadedFile)[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<(File | UploadedFile)[]>>;

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>;

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps['accept'];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps['maxSize'];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFiles={5}
   */
  maxFiles?: DropzoneProps['maxFiles'];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept,
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  // Default accept to all files if not specified
  const acceptConfig = accept || { '*/*': [] };

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file at a time');
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(`Cannot upload more than ${maxFiles} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      // Update form value untuk mode form
      if (onValueChange) {
        onValueChange(updatedFiles);
      }

      // Notifikasi untuk mode form (ketika onValueChange ada)
      if (onValueChange && newFiles.length > 0) {
        const target =
          newFiles.length > 1 ? `${newFiles.length} files` : `file`;
        toast.success(`${target} selected successfully`);
      }

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }

      // Hanya panggil onUpload jika tidak dalam mode form (onValueChange tidak ada)
      if (onUpload && newFiles.length > 0 && !onValueChange) {
        const target =
          newFiles.length > 1 ? `${newFiles.length} files` : `file`;

        toast.promise(onUpload(newFiles), {
          loading: `Uploading ${target}...`,
          success: () => `${target} uploaded`,
          error: `Failed to upload ${target}`
        });
      }
    },

    [files, maxFiles, multiple, onUpload, setFiles, onValueChange]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileObject(file) && isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <div className='relative flex flex-col gap-6 overflow-hidden'>
      <Dropzone
        onDrop={onDrop}
        accept={acceptConfig}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={maxFiles > 1 || multiple}
        disabled={isDisabled}
        noKeyboard
        preventDropOnDocument
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group border-muted-foreground/25 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
              'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
              isDragActive && 'border-muted-foreground/50',
              isDisabled && 'pointer-events-none opacity-60',
              className
            )}
            {...dropzoneProps}
          >
            <Input {...getInputProps()} />
            {isDragActive ? (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <IconUpload
                    className='text-muted-foreground size-7'
                    aria-hidden='true'
                  />
                </div>
                <p className='text-muted-foreground font-medium'>
                  Drop the files here
                </p>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <IconUpload
                    className='text-muted-foreground size-7'
                    aria-hidden='true'
                  />
                </div>
                <div className='space-y-px'>
                  <p className='text-muted-foreground font-medium'>
                    Drag {`'n'`} drop files here, or click to select files
                  </p>
                  <p className='text-muted-foreground/70 text-sm'>
                    You can upload
                    {maxFiles > 1
                      ? ` ${maxFiles === Infinity ? 'multiple' : maxFiles}
                      files (up to ${formatBytes(maxSize)} each)`
                      : ` a file with ${formatBytes(maxSize)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className='h-fit w-full px-3'>
          <div className='max-h-48 space-y-4'>
            {files?.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                progress={
                  progresses?.[isFileObject(file) ? file.name : file.fileName]
                }
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}

interface FileCardProps {
  file: File | UploadedFile;
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  const isFile = isFileObject(file);
  const fileName = isFile ? file.name : file.fileName;
  const fileSize = isFile ? file.size : file.fileSize;
  const isUploaded = !isFile;

  return (
    <div className='relative flex items-center space-x-4'>
      <div className='flex flex-1 space-x-4'>
        {isFile && isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={fileName}
            width={48}
            height={48}
            loading='lazy'
            className='aspect-square shrink-0 rounded-md object-cover'
          />
        ) : null}
        <div className='flex w-full flex-col gap-2'>
          <div className='space-y-px'>
            <p className='text-foreground/80 line-clamp-1 text-sm font-medium'>
              {fileName}
            </p>
            <p className='text-muted-foreground text-xs'>
              {formatBytes(fileSize)}
              {isUploaded && ' • Uploaded'}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={onRemove}
          disabled={progress !== undefined && progress < 100}
          className='size-8 rounded-full'
        >
          <IconX className='text-muted-foreground' />
          <span className='sr-only'>Remove file</span>
        </Button>
      </div>
    </div>
  );
}

function isFileObject(file: File | UploadedFile): file is File {
  return file instanceof File;
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}
