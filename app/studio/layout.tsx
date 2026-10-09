import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swibp — студия",
  description: "Редактор каруселей Swibp",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
