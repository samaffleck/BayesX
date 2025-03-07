"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden"; // Disable scrollbars
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50 text-gray-900 p-0">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-3 text-center">Intelligent Optimization with BayesX</h1>

      {/* Description */}
      <p className="text-lg text-center max-w-2xl mb-6">
        BayesX helps engineers perform multi-variable, multi-objective optimization for time-intensive tasks.
      </p>

      {/* Image Container */}
      <div className="relative w-full h-1/2">
        <Image
          src="/bo_gif.gif" 
          alt="Bayesian Optimization Process" 
          layout="fill" 
          objectFit="contain" 
        />
      </div>

      {/* Button to Optimizer Page */}
      <Link 
        href="/Optimizer"
        className="mt-6 px-6 py-3 bg-gray-600 text-white text-lg rounded-lg shadow hover:bg-gray-700 transition"
      >
        Start Optimizing
      </Link>
    </div>
  );
}
