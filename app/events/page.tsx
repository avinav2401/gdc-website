import type { Metadata } from "next";
import EventsClientView from "@/components/events-client-view";
import dbConnect from "@/lib/mongodb";
import EventModel from "@/models/Event";
import { ClubEvent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events — GDC",
  description:
    "Past, ongoing, and upcoming events from Game Developer's Community displayed in a comic book timeline issue format.",
};

export const revalidate = 0; // Disable static rendering so events update immediately

export default async function EventsPage() {
  await dbConnect();
  
  // Fetch events from the database
  const dbEvents = await EventModel.find({}).sort({ date: -1 }).lean();
  
  // Map database events to the ClubEvent structure expected by the client view
  const events: ClubEvent[] = dbEvents.map((e: any) => ({
    slug: e.slug || e._id.toString(),
    title: e.title,
    status: e.status || "planned",
    version: e.version || "GDC-DB",
    date: e.date,
    dateSort: e.dateSort || e.date,
    location: e.location,
    summary: e.description,
    tags: e.tags || [],
    image: e.imageUrl || "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80",
    registerUrl: e.registerUrl || "",
    shape: e.shape || "half",
    floatingAssets: e.floatingAssets || [],
  }));

  return <EventsClientView events={events} />;
}