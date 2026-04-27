import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

// Un componente "Guardián" para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  // Si no hay token guardado, lo devolvemos al login como intruso
  if (!token) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Ruta Pública */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Ruta Privada */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App