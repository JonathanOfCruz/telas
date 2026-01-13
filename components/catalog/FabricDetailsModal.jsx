// components/catalog/FabricDetailsModal.jsx - VERSIÓN CON TEXTO DE ESPECIFICACIONES
"use client"

import { useState, useEffect } from "react"

export function FabricDetailsModal({ fabric, onClose }) {
  const [activeImage, setActiveImage] = useState("fabric")
  const [zoom, setZoom] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assorted-fabrics.png"
    if (imagePath.startsWith("http")) return imagePath
    return imagePath
  }

  const imageTabs = [
    { 
      id: "fabric", 
      label: isMobile ? "Tela" : "Vista de la Tela", 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    { 
      id: "closure", 
      label: isMobile ? "Cierre" : "Detalle del Cierre", 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    { 
      id: "thread", 
      label: isMobile ? "Hilo" : "Detalle del Hilo", 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]

  const getCurrentImage = () => {
    return activeImage === "fabric" 
      ? fabric.image 
      : activeImage === "closure" 
        ? fabric.closure.image 
        : fabric.thread.image
  }

  // Texto de especificaciones
  const specificationsText = `Esta tela ${fabric.name} utiliza un cierre ${fabric.closure.code} de color ${fabric.closure.color}, además utiliza un hilo ${fabric.thread.code} de color ${fabric.thread.color}.`

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-2 md:p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl lg:max-w-6xl h-[90vh] md:h-[85vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="shrink-0 bg-white border-b border-gray-100 px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight truncate">{fabric.name}</h2>
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm text-gray-500 truncate">Detalles completos de la tela</p>
                    {/* Texto de especificaciones */}
                    <div className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-2xl">
                      Esta tela <span className="font-semibold text-gray-900">{fabric.name}</span> utiliza un cierre{' '}
                      <span className="font-semibold text-gray-900">{fabric.closure.code}</span> de color{' '}
                      <span className="font-semibold text-gray-900">{fabric.closure.color}</span>, además utiliza un hilo{' '}
                      <span className="font-semibold text-gray-900">{fabric.thread.code}</span> de color{' '}
                      <span className="font-semibold text-gray-900">{fabric.thread.color}</span>.
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="group w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-hover:text-gray-700 transition-colors" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - Scrollable Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
              {/* Left Column - Images */}
              <div className="space-y-6">
                {/* Main Image with Zoom */}
                <div className={`relative bg-gray-50 rounded-xl border border-gray-200 overflow-hidden ${
                  zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                  onClick={() => setZoom(!zoom)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={getImageUrl(getCurrentImage())}
                      alt={imageTabs.find(t => t.id === activeImage)?.label || "Imagen de la tela"}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        zoom ? 'scale-150' : 'scale-100'
                      }`}
                    />
                    
                    {/* Zoom Indicator */}
                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                      <div className="px-2 py-1 md:px-3 md:py-1.5 bg-black/50 backdrop-blur-sm rounded-full flex items-center space-x-1.5">
                        {zoom ? (
                          <>
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-xs font-medium text-white hidden md:inline">Alejar</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            <span className="text-xs font-medium text-white hidden md:inline">Acercar</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Tabs */}
                <div className="flex gap-2">
                  {imageTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveImage(tab.id)
                        setZoom(false)
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl font-medium text-xs md:text-sm transition-all ${
                        activeImage === tab.id
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                    >
                      {tab.icon}
                      <span className="truncate">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column - Information */}
              <div className="space-y-6">
                {/* Fabric Information Card */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">Información de la Tela</h3>
                      <div className="text-xs md:text-sm text-gray-500 font-medium">Principal</div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="min-w-0">
                          <p className="text-xs md:text-sm font-medium text-gray-500">Nombre</p>
                          <p className="text-base md:text-lg font-semibold text-gray-900 mt-1 truncate">{fabric.name}</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0 ml-3">
                          <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="space-y-4 md:space-y-6">
                        {/* Color de Tela con Imagen Pequeña */}
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500 mb-2">Color</p>
                          <div className="flex items-center space-x-3">
                            <div className="relative w-5 h-5 rounded border border-gray-300 overflow-hidden">
                              <img
                                src={getImageUrl(fabric.image)}
                                alt={`Color ${fabric.color}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="font-semibold text-gray-900">{fabric.color}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Closure Information Card */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">Especificaciones del Cierre</h3>
                      <div className="text-xs md:text-sm text-gray-500 font-medium">Accesorio</div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="space-y-4 md:space-y-6">
                      {/* Información del Cierre */}
                      <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500 mb-2">Código</p>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-lg md:text-xl font-bold text-gray-900 truncate">{fabric.closure.code}</p>
                              <p className="text-xs text-gray-500">Identificador único</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500 mb-2">Color</p>
                          <div className="flex items-center space-x-3">
                            <div className="relative w-5 h-5 rounded border border-gray-300 overflow-hidden">
                              <img
                                src={getImageUrl(fabric.closure.image)}
                                alt={`Color ${fabric.closure.color}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="font-semibold text-gray-900">{fabric.closure.color}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thread Information Card */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">Especificaciones del Hilo</h3>
                      <div className="text-xs md:text-sm text-gray-500 font-medium">Complemento</div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="space-y-4 md:space-y-6">
                      {/* Información del Hilo */}
                      <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500 mb-2">Código</p>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-lg md:text-xl font-bold text-gray-900 truncate">{fabric.thread.code}</p>
                              <p className="text-xs text-gray-500">Identificador único</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-500 mb-2">Color</p>
                          <div className="flex items-center space-x-3">
                            <div className="relative w-5 h-5 rounded border border-gray-300 overflow-hidden">
                              <img
                                src={getImageUrl(fabric.thread.image)}
                                alt={`Color ${fabric.thread.color}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="font-semibold text-gray-900">{fabric.thread.color}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 bg-white border-t border-gray-100 px-4 md:px-8 py-4 md:py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
              <div className="text-xs md:text-sm text-gray-500 truncate">
                <span className="font-medium">ID:</span> {fabric._id} • <span className="font-medium">Línea:</span> {fabric.fabricLine?.name || "Sin línea asignada"}
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200"
                >
                  Cerrar
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Imprimir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}