import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// ─────────────────────────────────────────────
// Constantes: Universidades con coordenadas
// ─────────────────────────────────────────────
const UNIVERSIDADES = [
  { id: 'todas',        nombre: 'Todas las ubicaciones',               lat: null,    lng: null },
  { id: 'macarena',     nombre: 'U. Distrital – Sede Macarena',         lat: 4.6133,  lng: -74.0664 },
  { id: 'ingenieria',   nombre: 'U. Distrital – Sede Ingeniería',       lat: 4.6280,  lng: -74.0650 },
  { id: 'uniandes',     nombre: 'Universidad de los Andes',            lat: 4.6015,  lng: -74.0664 },
  { id: 'javeriana',    nombre: 'Pontificia U. Javeriana',             lat: 4.6281,  lng: -74.0641 },
  { id: 'rosario',      nombre: 'Universidad del Rosario',             lat: 4.5983,  lng: -74.0739 },
  { id: 'sabana',       nombre: 'Universidad de La Sabana',            lat: 4.8608,  lng: -74.0355 },
  { id: 'externado',    nombre: 'Universidad Externado de Colombia',   lat: 4.6093,  lng: -74.0701 },
  { id: 'ean',          nombre: 'Universidad EAN',                     lat: 4.6524,  lng: -74.0576 },
  { id: 'bosque',       nombre: 'Universidad El Bosque',               lat: 4.6878,  lng: -74.0477 },
]

// ─────────────────────────────────────────────
// Fórmula de Haversine
// Retorna la distancia en kilómetros entre dos
// coordenadas geográficas (lat/lng en grados).
// ─────────────────────────────────────────────
function calcularDistanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371 // Radio de la Tierra en km
  const toRad = (deg) => (deg * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// ─────────────────────────────────────────────
// Componente Principal
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()
  const [viviendas, setViviendas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados del Modal de Reserva
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVivienda, setSelectedVivienda] = useState(null)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [isReserving, setIsReserving] = useState(false)

  // Estados del Filtro de Proximidad
  const [universidadId, setUniversidadId] = useState('todas')
  const [distanciaKm, setDistanciaKm] = useState(5)

  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  // ── Fetch de viviendas ──────────────────────
  useEffect(() => {
    const fetchViviendas = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' }
        if (token) headers['Authorization'] = `Bearer ${token}`

        const response = await fetch('http://localhost:8081/api/v1/viviendas', {
          method: 'GET',
          headers,
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

  // ── Lógica de filtrado (memoizada) ──────────
  const viviendasFiltradas = useMemo(() => {
    const universidad = UNIVERSIDADES.find((u) => u.id === universidadId)

    // Si no hay universidad seleccionada (o es "todas"), mostrar todo
    if (!universidad || universidad.lat === null) return viviendas

    return viviendas.filter((v) => {
      // Saltar viviendas sin coordenadas en la BD
      if (v.latitud == null || v.longitud == null) return false

      const distancia = calcularDistanciaKm(
        universidad.lat,
        universidad.lng,
        v.latitud,
        v.longitud
      )
      return distancia <= distanciaKm
    })
  }, [viviendas, universidadId, distanciaKm])

  // ── Handlers ────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

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

  const handleReserva = async (e) => {
    e.preventDefault()
    setIsReserving(true)

    try {
      const response = await fetch('http://localhost:8081/api/v1/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          viviendaId: selectedVivienda.id,
          fechaInicio,
          fechaFin,
        }),
      })

      if (!response.ok) throw new Error('Error al crear la reserva')

      alert('¡Reserva creada con éxito! El arrendador se pondrá en contacto contigo.')
      closeModal()
    } catch (err) {
      console.error(err)
      alert('No se pudo completar la reserva. Verifica las fechas e intenta de nuevo.')
    } finally {
      setIsReserving(false)
    }
  }

  const universidadActual = UNIVERSIDADES.find((u) => u.id === universidadId)
  const filtroActivo = universidadActual?.lat !== null

  // ── Render ───────────────────────────────────
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
                <button
                  onClick={handleLogout}
                  className="bg-white border border-light-border text-gray-600 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition shadow-sm font-medium"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-deep font-medium px-4 py-2 hover:text-blue-vibrant transition">
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-vibrant text-white px-5 py-2 rounded-lg font-medium hover:bg-[#1d4ed8] hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Regístrate
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Encabezado + Filtro de Proximidad */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Alojamientos Disponibles</h2>
          <p className="text-gray-500 text-lg mb-6">
            Explora opciones ideales para tu semestre universitario.
          </p>

          {/* ── Panel de Filtros ── */}
          <div className="bg-white border border-light-border rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-end">

            {/* Selector de Universidad */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                📍 Filtrar por universidad
              </label>
              <select
                value={universidadId}
                onChange={(e) => setUniversidadId(e.target.value)}
                className="w-full bg-gray-50 border border-light-border rounded-xl px-4 py-2.5 text-blue-deep font-medium focus:ring-2 focus:ring-blue-vibrant outline-none cursor-pointer appearance-none"
              >
                {UNIVERSIDADES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Slider de Distancia */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                🗺️ Radio máximo:{' '}
                <span className={`text-blue-vibrant ${!filtroActivo ? 'opacity-40' : ''}`}>
                  {distanciaKm} km
                </span>
              </label>
              <input
                type="range"
                min={0.5}
                max={15}
                step={0.5}
                value={distanciaKm}
                onChange={(e) => setDistanciaKm(Number(e.target.value))}
                disabled={!filtroActivo}
                className="w-full accent-blue-vibrant disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1 select-none">
                <span>0.5 km</span>
                <span>15 km</span>
              </div>
            </div>

            {/* Contador de resultados */}
            <div className="shrink-0 text-right">
              {filtroActivo ? (
                <div className="text-sm">
                  <span className="text-2xl font-extrabold text-blue-deep">
                    {viviendasFiltradas.length}
                  </span>
                  <span className="text-gray-500 ml-1">
                    / {viviendas.length} viviendas
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">dentro del radio</p>
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  <span className="text-2xl font-extrabold text-gray-300">
                    {viviendas.length}
                  </span>
                  <p className="text-xs mt-0.5">viviendas en total</p>
                </div>
              )}
            </div>
          </div>

          {/* Aviso cuando no hay resultados con el filtro activo */}
          {filtroActivo && !isLoading && viviendasFiltradas.length === 0 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-5 py-3 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>
                No hay viviendas disponibles a menos de <strong>{distanciaKm} km</strong> de{' '}
                <strong>{universidadActual?.nombre}</strong>. Intenta aumentar el radio.
              </span>
            </div>
          )}
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-vibrant"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200">
            {error}
          </div>
        )}

        {/* Grid de Viviendas (usa el array filtrado) */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viviendasFiltradas.map((vivienda) => {
              // Calcular y mostrar distancia si hay universidad seleccionada
              const distancia =
                filtroActivo && vivienda.latitud != null
                  ? calcularDistanciaKm(
                      universidadActual.lat,
                      universidadActual.lng,
                      vivienda.latitud,
                      vivienda.longitud
                    ).toFixed(1)
                  : null

              return (
                <div
                  key={vivienda.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-light-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-100 text-blue-vibrant text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {vivienda.tipoAlojamiento}
                    </span>
                    <span className="text-2xl font-extrabold text-gray-800">
                      ${vivienda.precioMensual.toLocaleString('es-CO')}{' '}
                      <span className="text-sm text-gray-500 font-normal">/mes</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-blue-deep mb-2 line-clamp-1">
                    {vivienda.titulo}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2 min-h-[40px]">
                    {vivienda.descripcion}
                  </p>

                  {/* Chip de distancia (solo visible con filtro activo) */}
                  {distancia !== null && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                        📍 {distancia} km de la universidad
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => (isLoggedIn ? openModal(vivienda) : navigate('/login'))}
                    className="w-full bg-blue-50 text-blue-vibrant hover:bg-blue-vibrant hover:text-white font-semibold py-2.5 rounded-xl transition-colors duration-300"
                  >
                    Solicitar Reserva
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal de Reserva */}
      {isModalOpen && selectedVivienda && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <h3 className="text-2xl font-extrabold text-blue-deep mb-1">Confirmar Reserva</h3>
            <p className="text-gray-500 text-sm mb-6">
              Vivienda:{' '}
              <span className="font-semibold text-blue-vibrant">{selectedVivienda.titulo}</span>
            </p>

            <form onSubmit={handleReserva} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Entrada
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-gray-50 border border-light-border rounded-lg px-4 py-2.5 text-blue-deep focus:ring-2 focus:ring-blue-vibrant outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Salida
                </label>
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
                  className={`flex-1 font-semibold py-3 rounded-xl text-white transition-all ${
                    isReserving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-vibrant hover:bg-[#1d4ed8]'
                  }`}
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