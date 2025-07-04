export default function Navbar() {
  return (
    <nav className="relative z-10 bg-[#006C67] ml-[15rem]">
      <div className="w-full ">
        <div className="flex h-15 justify-between items-center px-4">
            <h3 className="text-white">
                หน้า....
            </h3>
          <div className="flex items-end justify-end  space-x-4">
            <button className="bg-[#B2BB1C] px-4 py-2 rounded-md text-white font-semibold text-sm hover:bg-[#9FAF1A]  transition-colors duration-300">
              ลงชื่อเข้าใช้
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}