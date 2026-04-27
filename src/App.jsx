import { useState } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Aquí conectaremos con tu backend de Spring Boot pronto
    console.log("Intentando iniciar sesión con:", email)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      
      {/* Tarjeta de Login - Ahora blanca con sombra suave */}
      <div className="bg-light-card border border-light-border p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        {/* Título con degradado azul oscuro */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-deep to-blue-vibrant text-transparent bg-clip-text mb-2">
            NexoUD
          </h1>
          <p className="text-gray-600 text-sm">
            Encuentra tu alojamiento ideal
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Institucional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="estudiante@udistrital.edu.co"
              /* Input ahora blanco con borde y texto oscuro */
              className="w-full bg-white border border-light-border rounded-lg px-4 py-3 text-blue-deep placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-vibrant focus:border-blue-vibrant transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-light-border rounded-lg px-4 py-3 text-blue-deep placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-vibrant focus:border-blue-vibrant transition-all"
              required
            />
          </div>

          <button
            type="submit"
            /* Botón con degradado azul oscuro, texto blanco y resplandor azul */
            className="w-full bg-gradient-to-r from-blue-deep to-blue-vibrant hover:from-blue-vibrant hover:to-blue-deep text-white font-bold text-lg py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_4px_15px_rgba(37,99,235,0.2)]"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta? <a href="#" className="text-blue-vibrant hover:underline font-medium">Regístrate aquí</a>
        </div>
        
      </div>
    </div>
  )
}

export default App