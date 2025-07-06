"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {

  const router = useRouter();

  const LoginHandler = () => {
    router.push("/login");
  }

  return (
    <nav className="relative z-10 bg-[#006C67] ml-[15rem]">
      <div className="w-full ">
        <div className="flex h-15 justify-between items-center px-4">
            <h3 className="text-white">
                หน้า....
            </h3>
          <div className="flex items-end justify-end  space-x-4">
            <button
              onClick={LoginHandler}
              className="bg-[#B2BB1C] px-4 py-2 rounded-md text-white font-semibold text-sm hover:bg-[#9FAF1A]  transition-colors duration-300"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}