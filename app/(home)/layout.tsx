import { ProtectedLayout } from "@/components/protected-layout";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
