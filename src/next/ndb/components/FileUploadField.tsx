import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/next/ndb/components/Icon';
import { uploadFile } from '@/next/ndb/api/actions';
import { ScoreFileItem } from '@/next/ndb/types';

interface FileUploadFieldProps {
  label: string;
  fileType: 'parts' | 'fullScore' | 'audioMidi' | 'audioMp3';
  currentFile: ScoreFileItem | null;
  onFileChange: (fileKey: string | null) => void;
  disabled?: boolean;
}

const FILE_TYPE_CONFIG = {
  parts: { accept: '.pdf', label: 'Stimmen' },
  fullScore: { accept: '.pdf', label: 'Partitur' },
  audioMidi: { accept: '.mid,.midi', label: 'MIDI' },
  audioMp3: { accept: '.mp3', label: 'MP3' },
};

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  fileType,
  currentFile,
  onFileChange,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingFileName, setPendingFileName] = useState<string | null>(null);
  const [isRemoved, setIsRemoved] = useState(false);
  const [originalFile, setOriginalFile] = useState<ScoreFileItem | null>(currentFile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = FILE_TYPE_CONFIG[fileType];

  // Track the original file and reset states when it changes (e.g., after form reset or save)
  useEffect(() => {
    // Only update originalFile when we have a new file (not when removed)
    if (currentFile?.key && currentFile.key !== originalFile?.key) {
      setOriginalFile(currentFile);
      setIsRemoved(false);
      setPendingFileName(null);
    }
  }, [currentFile, originalFile?.key]); // Watch the entire currentFile object

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setPendingFileName(file.name);
    setIsRemoved(false); // Clear removed state when uploading new file

    try {
      const { fileKey } = await uploadFile(file);
      if (fileKey) {
        onFileChange(fileKey);
      } else {
        setUploadError('Upload fehlgeschlagen');
        setPendingFileName(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload fehlgeschlagen');
      setPendingFileName(null);
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onFileChange('__REMOVE__');
    setIsRemoved(true);
    setPendingFileName(null);
    setUploadError(null);
  };

  const handleRestore = () => {
    // Restore by passing __RESTORE__ to signal restoration
    onFileChange('__RESTORE__');
    setIsRemoved(false);
  };

  const handleDiscard = () => {
    setPendingFileName(null);
    setUploadError(null);
    // Restore original if it exists, otherwise just clear
    onFileChange('__RESTORE__');
  };

  const hasFile = currentFile !== null;
  const hasPendingUpload = pendingFileName !== null;
  const hadOriginalFile = originalFile !== null;

  return (
    <div className="mb-4">
      <label className="ndb-profex-label block mb-2">{label}</label>

      <div className="flex flex-wrap items-center gap-2">
        {/* Upload/Replace button */}
        <label
          className={`
            btn-secondary btn-sm cursor-pointer
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Icon name={isUploading ? 'spinner' : 'upload'} alt="Upload" className="mr-1.5 h-3.5 w-3.5" />
          {isUploading ? 'Hochladen...' : hasFile || hasPendingUpload ? 'Ersetzen' : 'Hochladen'}
          <input
            ref={fileInputRef}
            type="file"
            accept={config.accept}
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
          />
        </label>

        {/* Secondary action button - depends on state */}
        {hasPendingUpload ? (
          // Pending upload: Show "Wiederherstellen"
          <button type="button" onClick={handleDiscard} disabled={disabled || isUploading} className="btn-secondary btn-sm">
            <Icon name="arrow-left" alt="Restore" className="mr-1.5 h-3.5 w-3.5" />
            Wiederherstellen
          </button>
        ) : isRemoved || (hadOriginalFile && !hasFile) ? (
          // File removed: Show "Wiederherstellen"
          <button type="button" onClick={handleRestore} disabled={disabled || isUploading} className="btn-secondary btn-sm">
            <Icon name="arrow-left" alt="Restore" className="mr-1.5 h-3.5 w-3.5" />
            Wiederherstellen
          </button>
        ) : hasFile ? (
          // Has file: Show "Entfernen"
          <button type="button" onClick={handleRemove} disabled={disabled || isUploading} className="btn-secondary btn-sm">
            <Icon name="cross" alt="Remove" className="mr-1.5 h-3.5 w-3.5" />
            Entfernen
          </button>
        ) : null}

        {/* File status display */}
        {hasPendingUpload ? (
          <span className="text-muted flex items-center gap-1">
            <Icon name="check" alt="Success" className="h-3.5 w-3.5 text-success-600" />
            {pendingFileName} <span className="text-amber-600">(nicht gespeichert)</span>
          </span>
        ) : (hadOriginalFile && !hasFile) || isRemoved ? (
          <span className="text-muted text-amber-600">(Entfernt)</span>
        ) : hasFile ? (
          <span className="text-muted">{currentFile?.filename}</span>
        ) : null}
      </div>

      {/* Error message */}
      {uploadError && <p className="input-error-text">{uploadError}</p>}
    </div>
  );
};

export default FileUploadField;
