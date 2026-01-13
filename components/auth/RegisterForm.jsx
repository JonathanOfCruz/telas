// components/auth/RegisterForm.jsx - VERSIÓN CORREGIDA
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          confirmPassword
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al registrarse")
        setLoading(false)
        return
      }

      // Redirigir al dashboard después del registro exitoso
      console.log("✅ Registration successful, redirecting...")
      router.push("/admin/dashboard")
      router.refresh()
      
    } catch (err) {
      setError("Error de conexión: " + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleRegister} className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Registrar Admin</h2>
        <p className="text-gray-600 text-center mb-8">Crea una nueva cuenta de administrador</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@textile.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña (mínimo 6 caracteres)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <div className="mt-4 text-center">
          <a href="/admin/login" className="text-blue-600 hover:text-blue-800 text-sm">
            ¿Ya tienes cuenta? Inicia sesión
          </a>
        </div>
      </form>
    </div>
  )
}