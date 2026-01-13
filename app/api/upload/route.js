// app/api/upload/route.js - VERSIÓN MEJORADA
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

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ 
        success: false, 
        error: "Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, JPG, PNG, WEBP, GIF)" 
      }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return Response.json({ 
        success: false, 
        error: "El archivo es demasiado grande. Máximo 5MB" 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear directorio de uploads si no existe
    const uploadsDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    // Generar nombre único para el archivo
    const originalName = file.name
    const extension = originalName.split(".").pop()
    const filename = `${uuidv4()}.${extension}`
    const filepath = join(uploadsDir, filename)

    // Guardar archivo
    await writeFile(filepath, buffer)

    // Retornar URL relativa
    const imageUrl = `/uploads/${filename}`

    return Response.json({ 
      success: true, 
      filename,
      path: imageUrl,
      url: imageUrl,
      message: "Imagen subida correctamente"
    })
    
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json({ 
      success: false, 
      error: "Error interno del servidor al subir la imagen" 
    }, { status: 500 })
  }
}