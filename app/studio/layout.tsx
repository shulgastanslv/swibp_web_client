<<<<<<< HEAD:app/studio/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swibp — студия",
  description: "Редактор каруселей Swibp",
};

export default function StudioLayout({
=======
import { ProtectedLayout } from "@/components/protected-layout";

export default function HomeLayout({
>>>>>>> cursor/canvas-architecture-refactor-9641:app/(home)/layout.tsx
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD:app/studio/layout.tsx
  return children;
=======
  return <ProtectedLayout>{children}</ProtectedLayout>;
>>>>>>> cursor/canvas-architecture-refactor-9641:app/(home)/layout.tsx
}
