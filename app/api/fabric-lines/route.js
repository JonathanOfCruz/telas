// app/api/fabric-lines/route.js - VERSIÓN CORREGIDA
import { connectDB } from "@/lib/mongodb"
import FabricLine from "@/lib/models/FabricLine"
import Fabric from "@/lib/models/Fabric" // IMPORTANTE: Importar también Fabric

export async function GET(request) {
  try {
    await connectDB()
    const fabricLines = await FabricLine.find().populate("fabrics").sort({ createdAt: -1 })
    return Response.json({ success: true, data: fabricLines })
  } catch (error) {
    console.error("GET fabric-lines error:", error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()

    const fabricLine = await FabricLine.create(body)
    return Response.json({ 
      success: true, 
      data: fabricLine 
    }, { status: 201 })
    
  } catch (error) {
    console.error("POST fabric-lines error:", error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 })
  }
}