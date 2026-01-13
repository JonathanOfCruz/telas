// app/api/auth/logout/route.js - VERSIÓN CORREGIDA
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Obtener el cookie store
    const cookieStore = await cookies()
    
    // Eliminar la cookie
    cookieStore.delete("admin_id")
    
    return Response.json({ 
      success: true, 
      message: "Sesión cerrada" 
    })
    
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}