"use client"

import { useState, useEffect } from "react"
import { FabricForm } from "./FabricForm"

export function FabricManagement({ fabricLines, onRefresh }) {
  const [selectedLineId, setSelectedLineId] = useState(fabricLines[0]?._id || "")
  const [fabrics, setFabrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState(null)

  // Cargar telas cuando el componente se monta y cuando cambia la línea seleccionada
  useEffect(() => {
    if (selectedLineId) {
      fetchFabrics(selectedLineId)
    }
  }, [selectedLineId])

  const handleLineSelect = async (lineId) => {
    setSelectedLineId(lineId)
    setEditingId(null)
    setError(null)
    // No es necesario llamar a fetchFabrics aquí porque el useEffect lo hará
  }

  const fetchFabrics = async (lineId) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log(`📥 Cargando telas para línea: ${lineId}`)
      console.log(`🔍 ID de línea a buscar:`, lineId)
      
      const res = await fetch("/api/fabrics")
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudieron cargar las telas`)
      }
      
      const data = await res.json()
      console.log(`📊 Respuesta completa del API:`, data)
      console.log(`📊 Total de telas recibidas:`, data.data?.length || 0)
      
      if (data.success && Array.isArray(data.data)) {
        // Mostrar todas las telas y sus fabricLine para debug
        data.data.forEach((f, index) => {
          console.log(`📝 Tela ${index + 1}:`, {
            id: f._id,
            name: f.name,
            fabricLine: f.fabricLine,
            fabricLineType: typeof f.fabricLine
          })
        })
        
        // Filtrar telas por línea
        const linesFabrics = data.data.filter((f) => {
          if (!f.fabricLine) {
            console.warn(`⚠️ Tela sin fabricLine:`, f._id)
            return false
          }
          
          // Determinar el ID de la línea de tela
          let fabricLineId
          if (typeof f.fabricLine === 'object' && f.fabricLine !== null) {
            fabricLineId = f.fabricLine._id || f.fabricLine.toString()
          } else {
            fabricLineId = f.fabricLine.toString()
          }
          
          console.log(`🔍 Comparando: ${fabricLineId} === ${lineId} = ${fabricLineId === lineId}`)
          return fabricLineId === lineId
        })
        
        console.log(`📊 Telas filtradas para esta línea: ${linesFabrics.length}`)
        console.log(`📊 Telas filtradas:`, linesFabrics.map(f => f.name))
        
        setFabrics(linesFabrics)
      } else {
        throw new Error(data.error || "Error al cargar las telas")
      }
    } catch (error) {
      console.error("❌ Error fetching fabrics:", error)
      setError(error.message || "Error al cargar las telas")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFabric = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tela?")) return

    setDeleting(id)
    setError(null)
    
    try {
      console.log(`🗑️ Intentando eliminar tela con ID: ${id}`)
      
      const res = await fetch(`/api/fabrics/${id}`, { 
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log(`📥 Respuesta del servidor - Status: ${res.status}`)

      let data
      try {
        data = await res.json()
        console.log(`📄 Datos de respuesta:`, data)
      } catch (parseError) {
        console.error("❌ Error al parsear respuesta:", parseError)
        const textResponse = await res.text()
        console.log(`📄 Respuesta de texto:`, textResponse)
        throw new Error(textResponse || "Error al eliminar la tela")
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || `Error ${res.status}: No se pudo eliminar la tela`)
      }

      console.log(`✅ Tela eliminada exitosamente`)
      
      // Recargar las telas
      await fetchFabrics(selectedLineId)
      onRefresh()
      
    } catch (error) {
      console.error("❌ Error al eliminar tela:", error)
      setError(error.message || "Error al eliminar la tela")
      alert(`Error: ${error.message || "No se pudo eliminar la tela"}`)
    } finally {
      setDeleting(null)
    }
  }

  const selectedLine = fabricLines.find((l) => l._id === selectedLineId)

  return (
    <div className="space-y-8">
      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Seleccionar Línea de Tela
        </label>
        <select
          value={selectedLineId}
          onChange={(e) => handleLineSelect(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {fabricLines.map((line) => (
            <option key={line._id} value={line._id}>
              {line.name}
            </option>
          ))}
        </select>
      </div>

      {selectedLine && (
        <FabricForm 
          fabricLineId={selectedLine._id} 
          onSuccess={() => {
            console.log("🎉 Tela creada/actualizada, recargando...")
            fetchFabrics(selectedLineId)
          }} 
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Telas de {selectedLine?.name}
          </h3>
          {!loading && (
            <button
              onClick={() => fetchFabrics(selectedLineId)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Cargando telas...</span>
            </div>
          </div>
        ) : fabrics.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay telas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando una nueva tela para esta línea.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fabrics.map((fabric) => (
              <div key={fabric._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{fabric.name}</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Color:</span> {fabric.color}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cierre:</span> {fabric.closure?.code || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Hilo:</span> {fabric.thread?.code || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setEditingId(editingId === fabric._id ? null : fabric._id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      {editingId === fabric._id ? "Cancelar" : "Editar"}
                    </button>
                    <button
                      onClick={() => handleDeleteFabric(fabric._id)}
                      disabled={deleting === fabric._id}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium text-sm transition-colors disabled:cursor-not-allowed"
                    >
                      {deleting === fabric._id ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
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

                {fabric.image && (
                  <div className="mt-3">
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      className="h-20 w-auto object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {editingId === fabric._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <FabricForm
                      fabricLineId={selectedLineId}
                      existingFabric={fabric}
                      onSuccess={() => {
                        setEditingId(null)
                        fetchFabrics(selectedLineId)
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}