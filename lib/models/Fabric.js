// lib/models/Fabric.js - VERSIÓN CORREGIDA
import mongoose from "mongoose"

const fabricSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la tela es requerido"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "El color es requerido"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "La imagen de la tela es requerida"],
      default: "/assorted-fabrics.png",
    },
    closure: {
      code: {
        type: String,
        required: [true, "El código de cierre es requerido"],
      },
      color: {
        type: String,
        required: [true, "El color de cierre es requerido"],
      },
      image: {
        type: String,
        default: "/assorted-fabrics.png",
      },
    },
    thread: {
      code: {
        type: String,
        required: [true, "El código de hilo es requerido"],
      },
      color: {
        type: String,
        required: [true, "El color de hilo es requerido"],
      },
      image: {
        type: String,
        default: "/assorted-fabrics.png",
      },
    },
    fabricLine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FabricLine",
      required: true,
    },
  },
  { timestamps: true },
)

// Exportar directamente
const Fabric = mongoose.models.Fabric || mongoose.model("Fabric", fabricSchema)
export default Fabric