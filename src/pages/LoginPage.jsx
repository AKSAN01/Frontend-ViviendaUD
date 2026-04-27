import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Herramienta para navegar entre pantallas
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      const response = await fetch('http://localhost:8081/api/v1/auth/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Credenciales incorrectas')

      const data = await response.json()
      localStorage.setItem('token', data.token)

      // ¡Aquí ocurre la magia! Redirigimos al dashboard
      navigate('/dashboard')

    } catch (error) {
      console.error(error)
      setErrorMsg('Correo o contraseña incorrectos. Por favor, verifica tus datos.')
    } finally {
      setIsLoading(false)
    }
  }

  // ... Aquí va exactamente el mismo return (HTML) que ya tenías en App.jsx ...
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0f172a] via-[#001e2b] to-black">
      <div className="bg-light-card border border-light-border p-8 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-deep to-blue-vibrant text-transparent bg-clip-text mb-2 tracking-tight">
            NexoV
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Encuentra tu alojamiento ideal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Institucional</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="estudiante@udistrital.edu.co" className="w-full bg-white border border-light-border rounded-lg px-4 py-3 text-blue-deep placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-vibrant focus:border-blue-vibrant transition-all duration-300" required disabled={isLoading} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border border-light-border rounded-lg px-4 py-3 text-blue-deep placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-vibrant focus:border-blue-vibrant transition-all duration-300" required disabled={isLoading} />
          </div>

          <button type="submit" disabled={isLoading} className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 ease-in-out text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-vibrant hover:bg-[#1d4ed8] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'}`}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta? <a href="#" className="text-blue-vibrant hover:underline font-medium transition-colors duration-300">Regístrate aquí</a>
        </div>
      </div>
    </div>
  )
}