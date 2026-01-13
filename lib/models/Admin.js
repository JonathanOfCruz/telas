// lib/models/Admin.js - VERSIÓN SIMPLIFICADA
import mongoose from "mongoose"

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: 6,
    },
  },
  { timestamps: true },
)

// NO usar middleware - el hash se hará manualmente
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema)
export default Admin