"use client"

import { useState } from "react"

export function FabricLineCard({ fabricLine, onFabricSelect }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div onClick={() => setExpanded(!expanded)} className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
        <h3 className="text-xl font-semibold text-gray-900">{fabricLine.name}</h3>
        {fabricLine.description && <p className="text-gray-600 text-sm mt-1">{fabricLine.description}</p>}
        <div className="mt-4 text-sm text-blue-600 font-medium">
          {expanded ? "- Ocultar telas" : `+ Ver ${fabricLine.fabrics?.length || 0} tela(s)`}
        </div>
      </div>

      {expanded && fabricLine.fabrics && fabricLine.fabrics.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {fabricLine.fabrics.map((fabric) => (
              <div
                key={fabric._id}
                onClick={() => onFabricSelect(fabric)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow text-center group"
              >
                {fabric.image && (
                  <img
                    src={fabric.image || "/placeholder.svg"}
                    alt={fabric.name}
                    className="w-full h-24 object-cover rounded mb-3 group-hover:brightness-110 transition-all"
                  />
                )}
                <p className="font-medium text-sm text-gray-900 truncate">{fabric.name}</p>
                <p className="text-xs text-gray-500 mt-1">{fabric.color}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {expanded && (!fabricLine.fabrics || fabricLine.fabrics.length === 0) && (
        <div className="border-t border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
          No hay telas disponibles en esta línea
        </div>
      )}
    </div>
  )
}
