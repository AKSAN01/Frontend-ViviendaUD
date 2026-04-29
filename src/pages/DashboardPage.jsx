import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [viviendas, setViviendas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para el Modal de Reserva
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVivienda, setSelectedVivienda] = useState(null)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [isReserving, setIsReserving] = useState(false)

  const token = localStorage.getItem('token')
  const isLoggedIn = !!token 

  useEffect(() => {
    const fetchViviendas = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' }
        if (token) headers['Authorization'] = `Bearer ${token}`
        
        const response = await fetch('http://localhost:8081/api/v1/viviendas', {
          method: 'GET',
          headers: headers
        })

        if (!response.ok) throw new Error('No se pudieron cargar las viviendas')

        const data = await response.json()
        setViviendas(data)
      } catch (err) {
        console.error(err)
        setError('Hubo un problema al conectar con el servidor.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchViviendas()
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // Funciones para manejar el modal
  const openModal = (vivienda) => {
    setSelectedVivienda(vivienda)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVivienda(null)
    setFechaInicio('')
    setFechaFin('')
  }

  // Función para enviar la reserva al backend
  const handleReserva = async (e) => {
    e.preventDefault()
    setIsReserving(true)

    try {
      const response = await fetch('http://localhost:8081/api/v1/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          viviendaId: selectedVivienda.id,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin
        })
      })

      if (!response.ok) throw new Error('Error al crear la reserva')

      alert("¡Reserva creada con éxito! El arrendador se pondrá en contacto contigo.")
      closeModal()

    } catch (err) {
      console.error(err)
      alert("No se pudo completar la reserva. Verifica las fechas e intenta de nuevo.")
    } finally {
      setIsReserving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Navbar Dinámica */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-deep tracking-tight">NexoV</h1>
          
          <div className="flex gap-4">
            {isLoggedIn ? (
              <>
                <button className="bg-blue-50 text-blue-vibrant px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
                  Mis Reservas
                </button>
                <button onClick={handleLogout} className="bg-white border border-light-border text-gray-600 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition shadow-sm font-medium">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-deep font-medium px-4 py-2 hover:text-blue-vibrant transition">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="bg-blue-vibrant text-white px-5 py-2 rounded-lg font-medium hover:bg-[#1d4ed8] hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Regístrate
                </Link>
              </>
            )}
          </div>
        </header>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Alojamientos Disponibles</h2>
          <p className="text-gray-500 text-lg">Explora opciones ideales para tu semestre universitario.</p>
        </div>

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

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viviendas.map((vivienda) => (
              <div key={vivienda.id} className="bg-white rounded-2xl p-6 shadow-sm border border-light-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-vibrant text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{vivienda.tipoAlojamiento}</span>
                  <span className="text-2xl font-extrabold text-gray-800">${vivienda.precioMensual.toLocaleString('es-CO')} <span className="text-sm text-gray-500 font-normal">/mes</span></span>
                </div>
                <h3 className="text-xl font-bold text-blue-deep mb-2 line-clamp-1">{vivienda.titulo}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px]">{vivienda.descripcion}</p>
                <button 
                  onClick={() => isLoggedIn ? openModal(vivienda) : navigate('/login')}
                  className="w-full bg-blue-50 text-blue-vibrant hover:bg-blue-vibrant hover:text-white font-semibold py-2.5 rounded-xl transition-colors duration-300"
                >
                  Solicitar Reserva
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE RESERVA (Fondo oscuro borroso + Tarjeta) */}
      {isModalOpen && selectedVivienda && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            
            <h3 className="text-2xl font-extrabold text-blue-deep mb-1">Confirmar Reserva</h3>
            <p className="text-gray-500 text-sm mb-6">
              Vivienda: <span className="font-semibold text-blue-vibrant">{selectedVivienda.titulo}</span>
            </p>

            <form onSubmit={handleReserva} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrada</label>
                <input 
                  type="date" 
                  value={fechaInicio} 
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-gray-50 border border-light-border rounded-lg px-4 py-2.5 text-blue-deep focus:ring-2 focus:ring-blue-vibrant outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Salida</label>
                <input 
                  type="date" 
                  value={fechaFin} 
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full bg-gray-50 border border-light-border rounded-lg px-4 py-2.5 text-blue-deep focus:ring-2 focus:ring-blue-vibrant outline-none"
                  required 
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isReserving}
                  className={`flex-1 font-semibold py-3 rounded-xl text-white transition-all ${isReserving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-vibrant hover:bg-[#1d4ed8]'}`}
                >
                  {isReserving ? 'Procesando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}