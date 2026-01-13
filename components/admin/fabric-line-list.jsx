"use client"

import { useState, useEffect } from "react"
import FabricLineForm from "./FabricLineForm"

export default function FabricLineList() {
  const [fabricLines, setFabricLines] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingLine, setEditingLine] = useState(null)
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta línea de tela?")) return

    try {
      await fetch(`/api/fabric-lines/${id}`, { method: "DELETE" })
      fetchFabricLines()
    } catch (error) {
      console.error("Error deleting fabric line:", error)
    }
  }

  const handleSave = () => {
    setShowForm(false)
    setEditingLine(null)
    fetchFabricLines()
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setEditingLine(null)
          setShowForm(!showForm)
        }}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
      >
        {showForm ? "Cancelar" : "+ Nueva Línea de Tela"}
      </button>

      {showForm && <FabricLineForm initialData={editingLine} onSave={handleSave} />}

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="grid gap-4">
          {fabricLines.map((line) => (
            <div key={line._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{line.name}</h3>
                  <p className="text-gray-600 text-sm">{line.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingLine(line)
                      setShowForm(true)
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(line._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <p className="text-gray-500 text-sm">{line.fabrics?.length || 0} telas</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
