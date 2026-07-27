// app/api/fabrics/[id]/route.js
import { connectDB } from "@/lib/mongodb"
import Fabric from "@/lib/models/Fabric"

export async function DELETE(request, { params }) {
  try {
    // Desempaquetar params (Next.js 15+)
    const { id } = await params
    
    console.log(`🗑️ Intentando eliminar tela con ID: ${id}`)
    
    await connectDB()
    
    // Verificar si la tela existe
    const fabric = await Fabric.findById(id)
    
    if (!fabric) {
      console.log(`❌ Tela no encontrada: ${id}`)
      return Response.json({ 
        success: false, 
        error: "Tela no encontrada" 
      }, { status: 404 })
    }

    console.log(`📦 Tela encontrada: ${fabric.name}`)
    
    // Eliminar la tela
    await Fabric.findByIdAndDelete(id)
    console.log(`✅ Tela eliminada exitosamente: ${fabric.name}`)

    return Response.json({ 
      success: true, 
      message: "Tela eliminada correctamente",
      data: {
        deletedFabric: fabric.name
      }
    })
    
  } catch (error) {
    console.error("❌ DELETE fabric error:", error)
    return Response.json({ 
      success: false, 
      error: error.message || "Error al eliminar la tela"
    }, { status: 500 })
  }
}

// También necesitas implementar PUT para editar
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    
    await connectDB()
    const body = await request.json()

    const fabric = await Fabric.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )

    if (!fabric) {
      return Response.json({ 
        success: false, 
        error: "Tela no encontrada" 
      }, { status: 404 })
    }

    return Response.json({ success: true, data: fabric })
    
  } catch (error) {
    console.error("PUT fabric error:", error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 })
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params
    
    await connectDB()
    const fabric = await Fabric.findById(id)
      .populate("fabricLine")

    if (!fabric) {
      return Response.json({ 
        success: false, 
        error: "Tela no encontrada" 
      }, { status: 404 })
    }

    return Response.json({ success: true, data: fabric })
    
  } catch (error) {
    console.error("GET fabric error:", error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}