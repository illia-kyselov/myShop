'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useTime, useTransform } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { logoutSuccess } from '@/store/authSlice'

export default function Header() {
    const [mounted, setMounted] = useState(false)
    const [hasOrders, setHasOrders] = useState(false)

    const dispatch = useAppDispatch()
    const router = useRouter()
    const { isAuthenticated, user } = useAppSelector(s => s.auth)
    const pathname = usePathname()
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const time = useTime()
    const rotate = useTransform(time, [0, 10000], [0, 360], { clamp: false })
    const bg = useTransform(
        rotate,
        r => `conic-gradient(from ${r}deg, #1cca50 0deg, #1cca50 60deg, transparent 60deg)`
    )

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isAuthenticated && user) {
            fetch(`/api/orders?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setHasOrders(Array.isArray(data.orders) && data.orders.length > 0)
                })
                .catch(() => {
                    /* ignore */
                })
        }
    }, [isAuthenticated, user, pathname])

    const handleLogout = () => {
        dispatch(logoutSuccess())
        router.push('/auth')
    }

    const renderLink = (href: string, label: string) => {
        const active = pathname === href
        return (
            <Link
                href={href}
                style={
                    active
                        ? {
                            background: 'linear-gradient(90deg,#00FF77,#0B3D00,#00FF77)',
                            backgroundSize: '300%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                            animation: 'gradientShift 5s linear infinite',
                        }
                        : { color: '#1cca50' }
                }
            >
                {label}
            </Link>
        )
    }

    if (!mounted) return null

    return (
        <header className="relative m-4 rounded-[40px]">
            <motion.div
                className="absolute -inset-[3px] rounded-[40px] z-0"
                style={{ background: bg, filter: 'blur(10px)' }}
            />
            <div
                className={`relative ${isDark ? 'bg-[#101219]' : 'bg-[#0070f3]'
                    } rounded-[40px] overflow-hidden`}
            >
                <nav className="flex justify-between items-center p-7">
                    <ul className="flex gap-8">
                        <li>{renderLink('/', 'Home')}</li>
                        {isAuthenticated && hasOrders && (
                            <li>{renderLink('/orders', 'My orders')}</li>
                        )}
                        {isAuthenticated && user?.is_admin && (
                            <li>{renderLink('/analytic', 'Analytics')}</li>
                        )}
                    </ul>
                    <div className="flex items-center gap-4">
                        {!isAuthenticated &&
                            !['/auth', '/register'].includes(pathname) && (
                                <Link
                                    href="/auth"
                                    className="px-4 py-2 bg-[#161924] text-[#1cca50] rounded-md border border-[#1cca50] hover:bg-[#24293b]"
                                >
                                    Login
                                </Link>
                            )}
                        {isAuthenticated && (
                            <>
                                <Link
                                    href="/cart"
                                    className="text-2xl text-white hover:text-gray-300"
                                >
                                    🛒
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-[#161924] text-[#1cca50] rounded-md border border-[#1cca50] hover:bg-[#24293b]"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            </div>
            <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 300% center;
          }
        }
      `}</style>
        </header>
    )
}
