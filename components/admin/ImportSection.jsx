"use client"

import { useState } from "react"

export function ImportSection({ onImportSuccess }) {
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const csvTemplate = `linea_nombre,linea_descripcion,tela_nombre,tela_color,tela_imagen,cierre_codigo,cierre_color,cierre_imagen,hilo_codigo,hilo_color,hilo_imagen
Línea Premium,Descripción de la línea premium,Tela Azul,Azul Marino,/images/fabric1.jpg,CIERRE-001,Dorado,/images/closure1.jpg,HILO-001,Blanco,/images/thread1.jpg
Línea Premium,Descripción de la línea premium,Tela Roja,Rojo Intenso,/images/fabric2.jpg,CIERRE-002,Plateado,/images/closure2.jpg,HILO-002,Negro,/images/thread2.jpg`

  const handleDownloadTemplate = () => {
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvTemplate))
    element.setAttribute("download", "plantilla-telas.csv")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleFileSelect = async (file) => {
    if (!file.name.endsWith(".csv")) {
      setError("Por favor selecciona un archivo CSV válido")
      return
    }

    setError("")
    setSuccess("")
    setImporting(true)

    try {
      const text = await file.text()

      const res = await fetch("/api/import/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: text }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al importar")
        setImporting(false)
        return
      }

      setSuccess(data.message)
      if (data.errors && data.errors.length > 0) {
        setError("Algunos errores durante la importación:\n" + data.errors.join("\n"))
      }

      setTimeout(() => {
        onImportSuccess()
      }, 1000)
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setImporting(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Importar Datos desde CSV</h2>

        <div className="space-y-4">
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Descargar Plantilla CSV
          </button>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              className="hidden"
              id="csv-input"
            />
            <label htmlFor="csv-input" className="cursor-pointer block">
              <p className="text-gray-900 font-semibold mb-1">Arrastra tu archivo CSV aquí</p>
              <p className="text-gray-600 text-sm">o haz clic para seleccionar un archivo</p>
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm whitespace-pre-wrap">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>
          )}

          {importing && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">Importando datos...</div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-3">Estructura del CSV</h3>
        <p className="text-gray-700 text-sm mb-4">Tu archivo CSV debe tener estas columnas:</p>
        <div className="bg-white rounded p-4 font-mono text-xs overflow-x-auto text-gray-900">
          <div>linea_nombre | linea_descripcion | tela_nombre | tela_color | tela_imagen</div>
          <div>cierre_codigo | cierre_color | cierre_imagen | hilo_codigo | hilo_color | hilo_imagen</div>
        </div>
      </div>
    </div>
  )
}
