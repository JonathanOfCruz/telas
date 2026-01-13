"use client"

import { useState } from "react"

export function FabricDetailsModal({ fabric, onClose }) {
  const [activeTab, setActiveTab] = useState("fabric")
  const [activeImage, setActiveImage] = useState("fabric")

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assorted-fabrics.png"
    if (imagePath.startsWith("http")) return imagePath
    return imagePath
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">{fabric.name}</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-600 leading-none font-light">
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
              <img
                src={getImageUrl(
                  activeImage === "fabric"
                    ? fabric.image
                    : activeImage === "closure"
                      ? fabric.closure.image
                      : fabric.thread.image,
                )}
                alt="Detalle"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-2">
              {[
                { id: "fabric", label: "Tela" },
                { id: "closure", label: "Cierre" },
                { id: "thread", label: "Hilo" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveImage(tab.id)}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                    activeImage === tab.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Información de la Tela</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Nombre</p>
                  <p className="font-semibold text-gray-900">{fabric.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Color</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{
                        backgroundColor: isValidColor(fabric.color) ? fabric.color : "#cccccc",
                      }}
                    />
                    <p className="font-semibold text-gray-900">{fabric.color}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Cierre</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Código de Cierre</p>
                  <p className="font-semibold text-gray-900 text-lg">{fabric.closure.code}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Color de Cierre</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{
                        backgroundColor: isValidColor(fabric.closure.color) ? fabric.closure.color : "#cccccc",
                      }}
                    />
                    <p className="font-semibold text-gray-900">{fabric.closure.color}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Hilo</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Código de Hilo</p>
                  <p className="font-semibold text-gray-900 text-lg">{fabric.thread.code}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Color de Hilo</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{
                        backgroundColor: isValidColor(fabric.thread.color) ? fabric.thread.color : "#cccccc",
                      }}
                    />
                    <p className="font-semibold text-gray-900">{fabric.thread.color}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function isValidColor(color) {
  const s = new Option().style
  s.color = color
  return s.color !== ""
}
