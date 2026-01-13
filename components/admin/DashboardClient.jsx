// components/admin/DashboardClient.jsx - DISEÑO MINIMALISTA
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FabricLineList } from "./FabricLineList"
import { FabricLineForm } from "./FabricLineForm"
import { FabricManagement } from "./FabricManagement"
import { ImportSection } from "./ImportSection"

export function DashboardClient() {
  const [adminEmail, setAdminEmail] = useState("")
  const [activeTab, setActiveTab] = useState("lines")
  const [fabricLines, setFabricLines] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    verifyAuth()
  }, [])

  useEffect(() => {
    if (adminEmail) {
      fetchFabricLines()
    }
  }, [refreshKey, adminEmail])

  const verifyAuth = async () => {
    try {
      const res = await fetch("/api/auth/verify")
      const data = await res.json()
      
      if (!data.authenticated) {
        router.push("/admin/login")
      } else {
        setAdminEmail(data.admin?.email || "Admin")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Auth error:", error)
      router.push("/admin/login")
    }
  }

  const fetchFabricLines = async () => {
    try {
      const res = await fetch("/api/fabric-lines")
      const data = await res.json()
      if (data.success) {
        setFabricLines(data.data)
      } else {
        console.error("Error fetching fabric lines:", data.error)
      }
    } catch (error) {
      console.error("Error fetching fabric lines:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium tracking-wide">Cargando panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Elegante */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">Textile Catalog</h1>
                  <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-sm">
                  <span className="text-gray-500">Conectado como</span>
                  <span className="ml-2 font-medium text-gray-900">{adminEmail}</span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Estilo minimalista */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "lines", label: "Líneas de Telas" },
              { id: "fabrics", label: "Gestión de Telas" },
              { id: "import", label: "Importar CSV" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tab Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {activeTab === "lines" && "Gestión de Líneas de Telas"}
                  {activeTab === "fabrics" && "Catálogo de Telas"}
                  {activeTab === "import" && "Importar Datos"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === "lines" && "Crea y gestiona las líneas de telas del catálogo"}
                  {activeTab === "fabrics" && "Administra el inventario de telas y sus especificaciones"}
                  {activeTab === "import" && "Importa datos en masa desde archivos CSV"}
                </p>
              </div>
              
              <div className="hidden md:block">
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeTab === "lines" && fabricLines.length}
                    {activeTab === "fabrics" && fabricLines.reduce((acc, line) => acc + (line.fabrics?.length || 0), 0)}
                    {activeTab === "import" && "—"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {activeTab === "lines" && "líneas registradas"}
                    {activeTab === "fabrics" && "telas en inventario"}
                    {activeTab === "import" && "archivos importados"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "lines" && (
              <div className="space-y-12">
                <section className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Nueva Línea de Tela</h3>
                      <p className="text-sm text-gray-500 mt-1">Crea una nueva línea para organizar las telas</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                  <FabricLineForm onSuccess={() => setRefreshKey((k) => k + 1)} />
                </section>

                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Líneas Registradas</h3>
                      <p className="text-sm text-gray-500 mt-1">Todas las líneas de telas disponibles</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-500">
                        Mostrando <span className="font-semibold text-gray-900">{fabricLines.length}</span> líneas
                      </div>
                    </div>
                  </div>
                  <FabricLineList 
                    fabricLines={fabricLines} 
                    onRefresh={() => setRefreshKey((k) => k + 1)} 
                  />
                </section>
              </div>
            )}

            {activeTab === "fabrics" && (
              <section className="space-y-8">
                <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Gestión de Telas</h3>
                      <p className="text-sm text-gray-500 mt-1">Agrega y gestiona telas dentro de las líneas existentes</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <FabricManagement 
                    fabricLines={fabricLines} 
                    onRefresh={() => setRefreshKey((k) => k + 1)} 
                  />
                </div>
              </section>
            )}

            {activeTab === "import" && (
              <section className="space-y-8">
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Importar Datos</h3>
                      <p className="text-sm text-gray-500 mt-1">Carga múltiples telas y líneas desde archivos CSV</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                  </div>
                  <ImportSection onImportSuccess={() => setRefreshKey((k) => k + 1)} />
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Dashboard Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Líneas Activas</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">{fabricLines.length}</div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Total Telas</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  {fabricLines.reduce((acc, line) => acc + (line.fabrics?.length || 0), 0)}
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500">Sesión Activa</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">Admin</div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-100 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Textile Catalog • Sistema de Gestión Textil
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500">v1.0.0</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Sistema en línea</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}