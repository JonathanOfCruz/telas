"use client"

import { useState } from "react"
import { FabricLineForm } from "./FabricLineForm"

export function FabricLineList({ fabricLines, onRefresh }) {
  const [editingId, setEditingId] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta línea de tela?")) return

    setDeleting(id)
    setError(null)
    
    try {
      console.log(`🗑️ Intentando eliminar línea con ID: ${id}`)
      
      const res = await fetch(`/api/fabric-lines/${id}`, { 
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log(`📥 Respuesta del servidor - Status: ${res.status}`)

      // Intentar obtener la respuesta como JSON
      let data
      try {
        data = await res.json()
        console.log(`📄 Datos de respuesta:`, data)
      } catch (parseError) {
        console.error("❌ Error al parsear respuesta:", parseError)
        // Si no se puede parsear como JSON, usar el texto de respuesta
        const textResponse = await res.text()
        console.log(`📄 Respuesta de texto:`, textResponse)
        data = { error: textResponse || "Error al eliminar" }
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || `Error ${res.status}: No se pudo eliminar la línea`)
      }

      console.log(`✅ Línea eliminada exitosamente`)
      setDeleting(null)
      onRefresh() // Actualizar la lista

    } catch (error) {
      console.error("❌ Error al eliminar:", error)
      setError(error.message || "Error al eliminar la línea de tela")
      setDeleting(null)
      
      // Mostrar alerta con el error
      alert(`Error: ${error.message || "No se pudo eliminar la línea de tela"}`)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Líneas de Telas Registradas</h2>

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-xs text-red-600 hover:text-red-800 mt-1"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {fabricLines.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay líneas de telas</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva línea de tela.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fabricLines.map((line) => (
            <div key={line._id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{line.name}</h3>
                  {line.description && (
                    <p className="text-gray-600 text-sm mt-1">{line.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {line.fabrics?.length || 0} tela(s) asociada(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(editingId === line._id ? null : line._id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    {editingId === line._id ? "Cancelar" : "Editar"}
                  </button>
                  <button
                    onClick={() => handleDelete(line._id)}
                    disabled={deleting === line._id}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium text-sm transition-colors disabled:cursor-not-allowed"
                  >
                    {deleting === line._id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Eliminando...
                      </span>
                    ) : (
                      "Eliminar"
                    )}
                  </button>
                </div>
              </div>

              {editingId === line._id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <FabricLineForm
                    existingLine={line}
                    onSuccess={() => {
                      setEditingId(null)
                      onRefresh()
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}