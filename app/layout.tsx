"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideHeaderFooter = pathname.startsWith("/auth") || pathname.startsWith("/register");
    return (
        <>
            {!hideHeaderFooter && <Header />}
            <main className={hideHeaderFooter ? "flex-1" : "flex-1 p-8"}>{children}</main>
            {!hideHeaderFooter && <Footer />}
        </>
    );
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen m-0`}
            >
                <ThemeProvider attribute="class" defaultTheme="dark">
                    <Providers>
                        <Toaster position="top-center" />
                        <ConditionalLayout>{children}</ConditionalLayout>
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
