"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FabricLineList } from "./FabricLineList"
import FabricManagement from "./FabricManagement"
import ImportSection from "./ImportSection"

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState("lines")
  const [admin, setAdmin] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/verify")
      if (!res.ok) {
        router.push("/admin/login")
        return
      }
      const data = await res.json()
      setAdmin(data.admin)
    } catch (error) {
      router.push("/admin/login")
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{admin?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6 border-b">
          {["lines", "fabrics", "import"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "lines" ? "Líneas de Telas" : tab === "fabrics" ? "Telas" : "Importar CSV"}
            </button>
          ))}
        </div>

        {activeTab === "lines" && <FabricLineList />}
        {activeTab === "fabrics" && <FabricManagement />}
        {activeTab === "import" && <ImportSection />}
      </div>
    </div>
  )
}
