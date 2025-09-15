"use client";

import { Monitor, Smartphone } from 'lucide-react';
import Image from 'next/image';

export const MobileWarning = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-800">
      {/* Background SVG Patterns */}
      <div className="absolute inset-0">
        <svg
          className="absolute bottom-0 left-0 w-full h-1/2"
          viewBox="0 0 1440 720"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,360L48,380.7C96,401,192,443,288,437.3C384,432,480,380,576,359.3C672,339,768,349,864,380.7C960,412,1056,464,1152,458.7C1248,453,1344,391,1392,359.3L1440,328L1440,720L1392,720C1344,720,1248,720,1152,720C1056,720,960,720,864,720C768,720,672,720,576,720C480,720,384,720,288,720C192,720,96,720,48,720L0,720Z"
            fill="rgba(16, 185, 129, 0.15)"
          />
          <path
            d="M0,500L48,520.7C96,541,192,583,288,577.3C384,572,480,520,576,499.3C672,479,768,489,864,520.7C960,552,1056,604,1152,598.7C1248,593,1344,531,1392,499.3L1440,468L1440,720L1392,720C1344,720,1248,720,1152,720C1056,720,960,720,864,720C768,720,672,720,576,720C480,720,384,720,288,720C192,720,96,720,48,720L0,720Z"
            fill="rgba(16, 185, 129, 0.1)"
          />
        </svg>

        <svg
          className="absolute top-0 left-0 w-full h-1/2"
          viewBox="0 0 1440 720"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0L48,21.3C96,43,192,85,288,74.7C384,64,480,0,576,21.3C672,43,768,149,864,192C960,235,1056,213,1152,192C1248,171,1344,149,1392,138.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="rgba(34, 197, 94, 0.15)"
          />
          <path
            d="M0,150L48,171.3C96,193,192,235,288,224.7C384,214,480,150,576,171.3C672,193,768,299,864,342C960,385,1056,363,1152,342C1248,321,1344,299,1392,288.7L1440,278L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="rgba(34, 197, 94, 0.1)"
          />
        </svg>

        {/* Animated dots */}
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-20 right-16 sm:top-40 sm:right-32 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-16 left-20 sm:bottom-32 sm:left-40 w-2.5 h-2.5 sm:w-4 sm:h-4 bg-yellow-300 rounded-full opacity-40 animate-pulse"></div>

        {/* Network pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 1000 1000"
        >
          <circle cx="200" cy="200" r="3" fill="#22c55e" />
          <circle cx="800" cy="300" r="2" fill="#facc15" />
          <circle cx="600" cy="700" r="3" fill="#22c55e" />
          <line
            x1="200"
            y1="200"
            x2="800"
            y2="300"
            stroke="#22c55e"
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="800"
            y1="300"
            x2="600"
            y2="700"
            stroke="#facc15"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-3 sm:p-4">
        <div className="z-10 flex flex-col gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] px-6 py-8 sm:px-10 sm:py-12 max-w-sm sm:max-w-md w-full ring-1 ring-gray-200">
          
          {/* Logo */}
          <div className="text-center mb-1 sm:mb-2">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Image
                width={280}
                height={42}
                className="h-16 sm:h-20 md:h-24 w-full object-contain drop-shadow-lg"
                src="/OAKU-Logo-nobg.png"
                alt="OAKU Logo"
              />
            </div>
          </div>

          {/* Icon Section */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-[#006C67] to-[#004B47] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 shadow-xl">
                <Monitor className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white mx-auto" />
              </div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-red-500 rounded-full p-1.5 sm:p-2 shadow-lg border-2 sm:border-4 border-white">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>

            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 drop-shadow-sm leading-tight">
              กรุณาใช้งานบนคอมพิวเตอร์
            </h1>
            
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-4 sm:mb-6 leading-relaxed px-2">
              เว็บไซต์นี้ออกแบบมาสำหรับการใช้งานบนหน้าจอคอมพิวเตอร์เท่านั้น 
              เพื่อประสบการณ์การใช้งานที่ดีที่สุด
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-inner">
            <div className="text-center">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                ข้อกำหนดระบบ
              </h3>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>ขนาดหน้าจอขั้นต่ำ:</span>
                  <span className="font-semibold text-[#006C67]">768px</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>อุปกรณ์ที่แนะนำ:</span>
                  <span className="font-semibold text-[#006C67] text-right">Desktop/Laptop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center bg-primary pb-3 sm:pb-5 text-center text-white px-4">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs sm:text-sm mb-2">
          <a
            href="https://sa.ku.ac.th/website-policy/"
            target="_blank"
            rel="noopener"
            className="hover:underline"
          >
            นโยบายคุ้มครองข้อมูล
          </a>
          <div className="hidden sm:block">●</div>
          <a href="https://sa.ku.ac.th/" target="_blank" rel="noopener" className="hover:underline">
            เว็บไซต์
          </a>
          <div className="hidden sm:block">●</div>
          <a href="mailto:saku@ku.th" className="hover:underline">ติดต่อเรา</a>
        </div>
        <div className="flex flex-col items-center text-xs sm:text-sm">
          <div className="font-normal text-center leading-tight">
            สงวนลิขสิทธิ์ © {new Date().getFullYear()} กองพัฒนานิสิต
            <br className="sm:hidden"/>
            <span className="sm:ml-1">มหาวิทยาลัยเกษตรศาสตร์</span>
          </div>
          <div className="text-xs mt-1">
            {process.env.NEXT_PUBLIC_BUILD_MESSAGE ?? ""}
          </div>
        </div>
      </div>
    </div>
  );
};