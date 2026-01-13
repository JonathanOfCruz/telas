"use client"

import { useState, useEffect } from "react"

export default function FabricForm({ initialData, onSave }) {
  const [fabricLineId, setFabricLineId] = useState(initialData?.fabricLineId || "")
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [closure, setClosure] = useState(initialData?.closure || "")
  const [thread, setThread] = useState(initialData?.thread || "")
  const [images, setImages] = useState(initialData?.images || [])
  const [fabricLines, setFabricLines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchFabricLines()
  }, [])

  const fetchFabricLines = async () => {
    try {
      const res = await fetch("/api/fabric-lines")
      const data = await res.json()
      setFabricLines(data)
    } catch (error) {
      console.error("Error fetching fabric lines:", error)
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (data.url) {
          setImages([...images, data.url])
        }
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = initialData ? `/api/fabrics/${initialData._id}` : "/api/fabrics"
      const method = initialData ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fabricLineId,
          name,
          description,
          closure,
          thread,
          images,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Error al guardar")
        return
      }

      onSave()
    } catch (err) {
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Línea de Tela</label>
        <select
          value={fabricLineId}
          onChange={(e) => setFabricLineId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Selecciona una línea</option>
          {fabricLines.map((line) => (
            <option key={line._id} value={line._id}>
              {line.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cierre</label>
        <input
          type="text"
          value={closure}
          onChange={(e) => setClosure(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Cremallera de metal"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hilo</label>
        <input
          type="text"
          value={thread}
          onChange={(e) => setThread(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Hilo de algodón"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Imágenes subidas: {images.length}</p>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img || "/placeholder.svg"} alt="preview" className="w-full h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {loading ? "Guardando..." : "Guardar Tela"}
      </button>
    </form>
  )
}
