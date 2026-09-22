import { supabase } from "@/lib/supabase";
import TeamClientView from "@/components/team-client-view";

export const revalidate = 0; // Ensures data is fresh

export default async function TeamPage() {
  
  // Fetch members from the database
  const { data: members } = await supabase
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: true });
  
  // Map Supabase documents to the Member format expected by TeamClientView
  const mappedTeam = (members || []).map((m: any) => ({
    name: m.name,
    role: m.role,
    bio: m.bio || "",
    focus: m.focus || [],
    image: m.image_url || "",
    portfolio: m.portfolio || "",
    github: m.github || "",
    instagram: m.instagram || "",
    linkedin: m.linkedin || "",
    team: m.team || "core",
    level: m.level ?? 4,
    isAlumni: m.is_alumni || false,
  }));

  return <TeamClientView team={mappedTeam} />;
}