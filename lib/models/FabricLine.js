// lib/models/FabricLine.js - VERSIÓN CORREGIDA
import mongoose from "mongoose"

const fabricLineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la línea es requerido"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    fabrics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fabric",
        default: [],
      },
    ],
  },
  { timestamps: true },
)

// Exportar directamente
const FabricLine = mongoose.models.FabricLine || mongoose.model("FabricLine", fabricLineSchema)
export default FabricLine