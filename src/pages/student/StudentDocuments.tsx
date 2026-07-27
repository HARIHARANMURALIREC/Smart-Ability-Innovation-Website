import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import DashboardHeader from '@/components/admin/DashboardHeader';
import PDFViewer from '@/components/PDFViewer';

export default function StudentDocuments() {
  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Reference Documents"
        subtitle="Guidelines and abstract submission reference"
        breadcrumbs={[{ label: 'Student', to: '/student/dashboard' }, { label: 'Documents' }]}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-brand-600 dark:text-brand-300" />
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Reference Documents</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Download or view the reference abstract key and submission guidelines for your project.
          </p>

          <PDFViewer
            title="Abstract Submission Reference Key"
            pdfUrl="/Reference%20abstract.key.pdf"
            fileName="Reference abstract.key.pdf"
          />
        </motion.div>
      </div>
    </div>
  );
}
