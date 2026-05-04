import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MyReservationsPage from './pages/MyReservationsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* El Dashboard ahora es la ruta principal y pública */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mis-reservas" element={<MyReservationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App