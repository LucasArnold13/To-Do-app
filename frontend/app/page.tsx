// app/page.tsx
import Link from "next/link";

const techStack = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Spring Boot', 'PostgreSQL', 'Docker', 'AWS', 'JWT', 'GitHub Actions'];

const features = [
  {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'CRUD Operations',
    description: 'RESTful API mit vollständiger Create, Read, Update, Delete Funktionalität.'
  },
  {
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    title: 'JWT Authentication',
    description: 'Sichere Authentifizierung mit geschützten Routes und Token-basiertem Login.'
  },
  {
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    title: 'Docker & CI/CD',
    description: 'Containerisierung mit Docker und automatisches Deployment via GitHub Actions.'
  },
  {
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    title: 'AWS Cloud Hosting',
    description: 'Production-ready Deployment auf AWS mit ECS, RDS PostgreSQL, Load Balancer und VPC.'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Full-Stack Demo</h1>
            <p className="text-sm text-gray-600">von Lucas Arnold</p>
          </div>
          <nav className="space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
              Registrieren
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            🚀 Demo-Projekt
          </span>
        </div>
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Moderne To-Do App<br />
          <span className="text-blue-600">Full-Stack Showcase</span>
        </h2>
        <p className="text-gray-700 text-lg mb-8 max-w-2xl leading-relaxed">
          Ein Fullstack Porjekt zum vorzeigen meiner Fähigkeiten
        </p>
        <div className="flex justify-center gap-4 mb-12">
          <Link
            href="/register"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg transform transition duration-200 hover:-translate-y-0.5"
          >
            Demo testen
          </Link>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
          {techStack.map((tech) => (
            <span key={tech} className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg text-sm font-medium shadow-sm">
              {tech}
            </span>
          ))}
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Implementierte Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <svg className={`w-6 h-6 ${feature.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
          <p className="mb-2 font-medium">Demo-Projekt zur Demonstration von Full-Stack Development Fähigkeiten</p>
          <p>&copy; {new Date().getFullYear()} Lucas Arnold. Built with React, Next.js & Spring Boot.</p>
        </div>
      </footer>
    </div>
  );
}
