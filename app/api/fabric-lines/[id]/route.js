// app/api/fabric-lines/[id]/route.js - VERSIÓN CORREGIDA PARA NEXT.JS 15+
import { connectDB } from "@/lib/mongodb"
import FabricLine from "@/lib/models/FabricLine"
import Fabric from "@/lib/models/Fabric"

export async function GET(request, { params }) {
  try {
    // Desempaquetar params (Next.js 15+)
    const { id } = await params
    
    await connectDB()
    const fabricLine = await FabricLine.findById(id).populate("fabrics")

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
    // Desempaquetar params (Next.js 15+)
    const { id } = await params
    
    await connectDB()
    const body = await request.json()

    const fabricLine = await FabricLine.findByIdAndUpdate(
      id, 
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
    // Desempaquetar params (Next.js 15+)
    const { id } = await params
    
    console.log(`🗑️ Intentando eliminar línea de tela con ID: ${id}`)
    
    await connectDB()
    
    // Verificar si la línea de tela existe
    const fabricLine = await FabricLine.findById(id)
    
    if (!fabricLine) {
      console.log(`❌ Línea de tela no encontrada: ${id}`)
      return Response.json({ 
        success: false, 
        error: "Línea de tela no encontrada" 
      }, { status: 404 })
    }

    console.log(`📦 Línea de tela encontrada: ${fabricLine.name}`)
    console.log(`📊 Telas asociadas: ${fabricLine.fabrics?.length || 0}`)
    
    // Primero, eliminar todas las telas asociadas
    const deleteFabricsResult = await Fabric.deleteMany({ fabricLine: id })
    console.log(`🗑️ Telas eliminadas: ${deleteFabricsResult.deletedCount}`)
    
    // Luego, eliminar la línea de tela
    await FabricLine.findByIdAndDelete(id)
    console.log(`✅ Línea de tela eliminada exitosamente: ${fabricLine.name}`)

    return Response.json({ 
      success: true, 
      data: {},
      message: "Línea de tela y sus telas asociadas eliminadas correctamente",
      details: {
        fabricLineName: fabricLine.name,
        deletedFabrics: deleteFabricsResult.deletedCount
      }
    })
  } catch (error) {
    console.error("❌ DELETE fabric-line error:", error)
    return Response.json({ 
      success: false, 
      error: error.message || "Error al eliminar la línea de tela"
    }, { status: 500 })
  }
}