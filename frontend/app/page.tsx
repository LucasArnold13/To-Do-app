// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">KI To-Do Dashboard</h1>
          <nav className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/signup" className="text-gray-600 hover:text-gray-900">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
          Organisiere dein Studium smarter
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Behalte alle Aufgaben, Projekte und Termine im Blick – mit deiner persönlichen KI-unterstützten To-Do-App.
          Einfach eingeben, generieren lassen und fokussiert arbeiten.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700"
          >
            Jetzt starten
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md text-lg font-medium hover:bg-gray-300"
          >
            Einloggen
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Aufgaben verwalten</h3>
            <p className="text-gray-600">Strukturiere alle deine Aufgaben schnell und übersichtlich.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">KI-Unterstützung</h3>
            <p className="text-gray-600">Unsere KI hilft dir, Aufgaben automatisch zu sortieren und zu priorisieren.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Fortschritt verfolgen</h3>
            <p className="text-gray-600">Behalte deinen Lernfortschritt und anstehende Termine im Blick.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} KI To-Do Dashboard. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
