"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion, useTime, useTransform } from "framer-motion";
import { useForm } from "react-hook-form";
import { setUser } from "@/store/authSlice";

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm<RegisterFormData>();
    const time = useTime();
    const rotate = useTransform(time, [0, 10000], [0, 360], { clamp: false });
    const rotatingBg = useTransform(rotate, (r) =>
        `conic-gradient(from ${r}deg, #1cca50 0deg, #1cca50 60deg, transparent 60deg, transparent 360deg)`
    );
    const dispatch = useDispatch();
    const router = useRouter();

    const renderAnimatedText = (text: string) => (
        <span
            style={{
                background: "linear-gradient(90deg, #00FF77, #0B3D00, #00FF77)",
                backgroundSize: "300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
                animation: "gradientShift 5s linear infinite",
            }}
        >
            {text}
        </span>
    );

    const onSubmit = async (data: RegisterFormData) => {
        clearErrors();
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: data.email, password: data.password }),
            });
            const responseData = await res.json();
            
            if (!res.ok) {
                setError("password", { message: `Error: ${responseData.message}` });
            } else {
                console.log("✅ Registration successful:", responseData.user);
                dispatch(setUser(responseData.user));
                router.push("/");
            }
        } catch (error) {
            console.error("❌ Registration error:", error);
            setError("password", { message: "Network error. Please try again." });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen overflow-hidden">
            <div className="relative p-[3px] rounded-[40px] w-full max-w-md">
                <motion.div
                    className="absolute -inset-[3px] rounded-[40px] z-0"
                    style={{ background: rotatingBg, filter: "blur(10px)" }}
                />
                <div className="relative rounded-[40px] overflow-hidden p-12 shadow-lg bg-[#101219]">
                    <h1 className="text-3xl font-bold mb-6 text-center text-white">Register</h1>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-2 text-base">
                                {renderAnimatedText("Email:")}
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message: "Invalid email format",
                                    },
                                })}
                                className="p-3 text-base border border-[#1cca50] rounded bg-[#161924] text-[#1cca50] focus:outline-none focus:ring-2 focus:ring-[#1cca50]"
                            />
                            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password" className="mb-2 text-base">
                                {renderAnimatedText("Password:")}
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 7, message: "Password must be more than 6 characters" },
                                })}
                                className="p-3 text-base border border-[#1cca50] rounded bg-[#161924] text-[#1cca50] focus:outline-none focus:ring-2 focus:ring-[#1cca50]"
                            />
                            {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="confirmPassword" className="mb-2 text-base">
                                {renderAnimatedText("Confirm Password:")}
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm your password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === watch("password") || "Passwords do not match",
                                })}
                                className="p-3 text-base border border-[#1cca50] rounded bg-[#161924] text-[#1cca50] focus:outline-none focus:ring-2 focus:ring-[#1cca50]"
                            />
                            {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>}
                        </div>
                        <button
                            type="submit"
                            className="cursor-pointer py-3 px-6 text-base bg-[#1cca50] text-white rounded hover:bg-[#17d85f] transition-colors shadow-lg"
                        >
                            Register
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-white">Already have an account?</p>
                        <Link href="/auth" className="cursor-pointer hover:underline font-semibold text-base">
                            {renderAnimatedText("Login here")}
                        </Link>
                    </div>
                </div>
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
        </div>
    );
};

export default Register;
