"use client"

import { useState, useEffect } from "react"
import FabricLineCard from "./FabricLineCard"

export default function CatalogClient() {
  const [fabricLines, setFabricLines] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
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

  const filteredLines = fabricLines.filter(
    (line) =>
      line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de Telas</h1>
          <input
            type="text"
            placeholder="Buscar líneas de telas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Cargando...</div>
        ) : filteredLines.length === 0 ? (
          <div className="text-center text-gray-500">No se encontraron líneas de telas</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLines.map((line) => (
              <FabricLineCard key={line._id} fabricLine={line} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
