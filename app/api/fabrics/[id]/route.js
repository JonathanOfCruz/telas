import { connectDB } from "@/lib/mongodb"
import Fabric from "@/lib/models/Fabric"

export async function GET(request, { params }) {
  try {
    await connectDB()
    const fabric = await Fabric.findById(params.id).populate("fabricLine")

    if (!fabric) {
      return Response.json({ success: false, error: "Tela no encontrada" }, { status: 404 })
    }

    return Response.json({ success: true, data: fabric })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const body = await request.json()

    const fabric = await Fabric.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate("fabricLine")

    if (!fabric) {
      return Response.json({ success: false, error: "Tela no encontrada" }, { status: 404 })
    }

    return Response.json({ success: true, data: fabric })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const fabric = await Fabric.findByIdAndDelete(params.id)

    if (!fabric) {
      return Response.json({ success: false, error: "Tela no encontrada" }, { status: 404 })
    }

    return Response.json({ success: true, data: {} })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
