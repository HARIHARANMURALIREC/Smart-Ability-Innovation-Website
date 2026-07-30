import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, FileText, CheckCircle2, UploadCloud, AlertCircle, Lock, Download, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { MAX_SUBMISSION_FILE_SIZE_BYTES, MAX_SUBMISSION_FILE_SIZE_MB } from '@/utils';

export default function UploadCard() {
  const { user, teams, uploadPdf } = useAuth();
  const { success, error } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const team = teams.find((t) => t.id === user?.teamId);
  if (!team) return null;

  const isLeader = user?.isLeader;
  const hasSelectedProject = Boolean(team.selectedProjectId);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasSelectedProject) {
      error('Select a project first', 'Choose a problem statement before uploading your PDF.');
      e.target.value = '';
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      error('Invalid file type', 'Only PDF files are accepted.');
      e.target.value = '';
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_SUBMISSION_FILE_SIZE_BYTES) {
      error(
        'File too large',
        `Maximum file size is ${MAX_SUBMISSION_FILE_SIZE_MB} MB. Your file is ${formatFileSize(file.size)}.`,
      );
      e.target.value = '';
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!hasSelectedProject) {
      error('Select a project first', 'Choose a problem statement before uploading your PDF.');
      return;
    }

    if (!selectedFile) {
      error('No file selected', 'Please choose a PDF file first.');
      return;
    }

    if (selectedFile.size > MAX_SUBMISSION_FILE_SIZE_BYTES) {
      error(
        'File too large',
        `Maximum file size is ${MAX_SUBMISSION_FILE_SIZE_MB} MB. Your file is ${formatFileSize(selectedFile.size)}.`,
      );
      return;
    }

    setUploading(true);
    const result = await uploadPdf(selectedFile);
    setUploading(false);

    if (!result.ok) {
      error('Upload failed', result.message);
      return;
    }

    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = '';
    success('Submission completed!', `${selectedFile.name} has been uploaded successfully.`);
  };

  if (!isLeader) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/15">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Project PDF Upload</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Leader-only permission</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200/60 bg-amber-50/60 p-4 text-center dark:border-amber-500/20 dark:bg-amber-500/10">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Only the Team Leader is authorized to upload the project PDF.
          </p>
        </div>
        {team.pdfName && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/50 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-600 dark:text-brand-300" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{team.pdfName}</span>
            </div>
            <StatusBadge status={team.submissionStatus} size="sm" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
          <FileUp className="h-5 w-5 text-brand-600 dark:text-brand-300" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Upload Project PDF</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Only the team leader can upload</p>
        </div>
      </div>

      {team.submissionStatus === 'submitted' && team.pdfName ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 rounded-xl border border-emerald-200/60 bg-emerald-50/60 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Submission Completed</p>
              <p className="truncate text-xs text-emerald-700 dark:text-emerald-300">{team.pdfName}</p>
            </div>
            <StatusBadge status="submitted" size="sm" />
          </div>
          {team.pdfUrl && (
            <div className="mt-3 flex gap-2">
              <a
                href={team.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary flex-1 justify-center text-xs"
              >
                <Eye className="h-3.5 w-3.5" /> View
              </a>
              <a
                href={team.pdfUrl}
                download={team.pdfName}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary flex-1 justify-center text-xs"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </a>
            </div>
          )}
        </motion.div>
      ) : !hasSelectedProject ? (
        <div className="mt-4 rounded-xl border border-amber-200/60 bg-amber-50/70 p-4 text-center dark:border-amber-500/20 dark:bg-amber-500/10">
          <Lock className="mx-auto h-6 w-6 text-amber-600 dark:text-amber-400" />
          <p className="mt-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
            Select a problem statement first
          </p>
          <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-300/80">
            Go to Problem Statements, select a project, then upload your PDF abstract.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/40 p-6 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-800/20 dark:hover:border-brand-500"
          >
            <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            <UploadCloud className="mx-auto h-9 w-9 text-slate-400 transition-colors group-hover:text-brand-500" />
            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {selectedFile ? selectedFile.name : 'Choose File'}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">PDF files only (max {MAX_SUBMISSION_FILE_SIZE_MB} MB)</p>
          </div>

          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 p-3 dark:border-slate-700/60 dark:bg-slate-800/30"
              >
                <FileText className="h-5 w-5 text-brand-600 dark:text-brand-300" />
                <div className="flex-1">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(selectedFile.size)}</p>
                </div>
                <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                  PDF
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => void handleUpload()}
            disabled={!selectedFile || uploading}
            className="btn-primary w-full"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Uploading…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4" /> Upload PDF
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 rounded-lg bg-slate-100/60 p-2.5 text-xs text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-slate-400" />
            Upload status: <StatusBadge status={team.submissionStatus} size="sm" />
          </div>
        </div>
      )}
    </div>
  );
}
