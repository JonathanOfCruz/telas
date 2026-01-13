import { LoginForm } from "@/components/auth/LoginForm"

export const metadata = {
  title: "Admin Login - Textile Catalog",
  description: "Acceso de administrador",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <LoginForm />
    </main>
  )
}
