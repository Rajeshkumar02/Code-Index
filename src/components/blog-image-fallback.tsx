"use client";

import { useState } from "react";
import Image from "next/image";

interface BlogImageFallbackProps {
    src?: string;
    alt: string;
    title: string;
    className?: string;
}

// Generate gradient based on title
function generateGradient(title: string): string {
    const gradients = [
        "from-blue-500 via-purple-500 to-pink-500",
        "from-green-400 via-blue-500 to-purple-600",
        "from-orange-400 via-red-500 to-pink-500",
        "from-cyan-400 via-blue-500 to-indigo-600",
        "from-yellow-400 via-orange-500 to-red-500",
        "from-teal-400 via-green-500 to-emerald-600",
        "from-purple-400 via-pink-500 to-rose-500",
        "from-indigo-400 via-purple-500 to-pink-600",
    ];

    // Use title to deterministically select a gradient
    const index = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
    return gradients[index];
}

export default function BlogImageFallback({
    src,
    alt,
    title,
    className = "",
}: BlogImageFallbackProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // If no src or image failed to load, show gradient fallback
    if (!src || imageError) {
        const gradient = generateGradient(title);

        return (
            <div
                className={`relative w-full h-64 bg-gradient-to-br ${gradient} rounded-lg overflow-hidden ${className}`}
            >
                {/* Overlay pattern */}
                <div className="absolute inset-0 bg-black/10" />

                {/* Content */}
                <div className="relative h-full flex items-center justify-center text-white p-8">
                    {/* Title */}
                    <h2 className="text-3xl font-bold text-center drop-shadow-lg line-clamp-3">
                        {title}
                    </h2>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>
        );
    }

    return (
        <div className={`relative w-full h-64 bg-muted rounded-lg overflow-hidden ${className}`}>
            {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                }}
                onLoad={() => setImageLoading(false)}
                priority
            />
        </div>
    );
}
