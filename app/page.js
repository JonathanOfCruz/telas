// app/page.js - VERSIÓN CON SERVER COMPONENT
import { connectDB } from "@/lib/mongodb"
import FabricLine from "@/lib/models/FabricLine"
import { CatalogClient } from "@/components/catalog/CatalogClient"

export const metadata = {
  title: "Catálogo de Telas - Textile Catalog",
  description: "Explora nuestro completo catálogo de líneas de telas premium",
}

async function getFabricLinesCount() {
  try {
    await connectDB()
    const count = await FabricLine.countDocuments()
    return count
  } catch (error) {
    console.error("Error counting fabric lines:", error)
    return 0
  }
}

export default async function HomePage() {
  const fabricLinesCount = await getFabricLinesCount()
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white border-b border-gray-100">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Telas</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Descubre nuestra colección exclusiva de líneas de telas premium, 
              cuidadosamente seleccionadas para proyectos de alta costura y diseño textil.
            </p>
            
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">{`${fabricLinesCount} líneas disponibles`}</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="text-sm text-gray-500">
                Actualizado recientemente
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <CatalogClient />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900">Textile Catalog</div>
                <div className="text-sm text-gray-500">Sistema de gestión textil</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 text-center md:text-right">
              <div>© {new Date().getFullYear()} Textile Catalog. Todos los derechos reservados.</div>
              <div className="mt-1">v1.0.0 • Sistema profesional de catálogo textil</div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}