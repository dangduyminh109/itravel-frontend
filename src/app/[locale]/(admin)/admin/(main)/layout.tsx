import Header from "@/components/layout/admin/header/Header";
import Sidebar from "@/components/layout/admin/sidebar/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="h-screen flex pt-12">
        <Sidebar />
        <main className="h-full flex-1 bg-background p-2 pb-3 overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}
