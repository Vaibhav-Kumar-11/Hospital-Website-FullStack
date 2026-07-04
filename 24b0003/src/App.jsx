import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import HomePage from './pages/HomePage'
import SymptomGuidePage from './pages/SymptomGuidePage'
import DepartmentsPage from './pages/DepartmentsPage'
import DepartmentDetailPage from './pages/DepartmentDetailPage'
import DoctorDetailPage from './pages/DoctorDetailPage'
import BookAppointmentPage from './pages/BookAppointmentPage'
import MyAppointmentsPage from './pages/MyAppointmentsPage'
import HospitalMapPage from './pages/HospitalMapPage'
import EmergencyPage from './pages/EmergencyPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/symptom-guide" element={<SymptomGuidePage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/departments/:slug" element={<DepartmentDetailPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute>
                <BookAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute>
                <MyAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/hospital-map" element={<HospitalMapPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
