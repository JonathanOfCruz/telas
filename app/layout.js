import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "Textile Catalog - Catálogo de Telas",
  description: "Catálogo digital profesional de líneas de telas para empresas textiles",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
