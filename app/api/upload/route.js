// app/api/upload/route.js - VERSIÓN SIN RESTRICCIONES
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file) {
      return Response.json({ 
        success: false, 
        error: "No se proporcionó ningún archivo" 
      }, { status: 400 })
    }

    // Validar que sea una imagen (todos los formatos)
    if (!file.type || !file.type.startsWith("image/")) {
      return Response.json({ 
        success: false, 
        error: "El archivo debe ser una imagen" 
      }, { status: 400 })
    }

    // Sin límite de tamaño - aceptamos cualquier tamaño
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear directorio de uploads si no existe
    const uploadsDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    // Generar nombre único para el archivo
    const originalName = file.name || "imagen"
    const extension = originalName.includes(".") 
      ? originalName.split(".").pop().toLowerCase() 
      : "jpg"
    
    // Sanitizar el nombre de archivo
    const sanitizedExtension = extension.replace(/[^a-zA-Z0-9]/g, "")
    const filename = `${uuidv4()}.${sanitizedExtension}`
    const filepath = join(uploadsDir, filename)

    // Guardar archivo
    await writeFile(filepath, buffer)

    // Verificar que el archivo se guardó correctamente
    const imageUrl = `/uploads/${filename}`

    console.log(`✅ Imagen guardada exitosamente: ${imageUrl}`)
    console.log(`📁 Tamaño: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`)
    console.log(`📝 Nombre original: ${originalName}`)

    return Response.json({ 
      success: true, 
      filename,
      path: imageUrl,
      url: imageUrl,
      message: "Imagen subida correctamente",
      size: buffer.length,
      originalName: originalName
    })
    
  } catch (error) {
    console.error("❌ Upload error:", error)
    console.error("Error stack:", error.stack)
    
    // Devolver más detalles del error en desarrollo
    const isDev = process.env.NODE_ENV === "development"
    
    return Response.json({ 
      success: false, 
      error: "Error interno del servidor al subir la imagen",
      ...(isDev && { 
        details: error.message,
        stack: error.stack 
      })
    }, { status: 500 })
  }
}