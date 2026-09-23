import type { Metadata } from "next";
import EventsClientView from "@/components/events-client-view";
import { supabase } from "@/lib/supabase";
import { ClubEvent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events — GDC",
  description:
    "Past, ongoing, and upcoming events from Game Developer's Community displayed in a comic book timeline issue format.",
};

export const revalidate = 0;

export default async function EventsPage() {
  // Fetch events from Supabase
  const { data: dbEvents, error } = await supabase
    .from("events")
    .select("*")
    .order("date_sort", { ascending: false });

  if (error) {
    console.error("Failed to fetch events:", error);
  }

  // Map Supabase events to the ClubEvent structure
  const events: ClubEvent[] = (dbEvents || []).map((e: any) => ({
    slug: e.slug || e.id,
    title: e.title,
    status: e.status || "planned",
    version: e.version || "GDC-DB",
    date: e.date,
    dateSort: e.date_sort || e.date,
    location: e.location,
    summary: e.description || "",
    tags: e.tags || [],
    image:
      e.image_url ||
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80",
    registerUrl: e.register_url || "",
    shape: e.shape || "half",
    floatingAssets: e.floating_assets || [],
  }));

  return <EventsClientView events={events} />;
}