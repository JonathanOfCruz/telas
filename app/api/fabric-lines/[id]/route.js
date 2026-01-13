// app/api/fabric-lines/[id]/route.js - VERSIÓN CORREGIDA
import { connectDB } from "@/lib/mongodb"
import FabricLine from "@/lib/models/FabricLine"
import Fabric from "@/lib/models/Fabric" // IMPORTANTE: Importar también Fabric

export async function GET(request, { params }) {
  try {
    await connectDB()
    const fabricLine = await FabricLine.findById(params.id).populate("fabrics")

    if (!fabricLine) {
      return Response.json({ 
        success: false, 
        error: "Línea de tela no encontrada" 
      }, { status: 404 })
    }

    return Response.json({ success: true, data: fabricLine })
  } catch (error) {
    console.error("GET fabric-line by id error:", error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const body = await request.json()

    const fabricLine = await FabricLine.findByIdAndUpdate(
      params.id, 
      body, 
      {
        new: true,
        runValidators: true,
      }
    ).populate("fabrics")

    if (!fabricLine) {
      return Response.json({ 
        success: false, 
        error: "Línea de tela no encontrada" 
      }, { status: 404 })
    }

    return Response.json({ success: true, data: fabricLine })
  } catch (error) {
    console.error("PUT fabric-line error:", error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    
    // Primero, eliminar todas las telas asociadas
    await Fabric.deleteMany({ fabricLine: params.id })
    
    // Luego, eliminar la línea de tela
    const fabricLine = await FabricLine.findByIdAndDelete(params.id)

    if (!fabricLine) {
      return Response.json({ 
        success: false, 
        error: "Línea de tela no encontrada" 
      }, { status: 404 })
    }

    return Response.json({ 
      success: true, 
      data: {},
      message: "Línea de tela y sus telas asociadas eliminadas correctamente"
    })
  } catch (error) {
    console.error("DELETE fabric-line error:", error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}