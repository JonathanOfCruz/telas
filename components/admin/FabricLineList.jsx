"use client"

import { useState } from "react"
import { FabricLineForm } from "./FabricLineForm"

export function FabricLineList({ fabricLines, onRefresh }) {
  const [editingId, setEditingId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta línea de tela?")) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/fabric-lines/${id}`, { method: "DELETE" })
      if (res.ok) {
        onRefresh()
        setDeleting(null)
      }
    } catch (error) {
      console.error("Error deleting fabric line:", error)
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Líneas de Telas Registradas</h2>

      {fabricLines.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No hay líneas de telas registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fabricLines.map((line) => (
            <div key={line._id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{line.name}</h3>
                  {line.description && <p className="text-gray-600 text-sm mt-1">{line.description}</p>}
                  <p className="text-sm text-gray-500 mt-2">{line.fabrics?.length || 0} tela(s) asociada(s)</p>
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
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    {deleting === line._id ? "Eliminando..." : "Eliminar"}
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
