import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExtractInvoice, useUploadInvoice } from '@app/invoices';

const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** index).toFixed(1)} ${units[index]}`;
}

export default function InvoiceUploadPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const navigate = useNavigate();

  const uploadMutation = useUploadInvoice();
  const extractMutation = useExtractInvoice();

  const fileMeta = useMemo(() => {
    if (!file) return null;
    return {
      name: file.name,
      size: formatBytes(file.size),
      type: file.type || 'Unknown',
    };
  }, [file]);

  const handleSelect = (selected: File | null) => {
    if (!selected) return;
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      alert('Only PDF or DOCX files are supported.');
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    const result = await uploadMutation.mutateAsync(file);
    setUploadId(result.upload_id);
  };

  const handleExtract = async () => {
    if (!uploadId) return;
    const result = await extractMutation.mutateAsync(uploadId);
    navigate(`/invoices/drafts/${result.draft_id}`);
  };

  return (
    <section className="page invoice-upload">
      <div>
        <p className="eyebrow">Invoice Intake</p>
        <h2>Upload invoice for extraction</h2>
        <p className="muted">Drag and drop a PDF/DOCX, then start extraction.</p>
      </div>

      <div
        className={`dropzone ${dragActive ? 'dropzone--active' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload invoice file"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleSelect(event.dataTransfer.files[0]);
        }}
      >
        <div>
          <h3>Drop invoice here</h3>
          <p className="muted">PDF or DOCX only</p>
        </div>
        <button className="button button--ghost" type="button">
          Browse files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => handleSelect(event.target.files?.[0] ?? null)}
          hidden
        />
      </div>

      {fileMeta && (
        <div className="upload-meta">
          <div>
            <p className="upload-meta__name">{fileMeta.name}</p>
            <span className="muted">
              {fileMeta.type} · {fileMeta.size}
            </span>
          </div>
          <button
            className="button button--primary"
            type="button"
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Uploading…' : 'Upload file'}
          </button>
        </div>
      )}

      {uploadMutation.isError && (
        <p className="status status--error">{(uploadMutation.error as Error).message}</p>
      )}

      {uploadId && (
        <div className="upload-next">
          <p className="muted">Upload complete. Ready to extract.</p>
          <button className="button button--primary" type="button" onClick={handleExtract}>
            {extractMutation.isPending ? 'Starting…' : 'Start extraction'}
          </button>
        </div>
      )}
    </section>
  );
}
