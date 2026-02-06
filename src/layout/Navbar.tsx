import { Bell, Search } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-16 bg-white ">
      <div className="h-full px-6 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="flex items-center gap-2 ml-10 w-[640px] h-9 px-4 border border-gray-300 rounded-full text-gray-500 focus-within:ring-1 focus-within:ring-gray-400">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Notification */}
          <div className="relative cursor-pointer">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </div>
        </div>
  <div className="h-10 w-px bg-gray-300" />
        {/* RIGHT */}
        <div className="flex items-center gap-8">
          <div className="text-right text-sm leading-tight">
            <p className="font-semibold text-[15px] text-gray-900">
              September 29, 2025
            </p>
            <p className="text-gray-500 text-start text-[16px]">
              Chennai · 22°C
            </p>
          </div>

          <div className="h-10 w-px bg-gray-300" />

          <p className="font-semibold text-[20px] text-gray-900 whitespace-nowrap">
            Ram Constructions
          </p>
        </div>

      </div>
    </header>
  );
};

export default Navbar;