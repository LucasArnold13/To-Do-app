import Navbar from "../../components/Navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<>

        <main>{children}</main>
</>


  )
}