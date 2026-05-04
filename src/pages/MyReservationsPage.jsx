import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function MyReservationsPage() {
  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/v1/reservas', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error('No se pudieron obtener tus reservas')

        const data = await response.json()
        setReservas(data)
      } catch (err) {
        console.error(err)
        setError('No pudimos cargar tus reservas en este momento.')
      } finally {
        setIsLoading(false)
      }
    }

    if (token) fetchReservas()
    else navigate('/login')
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header de navegación interna */}
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="text-blue-vibrant font-semibold flex items-center gap-2 hover:underline">
            ← Volver al Inicio
          </Link>
          <h1 className="text-2xl font-bold text-blue-deep">Mis Reservas</h1>
          <div className="w-24"></div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-vibrant"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            {reservas.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
                <p className="text-gray-500 mb-4">Aún no has solicitado ninguna reserva.</p>
                <Link to="/" className="bg-blue-vibrant text-white px-6 py-2 rounded-lg font-medium">
                  Explorar Viviendas
                </Link>
              </div>
            ) : (
              reservas.map((reserva) => (
                <div key={reserva.id} className="bg-white p-6 rounded-2xl shadow-sm border border-light-border flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-blue-deep">
                      {reserva.viviendaTitulo || "Alojamiento solicitado"}
                    </h3>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <p> Entrada: <span className="font-medium text-gray-700">{reserva.fechaInicio}</span></p>
                      <p> Salida: <span className="font-medium text-gray-700">{reserva.fechaFin}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      reserva.estado === 'APROBADA' ? 'bg-green-100 text-green-600' :
                      reserva.estado === 'RECHAZADA' ? 'bg-red-100 text-red-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {reserva.estado || 'PENDIENTE'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}