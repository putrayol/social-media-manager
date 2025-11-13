'use client';

import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface ReportActionsProps {
  reportId: string;
  reportNo: string;
}

export default function ReportActions({
  reportId,
  reportNo
}: ReportActionsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePrint = () => {
    const printContent = document.getElementById('report-content');
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Print Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(
      'body { font-family: Arial, sans-serif; margin: 20px; }'
    );
    printWindow.document.write(
      'table { width: 100%; border-collapse: collapse; margin: 20px 0; }'
    );
    printWindow.document.write(
      'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }'
    );
    printWindow.document.write(
      'th { background-color: #f2f2f2; font-weight: bold; }'
    );
    printWindow.document.write(
      'tr.total-row { font-weight: bold; background-color: #f9f9f9; }'
    );
    printWindow.document.write('h2 { margin-top: 30px; margin-bottom: 15px; }');
    printWindow.document.write('h3 { margin-top: 20px; margin-bottom: 10px; }');
    printWindow.document.write(
      '.badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }'
    );
    printWindow.document.write('.badge-outline { border: 1px solid #ddd; }');
    printWindow.document.write(
      '.badge-default { background-color: #000; color: white; }'
    );
    printWindow.document.write(
      '.badge-destructive { background-color: #dc2626; color: white; }'
    );
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    try {
      // Dynamic import untuk menghindari SSR error
      const printJS = (await import('print-js')).default;

      // Clone element untuk menghindari modifikasi DOM asli
      const clonedElement = element.cloneNode(true) as HTMLElement;

      // Buat temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.display = 'none';
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      // Print ke PDF
      printJS({
        printable: clonedElement,
        type: 'html',
        documentTitle: `Laporan-${reportNo}`,
        onPrintDialogClose: () => {
          // Hapus temporary container
          document.body.removeChild(tempContainer);
        }
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div className='flex gap-2'>
      <Button variant='outline' onClick={handlePrint}>
        <Printer className='mr-2 h-4 w-4' />
        Print
      </Button>
      <Button variant='outline' onClick={handleExportPDF}>
        <Download className='mr-2 h-4 w-4' />
        Export PDF
      </Button>
    </div>
  );
}
