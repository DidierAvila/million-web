import './globals.css'
import type { Metadata } from 'next'
import NavBar from '@/components/layout/NavBar'

export const metadata: Metadata = {
  title: 'Million - Plataforma de Gestión de Propiedades',
  description: 'Sistema para la gestión de propiedades inmobiliarias',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="py-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
              <p>© 2023 Million - Plataforma de Gestión de Propiedades</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
