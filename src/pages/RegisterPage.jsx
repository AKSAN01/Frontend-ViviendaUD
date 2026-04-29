import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      const response = await fetch('http://localhost:8081/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Ajusta si tu backend pide más datos
      })

      if (!response.ok) throw new Error('Error al registrar estudiante')

      const data = await response.json()
      // Guardamos el token automáticamente y lo mandamos al inicio
      localStorage.setItem('token', data.token)
      alert("¡Registro exitoso! Bienvenido a NexoV.")
      navigate('/') 

    } catch (error) {
      console.error(error)
      setErrorMsg('No se pudo completar el registro. Verifica los datos.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0f172a] via-[#001e2b] to-black">
      <div className="bg-light-card border border-light-border p-8 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-deep to-blue-vibrant text-transparent bg-clip-text mb-2 tracking-tight">
            Crear Cuenta
          </h1>
          <p className="text-gray-500 text-sm font-medium">Únete a NexoV como estudiante</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">{errorMsg}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Institucional</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="estudiante@udistrital.edu.co" className="w-full bg-white border border-light-border rounded-lg px-4 py-3 text-blue-deep placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-vibrant transition-all" required disabled={isLoading} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-light-border rounded-lg px-4 py-3 text-blue-deep placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-vibrant transition-all" required disabled={isLoading} />
          </div>

          <button type="submit" disabled={isLoading} className={`w-full font-semibold py-3 rounded-xl transition-all text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-vibrant hover:bg-[#1d4ed8] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'}`}>
            {isLoading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta? <Link to="/login" className="text-blue-vibrant hover:underline font-medium">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  )
}