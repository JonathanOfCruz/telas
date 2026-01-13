// app/api/fabrics/route.js - VERSIÓN CORREGIDA
import { connectDB } from "@/lib/mongodb"
import Fabric from "@/lib/models/Fabric"
import FabricLine from "@/lib/models/FabricLine" // IMPORTANTE: Importar también FabricLine

export async function GET(request) {
  try {
    await connectDB()
    const fabrics = await Fabric.find().populate("fabricLine").sort({ createdAt: -1 })
    return Response.json({ success: true, data: fabrics })
  } catch (error) {
    console.error("GET fabrics error:", error)
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

    // Verificar que la línea de tela exista
    const fabricLineExists = await FabricLine.findById(body.fabricLine)
    if (!fabricLineExists) {
      return Response.json({ 
        success: false, 
        error: "Línea de tela no encontrada" 
      }, { status: 404 })
    }

    // Crear la tela
    const fabric = await Fabric.create(body)
    
    // Actualizar la línea de tela para agregar esta tela
    await FabricLine.findByIdAndUpdate(
      body.fabricLine,
      { $push: { fabrics: fabric._id } },
      { new: true }
    )

    // Poblar la relación antes de devolver
    const populatedFabric = await Fabric.findById(fabric._id).populate("fabricLine")
    
    return Response.json({ 
      success: true, 
      data: populatedFabric 
    }, { status: 201 })
    
  } catch (error) {
    console.error("POST fabric error:", error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 })
  }
}