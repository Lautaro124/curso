import Header from "@/components/Header";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header currentSection="admin" />
      {children}
    </>
  );
}
