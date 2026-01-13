// components/admin/FabricForm.jsx - DISEÑO MINIMALISTA CON UPLOAD
"use client"

import { useState, useRef } from "react"

export function FabricForm({ fabricLineId, existingFabric, onSuccess }) {
  const [name, setName] = useState(existingFabric?.name || "")
  const [color, setColor] = useState(existingFabric?.color || "")
  const [image, setImage] = useState(existingFabric?.image || "")
  const [closureCode, setClosureCode] = useState(existingFabric?.closure?.code || "")
  const [closureColor, setClosureColor] = useState(existingFabric?.closure?.color || "")
  const [closureImage, setClosureImage] = useState(existingFabric?.closure?.image || "")
  const [threadCode, setThreadCode] = useState(existingFabric?.thread?.code || "")
  const [threadColor, setThreadColor] = useState(existingFabric?.thread?.color || "")
  const [threadImage, setThreadImage] = useState(existingFabric?.thread?.image || "")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fileInputRefs = {
    fabric: useRef(null),
    closure: useRef(null),
    thread: useRef(null)
  }

  const uploadImage = async (file, type) => {
    const formData = new FormData()
    formData.append("file", file)
    setUploading(type)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Error al subir imagen")
      }

      return data.path
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    } finally {
      setUploading("")
    }
  }

  const FileUploadInput = ({ 
    label, 
    value, 
    onChange,
    type,
    preview = true
  }) => {
    const [dragOver, setDragOver] = useState(false)

    const handleFileSelect = async (file) => {
      if (!file.type.startsWith("image/")) {
        setError("Por favor selecciona un archivo de imagen válido")
        return
      }

      try {
        const imagePath = await uploadImage(file, type)
        onChange(imagePath)
      } catch (error) {
        setError("Error al subir la imagen: " + error.message)
      }
    }

    const handleDrop = async (e) => {
      e.preventDefault()
      setDragOver(false)
      const files = e.dataTransfer.files
      if (files && files[0]) {
        await handleFileSelect(files[0])
      }
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      setDragOver(true)
    }

    const handleDragLeave = () => {
      setDragOver(false)
    }

    const handleInputChange = async (e) => {
      const file = e.target.files?.[0]
      if (file) {
        await handleFileSelect(file)
      }
    }

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        
        <div className="space-y-4">
          {value ? (
            <div className="space-y-3">
              {preview && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                  <img
                    src={value || "/placeholder.svg"}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="URL de la imagen"
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs[type].current?.click()}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  Cambiar
                </button>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragOver 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              } ${uploading === type ? "opacity-50" : ""}`}
            >
              <input
                ref={fileInputRefs[type]}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
              
              {uploading === type ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Subiendo imagen...</p>
                    <p className="text-xs text-gray-500 mt-1">Por favor espera</p>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRefs[type].current?.click()}
                  className="w-full h-full"
                >
                  <div className="space-y-4">
                    <div className="mx-auto w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Haz clic o arrastra una imagen
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP hasta 5MB
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const url = existingFabric ? `/api/fabrics/${existingFabric._id}` : "/api/fabrics"
      const method = existingFabric ? "PUT" : "POST"

      if (!name || !color || !fabricLineId) {
        setError("Nombre, color y línea de tela son requeridos")
        setLoading(false)
        return
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          color,
          image: image || "/assorted-fabrics.png",
          fabricLine: fabricLineId,
          closure: {
            code: closureCode || "SIN-CODIGO",
            color: closureColor || "Sin color",
            image: closureImage || "/assorted-fabrics.png",
          },
          thread: {
            code: threadCode || "SIN-CODIGO",
            color: threadColor || "Sin color",
            image: threadImage || "/assorted-fabrics.png",
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al guardar")
        setLoading(false)
        return
      }

      setSuccess(existingFabric ? "Tela actualizada correctamente" : "Tela creada correctamente")
      
      if (!existingFabric) {
        setName("")
        setColor("")
        setImage("")
        setClosureCode("")
        setClosureColor("")
        setClosureImage("")
        setThreadCode("")
        setThreadColor("")
        setThreadImage("")
      }
      
      setTimeout(() => {
        onSuccess()
      }, 1000)
    } catch (err) {
      setError("Error de conexión: " + err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-red-800">{error}</div>
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
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Tela
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Tela Premium Blue"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Ej: Azul Marino"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

      <FileUploadInput 
        label="Imagen de la Tela" 
        value={image} 
        onChange={setImage}
        type="fabric"
      />

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Especificaciones del Cierre</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Cierre
            </label>
            <input
              type="text"
              value={closureCode}
              onChange={(e) => setClosureCode(e.target.value)}
              placeholder="Ej: CIERRE-001"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Cierre
            </label>
            <input
              type="text"
              value={closureColor}
              onChange={(e) => setClosureColor(e.target.value)}
              placeholder="Ej: Dorado"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="mt-6">
          <FileUploadInput 
            label="Imagen del Cierre" 
            value={closureImage} 
            onChange={setClosureImage}
            type="closure"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Especificaciones del Hilo</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Hilo
            </label>
            <input
              type="text"
              value={threadCode}
              onChange={(e) => setThreadCode(e.target.value)}
              placeholder="Ej: HILO-001"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Hilo
            </label>
            <input
              type="text"
              value={threadColor}
              onChange={(e) => setThreadColor(e.target.value)}
              placeholder="Ej: Blanco"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="mt-6">
          <FileUploadInput 
            label="Imagen del Hilo" 
            value={threadImage} 
            onChange={setThreadImage}
            type="thread"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Nota:</span> Los campos marcados con * son obligatorios
          </div>
          
          <button
            type="submit"
            disabled={loading || uploading}
            className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="relative flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{existingFabric ? "Actualizando..." : "Creando..."}</span>
                </>
              ) : (
                <>
                  {existingFabric ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Actualizar Tela</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Crear Tela</span>
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