import { useState } from 'react';
import { Download, Eye, FileText, X } from 'lucide-react';

interface Props {
  pdfUrl: string | null | undefined;
  pdfName?: string | null;
  teamName?: string;
}

export default function SubmissionPdfActions({ pdfUrl, pdfName, teamName }: Props) {
  const [open, setOpen] = useState(false);

  if (!pdfUrl) {
    return (
      <span className="text-xs text-slate-400" title={pdfName ? 'File name saved, but no downloadable file' : undefined}>
        {pdfName ? 'No file link' : '—'}
      </span>
    );
  }

  const label = pdfName || 'submission.pdf';

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-500/10"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
        <a
          href={pdfUrl}
          download={label}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-accent-600 transition-colors hover:bg-accent-50 dark:text-accent-300 dark:hover:bg-accent-500/10"
        >
          <Download className="h-3.5 w-3.5" /> Download
        </a>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-300" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {teamName ? `${teamName} — ` : ''}
                    {label}
                  </p>
                  <p className="text-xs text-slate-500">Submitted PDF</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={pdfUrl}
                  download={label}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <iframe title={label} src={pdfUrl} className="min-h-[70vh] w-full flex-1 bg-slate-100 dark:bg-slate-950" />
          </div>
        </div>
      )}
    </>
  );
}
