import AdminShell from "@/components/Admin/AdminShell";

export const metadata = {
  title: "Admin | Skyline Properties",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
