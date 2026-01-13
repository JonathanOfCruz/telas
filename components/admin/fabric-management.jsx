"use client"

import { useState, useEffect } from "react"
import FabricForm from "./FabricForm"

export default function FabricManagement() {
  const [fabrics, setFabrics] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingFabric, setEditingFabric] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFabrics()
  }, [])

  const fetchFabrics = async () => {
    try {
      const res = await fetch("/api/fabrics")
      const data = await res.json()
      setFabrics(data)
    } catch (error) {
      console.error("Error fetching fabrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta tela?")) return

    try {
      await fetch(`/api/fabrics/${id}`, { method: "DELETE" })
      fetchFabrics()
    } catch (error) {
      console.error("Error deleting fabric:", error)
    }
  }

  const handleSave = () => {
    setShowForm(false)
    setEditingFabric(null)
    fetchFabrics()
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setEditingFabric(null)
          setShowForm(!showForm)
        }}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
      >
        {showForm ? "Cancelar" : "+ Nueva Tela"}
      </button>

      {showForm && <FabricForm initialData={editingFabric} onSave={handleSave} />}

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="grid gap-4">
          {fabrics.map((fabric) => (
            <div key={fabric._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{fabric.name}</h3>
                  <p className="text-gray-600 text-sm">{fabric.description}</p>
                  {fabric.closure && <p className="text-gray-500 text-sm">Cierre: {fabric.closure}</p>}
                  {fabric.thread && <p className="text-gray-500 text-sm">Hilo: {fabric.thread}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingFabric(fabric)
                      setShowForm(true)
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(fabric._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
