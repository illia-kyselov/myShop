"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface PaginationWithLinksProps {
    currentPage: number;
    totalCount: number;
    pageSize: number;
}

export function PaginationWithLinks({ currentPage, totalCount, pageSize }: PaginationWithLinksProps) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const activeClasses = "bg-[#1cca50] text-white";
    const inactiveClasses = "border border-[#1cca50] text-[#1cca50] hover:bg-[#1cca50] hover:text-white";

    return (
        <div className="flex items-center justify-center gap-2 text-sm">
            {currentPage > 1 && (
                <Link href={`/?page=${currentPage - 1}`} className={`px-3 py-1 rounded ${inactiveClasses}`}>
                    Previous
                </Link>
            )}
            {pages.map((page) => (
                <Link
                    key={page}
                    href={`/?page=${page}`}
                    className={cn("px-3 py-1 rounded", page === currentPage ? activeClasses : inactiveClasses)}
                >
                    {page}
                </Link>
            ))}
            {currentPage < totalPages && (
                <Link href={`/?page=${currentPage + 1}`} className={`px-3 py-1 rounded ${inactiveClasses}`}>
                    Next
                </Link>
            )}
        </div>
    );
}
