"use client";

import React from "react";
import { Download } from "lucide-react";

interface ExcelDownloadProps {
    data: any[];
    filename: string;
    title?: string;
}

export function ExcelDownload({ data, filename, title }: ExcelDownloadProps) {
    const downloadExcel = () => {
        // Простий CSV експорт (можна замінити на справжній Excel)
        const csvContent = [
            // Заголовки
            Object.keys(data[0] || {}).join(','),
            // Дані
            ...data.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={downloadExcel}
            className="flex items-center gap-2 px-4 py-2 bg-[#1cca50] text-black rounded-lg hover:bg-[#17d85f] transition-colors cursor-pointer font-medium"
        >
            <Download className="w-4 h-4" />
            {title || 'Скачати Excel'}
        </button>
    );
}
