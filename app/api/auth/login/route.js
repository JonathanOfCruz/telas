// app/api/auth/login/route.js - VERSIÓN CORREGIDA
import { connectDB } from "@/lib/mongodb"
import Admin from "@/lib/models/Admin"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(request) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ 
        success: false, 
        error: "Email y contraseña requeridos" 
      }, { status: 400 })
    }

    // Buscar admin
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return Response.json({ 
        success: false, 
        error: "Email o contraseña inválidos" 
      }, { status: 401 })
    }

    // Comparar contraseña manualmente
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return Response.json({ 
        success: false, 
        error: "Email o contraseña inválidos" 
      }, { status: 401 })
    }

    // Obtener el cookie store
    const cookieStore = await cookies()
    
    // Establecer la cookie usando cookies() de next/headers
    cookieStore.set("admin_id", admin._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    })

    return Response.json({ 
      success: true, 
      data: { 
        email: admin.email, 
        adminId: admin._id 
      } 
    })
    
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 })
  }
}