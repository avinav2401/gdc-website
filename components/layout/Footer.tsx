import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t-8 border-white bg-[#07080D] text-white overflow-hidden">
      {/* Top Neon Accent Bar */}
      <div className="h-2 w-full bg-[#00F2FE]" />

      {/* Background Hatch Texture */}
      <div className="absolute inset-0 hatch opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-5">
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 mb-4 group border-4 border-white px-4 py-3 bg-[#0D0E17] shadow-[5px_5px_0px_#FF007F] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <img 
                src="/logo.png" 
                alt="GDC Logo" 
                className="w-10 h-10 border-2 border-white [image-rendering:pixelated] group-hover:scale-105 transition-transform" 
              />
              <div className="flex flex-col leading-none">
                <span className="font-black text-2xl uppercase tracking-widest block text-white">GDC</span>
                <span className="text-[9px] text-[#00F2FE] uppercase tracking-[0.2em] font-bold">Game Developers Community</span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm mt-2 font-sans">
              A student-run collective turning ideas into playable realities. We build games, run jams, and ship together.
            </p>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-3">
            <h3 className="font-black text-xl uppercase mb-4 text-[#00F2FE] border-b-4 border-[#00F2FE] pb-1 tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {[
                ["Featured Games", "/#creations"],
                ["Events & Jams", "/#events"],
                ["The Core Team", "/#team"],
                ["Join the Club", "/#join"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link 
                    href={href}
                    className="text-sm text-gray-300 hover:text-[#00F2FE] hover:translate-x-1 transition-all inline-flex items-center gap-2 uppercase tracking-wider font-bold group"
                  >
                    <span className="text-[#FF007F] opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Access & Jam Alerts */}
          <div className="md:col-span-4">
            <h3 className="font-black text-xl uppercase mb-4 text-[#FF007F] border-b-4 border-[#FF007F] pb-1 tracking-wider">
              Developer Access
            </h3>
            <ul className="space-y-2.5 mb-6">
              {[
                ["Member Login", "/auth"],
                ["Submit a Game", "/dashboard"],
                ["Admin Portal", "/admin"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link 
                    href={href}
                    className="text-sm text-gray-300 hover:text-[#FF007F] transition-all inline-flex items-center gap-2 uppercase tracking-wider font-bold group"
                  >
                    <span className="text-[#00F2FE] opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="border-4 border-white bg-[#0D0E17] p-4 shadow-[5px_5px_0px_#00F2FE]">
              <p className="font-black text-sm uppercase mb-2 text-[#00F2FE] tracking-wider">Get Jam Alerts</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  className="flex-1 bg-[#07080D] border-2 border-white px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F2FE] transition-colors font-mono" 
                />
                <button className="px-4 py-1.5 bg-[#FF007F] text-white font-bold text-xs uppercase border-2 border-white hover:bg-[#00F2FE] hover:text-black transition-all shadow-[2px_2px_0px_#ffffff]">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-4 border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">
            © {new Date().getFullYear()} Game Developers Community — Made with ❤️ and late nights.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Code of Conduct", "Open Source"].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-xs text-gray-400 hover:text-[#00F2FE] transition-colors uppercase tracking-wider font-bold"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}