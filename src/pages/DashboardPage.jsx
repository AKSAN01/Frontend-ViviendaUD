import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  // Estados para guardar los datos y controlar la pantalla de carga
  const [viviendas, setViviendas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Función que trae los datos desde Spring Boot
    const fetchViviendas = async () => {
      try {
        const token = localStorage.getItem('token')
        
        const response = await fetch('http://localhost:8081/api/v1/viviendas', {
          method: 'GET',
          headers: {
            // ¡Aquí está la clave! Enviamos el token en la cabecera
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('No se pudieron cargar las viviendas')
        }

        const data = await response.json()
        setViviendas(data) // Guardamos el array de viviendas en el estado
      } catch (err) {
        console.error("Error fetching viviendas:", err)
        setError('Hubo un problema al conectar con el servidor.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchViviendas()
  }, []) // El array vacío asegura que esto solo se ejecute una vez al entrar

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navbar */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-deep tracking-tight">NexoV</h1>
          <button 
            onClick={handleLogout}
            className="bg-white border border-light-border text-blue-deep px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm font-medium"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Contenido principal */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Alojamientos Disponibles</h2>
          <p className="text-gray-500 text-lg">Explora opciones ideales para tu semestre universitario.</p>
        </div>

        {/* Estados de Carga y Error */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-vibrant"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200">
            {error}
          </div>
        )}

        {/* Grilla de Tarjetas de Vivienda */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viviendas.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-10">No hay viviendas registradas por el momento.</p>
            ) : (
              viviendas.map((vivienda) => (
                <div key={vivienda.id} className="bg-white rounded-2xl p-6 shadow-sm border border-light-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-100 text-blue-vibrant text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {vivienda.tipoAlojamiento}
                    </span>
                    <span className="text-2xl font-extrabold text-gray-800">
                      ${vivienda.precioMensual.toLocaleString('es-CO')} <span className="text-sm text-gray-500 font-normal">/mes</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-blue-deep mb-2 line-clamp-1">
                    {vivienda.titulo}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                    {vivienda.descripcion}
                  </p>

                  <button className="w-full bg-blue-50 text-blue-vibrant hover:bg-blue-vibrant hover:text-white font-semibold py-2.5 rounded-xl transition-colors duration-300">
                    Solicitar Reserva
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}