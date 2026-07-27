// components/admin/FabricLineForm.jsx - VERSIÓN CORREGIDA
"use client"

import { useState } from "react"

export function FabricLineForm({ existingLine, onSuccess }) {
  const [name, setName] = useState(existingLine?.name || "")
  const [description, setDescription] = useState(existingLine?.description || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const url = existingLine ? `/api/fabric-lines/${existingLine._id}` : "/api/fabric-lines"
      const method = existingLine ? "PUT" : "POST"

      console.log(`📤 Enviando ${method} a ${url}`)
      console.log(`📦 Datos:`, { name, description })

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      })

      console.log(`📥 Respuesta - Status: ${res.status}`)

      const data = await res.json()
      console.log(`📄 Datos de respuesta:`, data)

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar")
      }

      console.log(`✅ Operación exitosa`)
      setSuccess(existingLine ? "Línea actualizada correctamente" : "Línea creada correctamente")
      
      // Limpiar formulario solo si es creación
      if (!existingLine) {
        setName("")
        setDescription("")
      }
      
      // Primero desactivar loading
      setLoading(false)
      
      // Luego llamar a onSuccess después de un pequeño delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
        // Limpiar mensaje de éxito después de un tiempo
        setTimeout(() => {
          setSuccess("")
        }, 2000)
      }, 500)
      
    } catch (err) {
      console.error("❌ Error:", err)
      setError(err.message || "Error de conexión")
      setLoading(false) // Asegurarse de desactivar loading en caso de error
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-red-800">{error}</div>
            <button 
              type="button"
              onClick={() => setError("")}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-green-800">{success}</div>
            <button 
              type="button"
              onClick={() => setSuccess("")}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Línea
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Colección Premium Otoño 2024"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={loading}
            />
            <div className="absolute right-3 top-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe las características principales, materiales y usos recomendados de esta línea..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none min-h-[120px]"
            rows="4"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Nota:</span> Los campos marcados con * son obligatorios
        </div>
        
        <div className="flex items-center space-x-3">
          {existingLine && (
            <button
              type="button"
              onClick={() => {
                setName(existingLine.name)
                setDescription(existingLine.description)
              }}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Restablecer
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden min-w-[160px]"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="relative flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{existingLine ? "Actualizando..." : "Creando..."}</span>
                </>
              ) : (
                <>
                  {existingLine ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Actualizar Línea</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Crear Línea</span>
                    </>
                  )}
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </form>
  )
}