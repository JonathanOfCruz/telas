// app/api/auth/register/route.js - VERSIÓN CORREGIDA
import { connectDB } from "@/lib/mongodb"
import Admin from "@/lib/models/Admin"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(request) {
  console.log("🔵 Register API called")
  
  try {
    console.log("Connecting to DB...")
    await connectDB()
    console.log("✅ DB connected")
    
    const body = await request.json()
    console.log("Request body:", body)

    const { email, password, confirmPassword } = body

    // Validaciones
    if (!email || !password) {
      return Response.json({ 
        success: false, 
        error: "Email y contraseña requeridos" 
      }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return Response.json({ 
        success: false, 
        error: "Las contraseñas no coinciden" 
      }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ 
        success: false, 
        error: "La contraseña debe tener al menos 6 caracteres" 
      }, { status: 400 })
    }

    console.log("Checking if admin exists...")
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      console.log("❌ Admin already exists")
      return Response.json({ 
        success: false, 
        error: "Este email ya está registrado" 
      }, { status: 400 })
    }

    console.log("Creating new admin...")
    
    // Hash manual de la contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    // Crear admin con contraseña hasheada
    const admin = await Admin.create({ 
      email, 
      password: hashedPassword 
    })
    
    console.log("✅ Admin created:", admin.email)

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

    console.log("✅ Registration successful")
    
    return Response.json({ 
      success: true, 
      data: { 
        email: admin.email,
        id: admin._id 
      } 
    }, { status: 201 })
    
  } catch (error) {
    console.error("❌ Registration error:", error.message)
    
    // Manejar errores de MongoDB
    if (error.code === 11000) {
      return Response.json({ 
        success: false, 
        error: "Este email ya está registrado" 
      }, { status: 400 })
    }
    
    return Response.json({ 
      success: false, 
      error: "Error interno del servidor: " + error.message 
    }, { status: 500 })
  }
}