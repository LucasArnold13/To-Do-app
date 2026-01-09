// app/page.tsx
import Link from "next/link";

const techStack = ['Next.js', 'Spring Boot', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Liquibase', 'JUnit', 'Mockito', 'Docker', 'AWS', 'JWT', 'GitHub Actions'];

const features = [
  {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'CRUD Operations',
    description: 'Spring Boot RESTful API mit vollständiger Create, Read, Update, Delete Funktionalität.'
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
    description: 'Multi-Container Setup (Next.js + Spring Boot) mit Docker und automatisches Deployment via GitHub Actions.'
  },
  {
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    title: 'AWS Cloud Hosting',
    description: 'Production-ready Deployment auf AWS mit ECS, RDS PostgreSQL, Load Balancer und VPC.'
  },
  {
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    icon: 'M5 13l4 4L19 7',
    title: 'Automatisierte Tests',
    description: 'Umfassende Unit- und Integrationstests mit JUnit, Mockito, MockMvc und automatischem CI-Gate.'
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
          <nav className="flex items-center space-x-4">
            <a 
              href="https://github.com/LucasArnold13/To-Do-app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition group"
              aria-label="GitHub Repository"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline-block group-hover:text-blue-600 transition">Code ansehen</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Portfolio-Projekt
          </span>
        </div>
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
           To-Do App<br />
          <span className="text-blue-600">Next.js + Spring Boot</span>
        </h2>
        <p className="text-gray-700 text-lg mb-8 max-w-2xl leading-relaxed">
          Fullstack-Projekt mit <strong>Next.js Frontend</strong> und <strong>Spring Boot Backend</strong> – inklusive automatisierter Tests und AWS Cloud-Deployment
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
