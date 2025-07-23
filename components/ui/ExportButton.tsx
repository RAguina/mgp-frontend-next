// components/ui/ExportButton.tsx
'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

interface ExportButtonProps {
  label: string;
  filename: string;
  data: string | object;
  type: 'json' | 'csv' | 'txt' | 'log';
}

const getMimeType = (type: ExportButtonProps['type']): string => {
  switch (type) {
    case 'json':
      return 'application/json;charset=utf-8';
    case 'csv':
      return 'text/csv;charset=utf-8';
    case 'txt':
    case 'log':
      return 'text/plain;charset=utf-8';
    default:
      return 'application/octet-stream';
  }
};

export const ExportButton: React.FC<ExportButtonProps> = ({ label, filename, data, type }) => {
  const handleExport = () => {
    const mime = getMimeType(type);
    const content = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    const blob = new Blob([content], { type: mime });
    saveAs(blob, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
};
