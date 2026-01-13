// app/api/auth/verify/route.js - VERSIÓN CORREGIDA
import { connectDB } from "@/lib/mongodb"
import Admin from "@/lib/models/Admin"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const adminId = cookieStore.get("admin_id")?.value

    if (!adminId) {
      return Response.json({ 
        success: false, 
        authenticated: false 
      }, { status: 401 })
    }

    await connectDB()
    const admin = await Admin.findById(adminId)

    if (!admin) {
      return Response.json({ 
        success: false, 
        authenticated: false 
      }, { status: 401 })
    }

    return Response.json({ 
      success: true, 
      authenticated: true, 
      admin: {
        email: admin.email,
        id: admin._id
      }
    })
    
  } catch (error) {
    console.error("Verify error:", error)
    return Response.json({ 
      success: false, 
      authenticated: false,
      error: error.message 
    }, { status: 500 })
  }
}