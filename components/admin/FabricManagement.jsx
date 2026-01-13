"use client"

import { useState } from "react"
import { FabricForm } from "./FabricForm"

export function FabricManagement({ fabricLines, onRefresh }) {
  const [selectedLineId, setSelectedLineId] = useState(fabricLines[0]?._id || "")
  const [fabrics, setFabrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const handleLineSelect = async (lineId) => {
    setSelectedLineId(lineId)
    await fetchFabrics(lineId)
  }

  const fetchFabrics = async (lineId) => {
    setLoading(true)
    try {
      const res = await fetch("/api/fabrics")
      const data = await res.json()
      if (data.success) {
        const linesFabrics = data.data.filter((f) => f.fabricLine._id === lineId)
        setFabrics(linesFabrics)
      }
    } catch (error) {
      console.error("Error fetching fabrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFabric = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tela?")) return

    try {
      const res = await fetch(`/api/fabrics/${id}`, { method: "DELETE" })
      if (res.ok) {
        await fetchFabrics(selectedLineId)
        onRefresh()
      }
    } catch (error) {
      console.error("Error deleting fabric:", error)
    }
  }

  const selectedLine = fabricLines.find((l) => l._id === selectedLineId)

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Seleccionar Línea de Tela</label>
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

      {selectedLine && <FabricForm fabricLineId={selectedLine._id} onSuccess={() => fetchFabrics(selectedLineId)} />}

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Telas de {selectedLine?.name}</h3>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Cargando telas...</div>
        ) : fabrics.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No hay telas en esta línea</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fabrics.map((fabric) => (
              <div key={fabric._id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{fabric.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">Color: {fabric.color}</p>
                    <p className="text-sm text-gray-600">Cierre: {fabric.closure.code}</p>
                    <p className="text-sm text-gray-600">Hilo: {fabric.thread.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(editingId === fabric._id ? null : fabric._id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
                    >
                      {editingId === fabric._id ? "Cancelar" : "Editar"}
                    </button>
                    <button
                      onClick={() => handleDeleteFabric(fabric._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

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
