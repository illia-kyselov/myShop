"use client";

import React from "react";
import { motion, useTime, useTransform } from "framer-motion";

const Footer: React.FC = () => {
    const time = useTime();
    const rotate = useTransform(time, [0, 10000], [0, 360], { clamp: false });
    const rotatingBg = useTransform(
        rotate,
        (r) =>
            `conic-gradient(from ${r}deg, #1cca50 0deg, #1cca50 60deg, transparent 60deg, transparent 360deg)`
    );

    return (
        <footer className="relative m-4 rounded-[40px] overflow-hidden mt-auto">
            <motion.div
                className="absolute -inset-[3px] rounded-[40px] z-0"
                style={{
                    background: rotatingBg,
                    filter: "blur(10px)",
                }}
            />
            <div className="relative bg-[#101219] rounded-[40px] p-4 text-center">
                <motion.p
                    className="font-bold"
                    style={{
                        background: "linear-gradient(90deg, #00FF77, #0B3D00, #00FF77)",
                        backgroundSize: "300%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "gradientShift 5s linear infinite",
                    }}
                >
                    Experience the most innovative interface — this application was designed and developed by Kirienko Nazar. Enjoy a seamless experience!
                </motion.p>
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
        </footer>
    );
};

export default Footer;
