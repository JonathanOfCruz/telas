"use client"

import { useState } from "react"

export default function FabricDetailsModal({ fabric, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!isOpen) return null

  const images = fabric.images || []
  const currentImage = images[currentImageIndex]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Close button */}
          <button onClick={onClose} className="float-right text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">{fabric.name}</h2>

          {/* Images carousel */}
          {images.length > 0 && (
            <div className="mb-6">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square mb-3">
                {currentImage && (
                  <img
                    src={currentImage || "/placeholder.svg"}
                    alt={fabric.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={prevImage}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded font-medium text-sm"
                  >
                    ← Anterior
                  </button>
                  <div className="flex-1 flex items-center justify-center text-sm text-gray-600">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                  <button
                    onClick={nextImage}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded font-medium text-sm"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Fabric details tabs */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Información</h3>
              <p className="text-gray-600 text-sm">{fabric.description || "Sin descripción"}</p>
            </div>

            {fabric.closure && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cierre</h3>
                <p className="text-gray-600 text-sm">{fabric.closure}</p>
              </div>
            )}

            {fabric.thread && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hilo</h3>
                <p className="text-gray-600 text-sm">{fabric.thread}</p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
