import Navbar from "../components/Navbar"


export default function StudyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<>
        <Navbar />
        <main>{children}</main>
</>


  )
}