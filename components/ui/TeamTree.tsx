"use client";

const roleConfig: Record<string, { color: string; shadow: string; emoji: string; accent: string }> = {
  "President":          { color:"#FFD700", shadow:"#997a00", emoji:"👑", accent:"#FFD700" },
  "Vice President":     { color:"#FF2020", shadow:"#880000", emoji:"⚡", accent:"#FF2020" },
  "Technical Lead":     { color:"#1A8FFF", shadow:"#004d99", emoji:"💻", accent:"#1A8FFF" },
  "Design Lead":        { color:"#a78bfa", shadow:"#4c1d95", emoji:"🎨", accent:"#a78bfa" },
  "Art Lead":           { color:"#f472b6", shadow:"#831843", emoji:"🖌️", accent:"#f472b6" },
  "Events Coordinator": { color:"#fb923c", shadow:"#7c2d12", emoji:"📅", accent:"#fb923c" },
  "Outreach & Socials": { color:"#34d399", shadow:"#064e3b", emoji:"📣", accent:"#34d399" },
  "Faculty in Charge":  { color:"#94a3b8", shadow:"#334155", emoji:"🎓", accent:"#94a3b8" },
};

function MemberCard({ member, size = "md" }: { member: any; size?: "lg" | "md" | "sm" }) {
  const cfg = roleConfig[member.role] ?? { color:"#FFD700", shadow:"#997a00", emoji:"👾", accent:"#FFD700" };

  const widths  = { lg:"w-52", md:"w-44", sm:"w-36" };
  const avtrSz  = { lg:"w-20 h-20 text-4xl", md:"w-16 h-16 text-3xl", sm:"w-12 h-12 text-2xl" };
  const titleSz = { lg:"text-2xl", md:"text-xl", sm:"text-lg" };
  const padSz   = { lg:"p-5", md:"p-4", sm:"p-3" };

  return (
    <div className={`group ${widths[size]} transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px] cursor-default`}>
      <div className="border-4 border-white bg-[#111] flex flex-col"
        style={{ boxShadow:`5px 5px 0 ${cfg.color}` }}
        onMouseEnter={e=>(e.currentTarget.style.boxShadow=`8px 8px 0 ${cfg.color}`)}
        onMouseLeave={e=>(e.currentTarget.style.boxShadow=`5px 5px 0 ${cfg.color}`)}>

        {/* Coloured top stripe */}
        <div className="h-2 w-full border-b-2 border-white" style={{ background: cfg.color }} />

        <div className={`${padSz[size]} flex flex-col items-center text-center`}>
          {/* Avatar — hatched panel */}
          <div className={`${avtrSz[size]} border-2 border-white flex items-center justify-center mb-3 hatch`}
            style={{ background:`${cfg.color}22` }}>
            <span>{cfg.emoji}</span>
          </div>

          {/* Role */}
          <p className={`font-display ${titleSz[size]} uppercase leading-tight mb-1`} style={{ color: cfg.color }}>
            {member.role}
          </p>
          {/* Name */}
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{member.name}</p>

          {/* Focus tags */}
          {size !== "sm" && (
            <div className="flex flex-wrap justify-center gap-1">
              {member.focus.slice(0,2).map((f: string) => (
                <span key={f} className="text-[9px] px-1.5 py-0.5 border border-white/30 text-gray-400 uppercase tracking-wide font-bold">
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VLine({ h = "h-8" }: { h?: string }) {
  return (
    <div className={`w-1 ${h} mx-auto bg-white border-x border-black`} />
  );
}

function HLine() {
  return (
    <div className="w-full h-1 bg-white border-y border-black" />
  );
}

export function TeamTree({ team }: { team: any[] }) {
  const president = team.find(m => m.role === "President");
  const vp        = team.find(m => m.role === "Vice President");
  const heads     = team.filter(m => !["President","Vice President","Faculty in Charge"].includes(m.role) && m.team==="core");
  const faculty   = team.find(m => m.team === "faculty");

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="min-w-[760px] flex flex-col items-center">

        {/* Faculty - offset */}
        {faculty && (
          <div className="self-end mr-6 mb-2 opacity-75 hover:opacity-100 transition-opacity relative">
            <div className="absolute -top-2 -left-2 bg-white text-black text-[9px] font-bold uppercase px-1.5 border border-black">
              Faculty
            </div>
            <MemberCard member={faculty} size="sm" />
          </div>
        )}

        {/* President */}
        <MemberCard member={president} size="lg" />
        <VLine h="h-8" />

        {/* VP */}
        <MemberCard member={vp} size="md" />
        <VLine h="h-8" />

        {/* Horizontal branch + drop lines */}
        <div className="relative w-full max-w-4xl">
          {/* The horizontal line across all heads */}
          <div className="h-1 bg-white w-[80%] mx-auto border-y border-black" />

          <div className="flex justify-around w-[80%] mx-auto pt-0">
            {heads.map((head) => (
              <div key={head.name} className="flex flex-col items-center">
                <div className="w-px h-6 bg-white border-x border-black" />
                <MemberCard member={head} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* "Executives / Heads" label */}
        <p className="font-display text-sm uppercase tracking-widest text-gray-500 mt-4 border-t-2 border-dashed border-white/10 pt-3 w-[80%] text-center">
          Heads &amp; Leads
        </p>

      </div>
    </div>
  );
}
