"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "auth_failed":
          setError("การยืนยันตัวตนล้มเหลว");
          break;
        case "server_error":
          setError("เกิดข้อผิดพลาดของเซิร์ฟเวอร์");
          break;
        default:
          setError("ท่านไม่มีสิทธิ์เข้าถึงระบบ");
      }
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setError("ระบบมีปัญหา: ไม่พบ API URL");
      return;
    }

    window.location.href = `${apiUrl}/auth/google`;
  };

  const redirectUri =
    typeof window !== "undefined"
      ? window.location.origin + "/auth/callback"
      : "";

  const handleKuAllLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setError("ระบบมีปัญหา: ไม่พบ API URL");
      return;
    }
    window.location.href = `${apiUrl}/auth/kualllogin?redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-800">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
          {error}
        </div>
      )}

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

        <div className="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-green-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-32 left-40 w-4 h-4 bg-yellow-300 rounded-full opacity-40 animate-pulse"></div>

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

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="z-10 flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] px-10 py-12 md:px-16 max-w-md w-full ring-1 ring-gray-200">
          <div className="text-center mb-2">
            <div className="flex items-center justify-center mb-6">
              <Image
                className="h-24 object-contain drop-shadow-lg"
                src="/OAKU-Logo-nobg.png"
                alt="OAKU Logo"
              />
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2 drop-shadow-sm">
                ยินดีต้อนรับ
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                เข้าใช้งานระบบ OAKU
              </p>
            </div>
          </div>

          {/* Button Section */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleKuAllLogin}
              className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#006C67] to-[#004B47] px-6 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] transform border border-white/20 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#008B85] to-[#006C67] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 font-bold text-lg text-white">
                <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span className="drop-shadow-sm">เข้าสู่ระบบด้วย KU All</span>
              </div>
            </button>

            {/* Beautiful OR Divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400 to-gray-400"></div>
              <div className="relative">
                <div className="bg-gray-100 border border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                  <span className="text-gray-700 font-bold text-xs">OR</span>
                </div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-400 to-gray-400"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] transform border border-white/20 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 font-bold text-lg text-white">
                <div className="bg-white rounded-full p-2 shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <span className="drop-shadow-sm">Google @ku.th</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center bg-primary pb-5 text-center text-white">
        <div className="flex gap-2">
          <a
            href="https://sa.ku.ac.th/website-policy/"
            target="_blank"
            rel="noopener"
          >
            นโยบายคุ้มครองข้อมูล
          </a>
          <div>●</div>
          <a href="https://sa.ku.ac.th/" target="_blank" rel="noopener">
            เว็บไซต์
          </a>
          <div>●</div>
          <a href="mailto:saku@ku.th">ติดต่อเรา</a>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-normal">
            สงวนลิขสิทธิ์ © {new Date().getFullYear()} กองพัฒนานิสิต
            มหาวิทยาลัยเกษตรศาสตร์{" "}
          </div>
          <div className="text-sm">
            {process.env.NEXT_PUBLIC_BUILD_MESSAGE ?? ""}
          </div>
        </div>
      </div>
    </div>
  );
}
