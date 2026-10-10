import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swibp — studio",
  description: "Swibp carousel editor",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
