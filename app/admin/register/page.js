import { RegisterForm } from "@/components/auth/RegisterForm"

export const metadata = {
  title: "Admin Register - Textile Catalog",
  description: "Registrar administrador",
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <RegisterForm />
    </main>
  )
}
