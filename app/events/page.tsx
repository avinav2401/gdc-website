import type { Metadata } from "next";
import EventsClientView from "@/components/events-client-view";
import { events } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events — GDC",
  description:
    "Past, ongoing, and upcoming events from Game Developer's Community displayed in a comic book timeline issue format.",
};

export default function EventsPage() {
  return <EventsClientView events={events} />;
}