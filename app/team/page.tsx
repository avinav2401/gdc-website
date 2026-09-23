import { supabase } from "@/lib/supabase";
import TeamClientView from "@/components/team-client-view";

export const revalidate = 0; // Ensures data is fresh

export default async function TeamPage() {
  // Fetch team members from Supabase
  const { data: members, error } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch team members:", error);
  }

  // Map Supabase records to the format expected by TeamClientView
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