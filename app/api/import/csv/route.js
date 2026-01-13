import { connectDB } from "@/lib/mongodb"
import FabricLine from "@/lib/models/FabricLine"
import Fabric from "@/lib/models/Fabric"
import Papa from "papaparse"

export async function POST(request) {
  try {
    await connectDB()
    const { csvContent } = await request.json()

    const results = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    })

    if (results.errors.length > 0) {
      return Response.json(
        { success: false, error: "Error al procesar CSV: " + results.errors[0].message },
        { status: 400 },
      )
    }

    const data = results.data
    const createdFabricLines = []
    const createdFabrics = []
    const errors = []

    for (const row of data) {
      try {
        let fabricLine = await FabricLine.findOne({ name: row.linea_nombre })

        if (!fabricLine) {
          fabricLine = await FabricLine.create({
            name: row.linea_nombre,
            description: row.linea_descripcion || "",
          })
          createdFabricLines.push(fabricLine._id)
        }

        const fabric = await Fabric.create({
          name: row.tela_nombre,
          color: row.tela_color,
          image: row.tela_imagen || "",
          fabricLine: fabricLine._id,
          closure: {
            code: row.cierre_codigo,
            color: row.cierre_color,
            image: row.cierre_imagen || "",
          },
          thread: {
            code: row.hilo_codigo,
            color: row.hilo_color,
            image: row.hilo_imagen || "",
          },
        })

        await FabricLine.findByIdAndUpdate(fabricLine._id, {
          $push: { fabrics: fabric._id },
        })

        createdFabrics.push(fabric._id)
      } catch (error) {
        errors.push(`Error en fila ${data.indexOf(row) + 2}: ${error.message}`)
      }
    }

    return Response.json({
      success: true,
      message: `Importación completada. Líneas creadas: ${createdFabricLines.length}, Telas creadas: ${createdFabrics.length}`,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 })
  }
}
