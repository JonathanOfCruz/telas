"use client"

import { useState } from "react"

export default function ImportSection() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null)
  }

  const handleDragDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile?.type === "text/csv") {
      setFile(droppedFile)
    }
  }

  const handleImport = async () => {
    if (!file) {
      setError("Selecciona un archivo CSV")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/import/csv", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al importar")
        return
      }

      setSuccess(`Importado exitosamente: ${data.imported} líneas/telas`)
      setFile(null)
    } catch (err) {
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csv = `nombre_linea,descripcion_linea,nombre_tela,descripcion_tela,cierre,hilo
Premium Cotton,Algodón premium,Cotton Basic,Algodón básico,Cremallera metal,Algodón
Silk Blend,Mezcla de seda,Silk Smooth,Seda suave,Botón,Seda`

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(csv))
    element.setAttribute("download", "template.csv")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Importar CSV</h2>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>
        )}

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
        >
          <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-input" />
          <label htmlFor="file-input" className="cursor-pointer block">
            <p className="text-gray-700 font-medium">
              {file ? file.name : "Arrastra un CSV o haz clic para seleccionar"}
            </p>
            <p className="text-gray-500 text-sm mt-1">Solo archivos .csv</p>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? "Importando..." : "Importar"}
          </button>

          <button
            onClick={downloadTemplate}
            className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 font-medium"
          >
            Descargar Plantilla
          </button>
        </div>
      </div>
    </div>
  )
}
