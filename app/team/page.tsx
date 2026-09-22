import dbConnect from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import TeamClientView from "@/components/team-client-view";

export const revalidate = 0; // Ensures data is fresh

export default async function TeamPage() {
  await dbConnect();
  
  // Fetch members from the database
  const members = await TeamMember.find({}).sort({ createdAt: 1 }).lean();
  
  // Map MongoDB documents to the Member format expected by TeamClientView
  const mappedTeam = members.map((m: any) => ({
    name: m.name,
    role: m.role,
    bio: m.bio || "",
    focus: m.focus || [],
    image: m.imageUrl || "",
    portfolio: m.portfolio || "",
    github: m.github || "",
    instagram: m.instagram || "",
    linkedin: m.linkedin || "",
    team: m.team || "core",
    level: m.level ?? 4,
    isAlumni: m.isAlumni || false,
  }));

  return <TeamClientView team={mappedTeam} />;
}