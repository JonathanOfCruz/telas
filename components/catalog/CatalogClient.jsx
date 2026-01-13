// components/catalog/CatalogClient.jsx - DISEÑO MINIMALISTA ELEGANTE
"use client"

import { useState, useEffect } from "react"
import { FabricLineCard } from "./FabricLineCard"
import { FabricDetailsModal } from "./FabricDetailsModal"

export function CatalogClient() {
  const [fabricLines, setFabricLines] = useState([])
  const [filteredLines, setFilteredLines] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedFabric, setSelectedFabric] = useState(null)

  useEffect(() => {
    fetchFabricLines()
  }, [])

  useEffect(() => {
    const filtered = fabricLines.filter((line) => 
      line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredLines(filtered)
  }, [searchTerm, fabricLines])

  const fetchFabricLines = async () => {
    try {
      const res = await fetch("/api/fabric-lines")
      const data = await res.json()
      if (data.success) {
        setFabricLines(data.data)
        setFilteredLines(data.data)
      }
    } catch (error) {
      console.error("Error fetching fabric lines:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-gray-900 font-medium tracking-wide">Cargando catálogo</p>
          <p className="text-sm text-gray-500">Buscando las mejores telas para ti...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Header con estadísticas */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Explora Nuestro Catálogo</h1>
            <p className="mt-2 text-gray-600">
              Descubre nuestra exclusiva colección de líneas de telas premium
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{fabricLines.length}</div>
              <div className="text-sm text-gray-500">Líneas</div>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {fabricLines.reduce((acc, line) => acc + (line.fabrics?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-500">Telas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda elegante */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar líneas de telas por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   text-gray-900 placeholder-gray-500 transition-all duration-200
                   shadow-sm hover:shadow-md"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 
                     hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Resultados de búsqueda */}
      <div className="space-y-6">
        {searchTerm && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando <span className="font-semibold text-gray-900">{filteredLines.length}</span> de{" "}
              <span className="font-semibold text-gray-900">{fabricLines.length}</span> líneas
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}

        {/* Grid de líneas de telas */}
        {filteredLines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "No se encontraron resultados" : "Catálogo vacío"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm 
                ? "No encontramos líneas que coincidan con tu búsqueda. Intenta con otros términos."
                : "Actualmente no hay líneas de telas disponibles en el catálogo."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLines.map((line) => (
              <FabricLineCard 
                key={line._id} 
                fabricLine={line} 
                onFabricSelect={setSelectedFabric} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles de tela */}
      {selectedFabric && (
        <FabricDetailsModal 
          fabric={selectedFabric} 
          onClose={() => setSelectedFabric(null)} 
        />
      )}
    </div>
  )
}